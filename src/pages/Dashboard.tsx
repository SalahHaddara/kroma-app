import React, {useState, useContext, useEffect} from 'react';
import ImageUploader from '@/components/dashboard/ImageUploader';
import {useSearchParams} from 'react-router-dom';
import {ThemeContext} from '@/services/contexts/ThemeContext';
import {useAuth} from '@/services/contexts/AuthContext';
import {generateDesign, getLatestDesign} from '@/utils/api';
import TabNavigation from '@/components/dashboard/TabNavigation';
import DesignResult from '@/components/dashboard/DesignResult';
import {TabId, DesignState, DesignStatusState, GenerationMessageState} from '@/types/dashboard';
import {processImage} from "@/services/imageService";
import {AnalysisState} from '@/types/designAnalysis';
import {analyzeDesign} from '@/services/designAnalysisService';
import StructuredAnalysisDisplay from "@/components/dashboard/StructuredAnalysisDisplay";
import EnhancedLoading from "@/components/dashboard/EnhancedLoading";

const Dashboard: React.FC = () => {
    const [searchParams] = useSearchParams();
    const {theme} = useContext(ThemeContext);
    const {user} = useAuth();
    const isDark = theme === 'dark';

    const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
    const [designData, setDesignData] = useState<DesignState>({});
    const [designStatus, setDesignStatus] = useState<DesignStatusState>({
        prompt: 'not_started',
        image: 'not_started',
        suggestions: 'not_started'
    });
    const [generationMessage, setGenerationMessage] = useState<GenerationMessageState>({
        prompt: '',
        image: '',
        suggestions: ''
    });
    const [analysisState, setAnalysisState] = useState<AnalysisState>({
        isLoading: false,
        result: null,
        error: null
    });
    const [analysisStage, setAnalysisStage] = useState<string>('initializing');

    const [activeTab, setActiveTab] = useState<TabId>(() => {
        const tabParam = searchParams.get('tab') as TabId;
        return tabParam || 'prompt';
    });

    const [inputValues, setInputValues] = useState<{ [K in TabId]: string }>({
        prompt: '',
        image: '',
        suggestions: ''
    });
    const [selectedFiles, setSelectedFiles] = useState<{ [K in TabId]: File | null }>({
        prompt: null,
        image: null,
        suggestions: null
    });
    const [isLoading, setIsLoading] = useState<{ [K in TabId]: boolean }>({
        prompt: false,
        image: false,
        suggestions: false
    });

    const tabs = [
        {id: 'prompt', label: 'Prompt to Moodboard'},
        {id: 'image', label: 'Image to Moodboard'},
        {id: 'suggestions', label: 'Design Suggestions'}
    ];

    useEffect(() => {
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [pollingInterval]);

    useEffect(() => {
        if (designStatus[activeTab] === 'complete' && pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
        }
    }, [designStatus, activeTab]);

    const handlePromptGeneration = async (): Promise<void> => {
        const currentInput = inputValues[activeTab].trim();
        if (!currentInput) return;

        try {
            setIsLoading(prev => ({...prev, [activeTab]: true}));
            setDesignStatus(prev => ({...prev, [activeTab]: 'tokens_pending'}));

            await generateDesign(currentInput);

            setDesignStatus(prev => ({...prev, [activeTab]: 'tokens_generated'}));
            startPolling();
        } catch (error) {
            handleGenerationError(error);
        }
    };

    const handleMoodboardImageUpload = async (file: File): Promise<void> => {
        try {
            setSelectedFiles(prev => ({...prev, [activeTab]: file}));
            setIsLoading(prev => ({...prev, [activeTab]: true}));

            setDesignStatus(prev => ({...prev, [activeTab]: 'tokens_pending'}));
            setGenerationMessage(prev => ({
                ...prev,
                [activeTab]: 'Analyzing your image...'
            }));

            const designResponse = await processImage(file);

            setDesignData(prev => ({
                ...prev,
                [activeTab]: designResponse
            }));

            setDesignStatus(prev => ({...prev, [activeTab]: 'tokens_generated'}));
            setGenerationMessage(prev => ({
                ...prev,
                [activeTab]: 'Design tokens ready! Preparing for Figma...'
            }));

            startPolling();

        } catch (error) {
            handleGenerationError(error);
        }
    };

    const handleDesignAnalysis = async (file: File): Promise<void> => {
        try {
            setSelectedFiles(prev => ({...prev, [activeTab]: file}));
            setAnalysisState(prev => ({...prev, isLoading: true}));

            const stages = ['initializing', 'processing', 'extracting', 'generating'];
            for (const stage of stages) {
                setAnalysisStage(stage);
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            const result = await analyzeDesign(file);

            setAnalysisStage('finalizing');
            await new Promise(resolve => setTimeout(resolve, 1000));

            setAnalysisState({
                isLoading: false,
                result,
                error: null
            });
        } catch (error) {
            setAnalysisState({
                isLoading: false,
                result: null,
                error: error instanceof Error ? error.message : 'Analysis failed'
            });
        } finally {
            setIsLoading(prev => ({...prev, [activeTab]: false}));
        }
    };

    const handleImageUpload = async (file: File): Promise<void> => {
        if (activeTab === 'suggestions') {
            await handleDesignAnalysis(file);
        } else if (activeTab === 'image') {
            await handleMoodboardImageUpload(file);
        }
    };

    const startPolling = () => {
        if (pollingInterval) {
            clearInterval(pollingInterval);
        }

        const interval = setInterval(pollForDesignImage, 3000);
        setPollingInterval(interval);
        pollForDesignImage();
    };

    const pollForDesignImage = async () => {
        try {
            const latestDesign = await getLatestDesign();

            if (latestDesign?.designImage) {
                setDesignData(prev => ({...prev, [activeTab]: latestDesign}));
                setDesignStatus(prev => ({...prev, [activeTab]: 'complete'}));
                setGenerationMessage(prev => ({
                    ...prev,
                    [activeTab]: 'Design generated successfully! Figma plugin updated.'
                }));
                setIsLoading(prev => ({...prev, [activeTab]: false}));

                if (pollingInterval) {
                    clearInterval(pollingInterval);
                    setPollingInterval(null);
                }
            }
        } catch (error) {
            handlePollingError(error);
        }
    };

    const handleGenerationError = (error: any) => {
        setIsLoading(prev => ({...prev, [activeTab]: false}));
        setDesignStatus(prev => ({...prev, [activeTab]: 'error'}));
        setGenerationMessage(prev => ({
            ...prev,
            [activeTab]: error instanceof Error ? error.message : 'Generation failed. Please try again.'
        }));
    };

    const handlePollingError = (error: any) => {
        if (error.response?.status === 401) {
            if (pollingInterval) {
                clearInterval(pollingInterval);
                setPollingInterval(null);
            }
            setIsLoading(prev => ({...prev, [activeTab]: false}));
        }
    };

    const handleImageClear = () => {
        setSelectedFiles(prev => ({...prev, [activeTab]: null}));
        setDesignStatus(prev => ({...prev, [activeTab]: 'not_started'}));
        setGenerationMessage(prev => ({...prev, [activeTab]: ''}));

        if (activeTab === 'suggestions') {
            setAnalysisState({
                isLoading: false,
                result: null,
                error: null
            });
        }
    };

    return (
        <main className={`min-h-screen pt-16 pb-16 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
            <TabNavigation
                isDark={isDark}
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            <div className="max-w-6xl mx-auto pt-40 px-4">
                <div className="flex flex-col gap-6">
                    {/* Dynamic header based on active tab */}
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-500 to-pink-500 bg-clip-text text-transparent">
                        {activeTab === 'prompt' ? 'Create from Prompt' :
                            activeTab === 'image' ? 'Create from Image' : 'Design Suggestions'}
                    </h1>

                    {/* Prompt input section */}
                    {activeTab === 'prompt' ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValues[activeTab]}
                                onChange={(e) => setInputValues(prev => ({
                                    ...prev,
                                    [activeTab]: e.target.value
                                }))}
                                placeholder="Describe your desired moodboard..."
                                className={`flex-1 px-4 py-2 rounded-lg ${
                                    isDark
                                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
                                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500'
                                } border`}
                            />
                            <button
                                onClick={handlePromptGeneration}
                                disabled={isLoading[activeTab]}
                                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-pink-500 text-white rounded-lg hover:opacity-90"
                            >
                                {isLoading[activeTab] ? 'Generating...' : 'Generate'}
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {/* Image upload section */}
                            <ImageUploader
                                isDark={isDark}
                                onImageSelect={handleImageUpload}
                                onClear={handleImageClear}
                                isLoading={isLoading[activeTab]}
                                currentFile={selectedFiles[activeTab]}
                            />

                            {/* Design analysis section with simplified loading */}
                            {activeTab === 'suggestions' && (
                                analysisState.isLoading ? (
                                    <EnhancedLoading
                                        type="analysis"
                                        stage={analysisStage}
                                        isDark={isDark}
                                    />
                                ) : (
                                    <StructuredAnalysisDisplay
                                        analysis={analysisState.result?.analysis}
                                        isDark={isDark}
                                    />
                                )
                            )}
                        </div>
                    )}

                    {/* Design result display for non-suggestion tabs */}
                    {activeTab !== 'suggestions' && (
                        <DesignResult
                            isDark={isDark}
                            status={designStatus[activeTab]}
                            message={generationMessage[activeTab]}
                            design={designData[activeTab]}
                        />
                    )}
                </div>
            </div>
        </main>
    );
};

export default Dashboard;