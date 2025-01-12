import React, {useState, useContext, useEffect} from 'react';
import {Download, Camera} from 'lucide-react';
import {ThemeContext} from '../services/contexts/ThemeContext';
import {useAuth} from '../services/contexts/AuthContext';
import {useSearchParams} from "react-router-dom";
import {generateDesign, getLatestDesign} from '../utils/api';
import {Loader2} from 'lucide-react'

type TabId = 'prompt' | 'image' | 'suggestions';

interface Tab {
    id: TabId;
    label: string;
}

interface ThemeProps {
    isDark: boolean;
}

interface BaseResultProps extends ThemeProps {
    title: string;
    children: React.ReactNode;
}

interface ImprovementItemProps extends ThemeProps {
    color: string;
    title: string;
    description: string;
}

const ResultContainer: React.FC<BaseResultProps> = ({isDark, title, children}) => (
    <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl border ${
        isDark ? 'border-slate-700' : 'border-slate-200'
    } p-6 space-y-8`}>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
    </div>
);

const ExportButton: React.FC<ThemeProps & { label: string }> = ({isDark, label}) => (
    <button className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
        isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'
    }`}>
        <Download size={16}/>
        {label}
    </button>
);

const ImprovementItem: React.FC<ImprovementItemProps> = ({color, title, description, isDark}) => (
    <div className="flex items-start gap-3">
        <div className="w-3 h-3 rounded-full mt-1.5" style={{backgroundColor: color}}/>
        <div>
            <h4 className="font-semibold mb-1">{title}</h4>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
                {description}
            </p>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
    const [designData, setDesignData] = useState<{ [key in TabId]?: any }>({});
    const [designStatus, setDesignStatus] = useState<{ [key in TabId]: 'not_started' | 'tokens_pending' | 'tokens_generated' | 'image_pending' | 'complete' }>({
        prompt: 'not_started',
        image: 'not_started',
        suggestions: 'not_started'
    });
    const [generationMessage, setGenerationMessage] = useState<{ [key in TabId]: string }>({
        prompt: '',
        image: '',
        suggestions: ''
    });
    const [searchParams] = useSearchParams();
    const {theme} = useContext(ThemeContext);
    const {user} = useAuth();
    const [activeTab, setActiveTab] = useState<TabId>(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam === 'prompt' || tabParam === 'image' || tabParam === 'suggestions') {
            return tabParam;
        }
        return 'prompt';
    });
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isDark = theme === 'dark';

    const tabs: Tab[] = [
        {id: 'prompt', label: 'Prompt to Moodboard'},
        {id: 'image', label: 'Image to Moodboard'},
        {id: 'suggestions', label: 'Design Suggestions'}
    ];

    const pollForDesignImage = async () => {
        try {
            const latestDesign = await getLatestDesign();
            if (latestDesign.designImage) {
                setDesignData(prev => ({
                    ...prev,
                    [activeTab]: latestDesign
                }));
                setDesignStatus(prev => ({
                    ...prev,
                    [activeTab]: 'complete'
                }));
                setGenerationMessage(prev => ({
                    ...prev,
                    [activeTab]: 'Design generated successfully! Figma plugin updated.'
                }));
                setIsLoading(false);
                clearInterval(pollingInterval!);
                setPollingInterval(null);
            }
        } catch (error) {
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
            setDesignStatus(prev => ({
                ...prev,
                [activeTab]: 'tokens_pending'
            }));
            setGenerationMessage(prev => ({
                ...prev,
                [activeTab]: 'Generating design tokens...'
            }));

            const response = await generateDesign(inputValue.trim());

            setDesignStatus(prev => ({
                ...prev,
                [activeTab]: 'tokens_generated'
            }));
            setGenerationMessage(prev => ({
                ...prev,
                [activeTab]: 'Design tokens generated! Claim it from...'
            }));

            const interval = setInterval(pollForDesignImage, 3000);
            setPollingInterval(interval);
        } catch (e) {
            console.error('Failed to generate design:', e);
            setIsLoading(false);
            setDesignStatus(prev => ({
                ...prev,
                [activeTab]: 'not_started'
            }));
            setGenerationMessage(prev => ({
                ...prev,
                [activeTab]: 'Failed to generate design. Please try again.'
            }));
        }
    };

    useEffect(() => {
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [pollingInterval]);

    const handleFileUpload = (): void => {
        // Placeholder for file upload logic
    };

    const handleTabChange = (tabId: TabId): void => {
        setActiveTab(tabId);
    };

    const renderDesignResult = () => {
        const currentDesign = designData[activeTab];
        const currentStatus = designStatus[activeTab];
        const currentMessage = generationMessage[activeTab];

        switch (currentStatus) {
            case 'tokens_pending':
            case 'tokens_generated':
            case 'image_pending':
                return (
                    <div className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin"/>
                        <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {currentMessage}
                        </p>
                    </div>
                );
            case 'complete':
                return (
                    <ResultContainer isDark={isDark} title="Your Generated Design">
                        <div className={`aspect-video rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'} 
                        flex items-center justify-center overflow-hidden`}>
                            {currentDesign?.designImage ? (
                                <img
                                    src={`data:image/png;base64,${currentDesign.designImage}`}
                                    alt="Generated Design"
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                                    Design Preview
                                </p>
                            )}
                        </div>
                        {currentDesign?.designImage && (
                            <div className="flex gap-2">
                                <a
                                    href={`data:image/png;base64,${currentDesign.designImage}`}
                                    download="design.png"
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                                        isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'
                                    }`}
                                >
                                    <Download size={16}/>
                                    Export Design
                                </a>
                            </div>
                        )}
                    </ResultContainer>
                );
            default:
                return null;
        }
    };

    return (
        <main className={`min-h-screen pt-16 pb-16 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
            {/* Tab Navigation */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 mt-6">
                <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} 
                    border rounded-full p-1 shadow-lg flex gap-1`}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`px-3 py-1.5 text-sm rounded-full transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'bg-gradient-to-r from-emerald-500 to-pink-500 text-white'
                                    : `${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-6xl mx-auto pt-40 px-4">
                <div className="flex flex-col gap-6">
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-500 to-pink-500 bg-clip-text text-transparent">
                        {activeTab === 'prompt' ? 'Create from Prompt' :
                            activeTab === 'image' ? 'Create from Image' : 'Design Suggestions'}
                    </h1>

                    {/* Input Section */}
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

                    {/* Results Section */}
                    {renderDesignResult()}
                </div>
            </div>
        </main>
    );
};

export default Dashboard;