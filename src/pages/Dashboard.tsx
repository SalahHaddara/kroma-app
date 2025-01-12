import React, {useState, useContext, useEffect} from 'react';
import {Camera} from 'lucide-react';
import {useSearchParams} from 'react-router-dom';
import {ThemeContext} from '@/services/contexts/ThemeContext';
import {useAuth} from '@/services/contexts/AuthContext';
import {generateDesign, getLatestDesign} from '@/utils/api';
import TabNavigation from '@/components/dashboard/TabNavigation';
import DesignResult from '@/components/dashboard/DesignResult';
import {TabId, DesignState, DesignStatusState, GenerationMessageState} from '@/types/dashboard';

const Dashboard: React.FC = () => {
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

    const [searchParams] = useSearchParams();
    const {theme} = useContext(ThemeContext);
    const {user} = useAuth();
    const [activeTab, setActiveTab] = useState<TabId>(() => {
        const tabParam = searchParams.get('tab') as TabId;
        return tabParam || 'prompt';
    });
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isDark = theme === 'dark';

    const tabs = [
        {id: 'prompt', label: 'Prompt to Moodboard'},
        {id: 'image', label: 'Image to Moodboard'},
        {id: 'suggestions', label: 'Design Suggestions'}
    ];

    // Polling logic
    useEffect(() => {
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [pollingInterval]);

    const pollForDesignImage = async () => {
        try {
            const latestDesign = await getLatestDesign();
            if (latestDesign.designImage) {
                setDesignData(prev => ({...prev, [activeTab]: latestDesign}));
                setDesignStatus(prev => ({...prev, [activeTab]: 'complete'}));
                setGenerationMessage(prev => ({
                    ...prev,
                    [activeTab]: 'Design generated successfully! Figma plugin updated.'
                }));
                setIsLoading(false);
                clearInterval(pollingInterval!);
                setPollingInterval(null);
            }
        } catch (error: any) {
            console.error('Polling error:', error);
            if (error.response?.status === 401) {
                clearInterval(pollingInterval!);
                setPollingInterval(null);
                setIsLoading(false);
            }
        }
    };

    const handleGenerate = async (): Promise<void> => {
        if (!inputValue.trim()) return;

        try {
            setIsLoading(true);
            setDesignStatus(prev => ({...prev, [activeTab]: 'tokens_pending'}));
            setGenerationMessage(prev => ({
                ...prev,
                [activeTab]: 'Generating design tokens...'
            }));

            await generateDesign(inputValue.trim());

            setDesignStatus(prev => ({...prev, [activeTab]: 'tokens_generated'}));
            setGenerationMessage(prev => ({
                ...prev,
                [activeTab]: 'Design tokens generated! Processing...'
            }));

            const interval = setInterval(pollForDesignImage, 3000);
            setPollingInterval(interval);
        } catch (e) {
            console.error('Failed to generate design:', e);
            setIsLoading(false);
            setDesignStatus(prev => ({...prev, [activeTab]: 'not_started'}));
            setGenerationMessage(prev => ({
                ...prev,
                [activeTab]: 'Failed to generate design. Please try again.'
            }));
        }
    };

    const handleFileUpload = (): void => {
        // Placeholder for file upload logic
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
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Describe your desired moodboard..."
                                className={`flex-1 px-4 py-2 rounded-lg ${
                                    isDark
                                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
                                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500'
                                } border`}
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-pink-500 text-white rounded-lg hover:opacity-90"
                            >
                                {isLoading ? 'Generating...' : 'Generate'}
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={handleFileUpload}
                            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer ${
                                isDark
                                    ? 'border-slate-700 hover:bg-slate-800'
                                    : 'border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <Camera className="mx-auto mb-4" size={32}/>
                            <h2 className="text-lg font-semibold mb-2">
                                Drop your {activeTab === 'image' ? 'image' : 'design'} here
                            </h2>
                            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                                or click to upload
                            </p>
                        </div>
                    )}

                    <DesignResult
                        isDark={isDark}
                        status={designStatus[activeTab]}
                        message={generationMessage[activeTab]}
                        design={designData[activeTab]}
                    />
                </div>
            </div>
        </main>
    );
};

export default Dashboard;