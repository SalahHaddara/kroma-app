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
    // Common state
    const [searchParams] = useSearchParams();
    const {theme} = useContext(ThemeContext);
    const {user} = useAuth();
    const isDark = theme === 'dark';

    // Feature specific states
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

    // Tab management
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

    // Navigation
    const tabs = [
        {id: 'prompt', label: 'Prompt to Moodboard'},
        {id: 'image', label: 'Image to Moodboard'},
        {id: 'suggestions', label: 'Design Suggestions'}
    ];

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollingInterval) {
                console.log('Cleaning up polling interval on unmount');
                clearInterval(pollingInterval);
            }
        };
    }, [pollingInterval]);

    // Monitor statuss
    useEffect(() => {
        if (designStatus[activeTab] === 'complete') {
            console.log('Design completed, checking polling cleanup');
            if (pollingInterval) {
                clearInterval(pollingInterval);
                setPollingInterval(null);
            }
        }
    }, [designStatus, activeTab]);

    // Prompt to Moodboard
    const handlePromptGeneration = async (): Promise<void> => {
        console.log('Starting prompt-to-moodboard generation');
        const currentInput = inputValues[activeTab];
        if (!currentInput.trim()) {
            console.log('Empty prompt, aborting generation');
            return;
        }

        try {
            setIsLoading(prev => ({...prev, [activeTab]: true}));
            setDesignStatus(prev => ({...prev, [activeTab]: 'tokens_pending'}));
            console.log('Generating design from prompt:', currentInput.trim());

            await generateDesign(currentInput.trim());
            console.log('Design generation API call successful');

            setDesignStatus(prev => ({...prev, [activeTab]: 'tokens_generated'}));
            startPolling();
        } catch (error) {
            console.error('Prompt generation error:', error);
            handleGenerationError(error);
        }
    };

    //Image to Moodboard
    const handleMoodboardImageUpload = async (file: File): Promise<void> => {
        console.log('Starting image-to-moodboard processing');
        try {
            setSelectedFiles(prev => ({...prev, [activeTab]: file}));
            setIsLoading(prev => ({...prev, [activeTab]: true}));
            setDesignStatus(prev => ({...prev, [activeTab]: 'initializing'}));

            await new Promise(resolve => setTimeout(resolve, 1500));
            setDesignStatus(prev => ({...prev, [activeTab]: 'processing'}));

            await new Promise(resolve => setTimeout(resolve, 1500));
            setDesignStatus(prev => ({...prev, [activeTab]: 'generating'}));

            const designResponse = await processImage(file);
            console.log('Image processing successful:', designResponse);

            setDesignData(prev => ({
                ...prev,
                [activeTab]: designResponse
            }));

            setDesignStatus(prev => ({...prev, [activeTab]: 'tokens_generated'}));
            setGenerationMessage(prev => ({
                ...prev,
                [activeTab]: 'Design tokens generated! Head to Figma plugin...'
            }));

            await new Promise(resolve => setTimeout(resolve, 2000));
            setDesignStatus(prev => ({...prev, [activeTab]: 'finalizing'}));
            startPolling();
        } catch (error) {
            console.error('Image-to-moodboard error:', error);
            handleGenerationError(error);
        }
    };

    //Design Analysis
    const [analysisStage, setAnalysisStage] = useState<string>('initializing');

    const handleDesignAnalysis = async (file: File): Promise<void> => {
        console.log('Starting design analysis');
        try {
            setSelectedFiles(prev => ({...prev, [activeTab]: file}));
            setAnalysisState(prev => ({...prev, isLoading: true}));

            // Simulate progress through analysis stages
            setAnalysisStage('initializing');
            await new Promise(resolve => setTimeout(resolve, 1500));

            setAnalysisStage('processing');
            await new Promise(resolve => setTimeout(resolve, 1500));

            setAnalysisStage('extracting');
            await new Promise(resolve => setTimeout(resolve, 1500));

            setAnalysisStage('generating');
            const result = await analyzeDesign(file);
            console.log('Design analysis successful:', result);

            setAnalysisStage('finalizing');
            await new Promise(resolve => setTimeout(resolve, 1000));

            setAnalysisState({
                isLoading: false,
                result,
                error: null
            });
        } catch (error) {
            console.error('Design analysis error:', error);
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
        console.log('Image upload initiated for tab:', activeTab);

        if (activeTab === 'suggestions') {
            await handleDesignAnalysis(file);
        } else if (activeTab === 'image') {
            await handleMoodboardImageUpload(file);
        }
    };

    // Polling
    const startPolling = () => {
        console.log('Starting design polling');
        if (pollingInterval) {
            clearInterval(pollingInterval);
        }

        const interval = setInterval(pollForDesignImage, 3000);
        setPollingInterval(interval);

        pollForDesignImage();
    };

    const pollForDesignImage = async () => {
        try {
            console.log('Polling for design updates...');
            const latestDesign = await getLatestDesign();

            // if we have a valid design response procced
            if (latestDesign && latestDesign.designImage) {
                console.log('Design update received with image data');

                // update states in order
                setDesignData(prev => ({...prev, [activeTab]: latestDesign}));
                setDesignStatus(prev => ({...prev, [activeTab]: 'complete'}));
                setGenerationMessage(prev => ({
                    ...prev,
                    [activeTab]: 'Design generated successfully! Figma plugin updated.'
                }));
                setIsLoading(prev => ({...prev, [activeTab]: false}));

                // Stop polling
                if (pollingInterval) {
                    console.log('Stopping polling after successful design receipt');
                    clearInterval(pollingInterval);
                    setPollingInterval(null);
                }
            } else {
                console.log('No design image yet, continuing to poll...');
            }
        } catch (error) {
            console.error('Polling error:', error);
            if (error.response?.status === 401) {
                console.log('Authentication error during polling, stopping');
                if (pollingInterval) {
                    clearInterval(pollingInterval);
                    setPollingInterval(null);
                }
                setIsLoading(prev => ({...prev, [activeTab]: false}));
            }
        }
    };

    const updateDesignState = (latestDesign: any) => {
        setDesignData(prev => ({...prev, [activeTab]: latestDesign}));
        setDesignStatus(prev => ({...prev, [activeTab]: 'complete'}));
        setGenerationMessage(prev => ({
            ...prev,
            [activeTab]: 'Design generated successfully! Figma plugin updated.'
        }));
        setIsLoading(prev => ({...prev, [activeTab]: false}));
    };

    const stopPolling = () => {
        if (pollingInterval) {
            console.log('Stopping polling');
            clearInterval(pollingInterval);
            setPollingInterval(prev => {
                if (prev !== null) {
                    return null;
                }
                return prev;
            });
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
            stopPolling();
            setIsLoading(prev => ({...prev, [activeTab]: false}));
        }
    };

    const handleImageClear = () => {
        console.log('Clearing image for tab:', activeTab);
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
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-500 to-pink-500 bg-clip-text text-transparent">
                        {activeTab === 'prompt' ? 'Create from Prompt' :
                            activeTab === 'image' ? 'Create from Image' : 'Design Suggestions'}
                    </h1>

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
                            <ImageUploader
                                isDark={isDark}
                                onImageSelect={handleImageUpload}
                                onClear={handleImageClear}
                                isLoading={isLoading[activeTab]}
                                currentFile={selectedFiles[activeTab]}
                            />
                            {activeTab === 'suggestions' && (
                                <>
                                    {analysisState.isLoading ? (
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
                                    )}
                                </>
                            )}
                        </div>
                    )}

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