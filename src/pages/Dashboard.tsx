import React, {useState, useContext} from 'react';
import {Download, Camera} from 'lucide-react';
import {ThemeContext} from '../services/contexts/ThemeContext';
import {useAuth} from '../services/contexts/AuthContext';
import {useSearchParams} from "react-router-dom";

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
    const [searchParams] = useSearchParams();
    const {theme} = useContext(ThemeContext);
    const {user} = useAuth();
    const isDark = theme === 'dark';

    const [activeTab, setActiveTab] = useState<TabId>(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam === 'prompt' || tabParam === 'image' || tabParam === 'suggestions') {
            return tabParam;
        }
        return 'prompt';
    });
    const [promptResults, setPromptResults] = useState(false);
    const [imageResults, setImageResults] = useState(false);
    const [suggestionsResults, setSuggestionsResults] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const tabs: Tab[] = [
        {id: 'prompt', label: 'Prompt to Moodboard'},
        {id: 'image', label: 'Image to Moodboard'},
        {id: 'suggestions', label: 'Design Suggestions'}
    ];

    const handleGenerate = (): void => {
        if (inputValue.trim()) {
            setPromptResults(true);
        }
    };

    const handleFileUpload = (): void => {
        if (activeTab === 'image') {
            setImageResults(true);
        } else if (activeTab === 'suggestions') {
            setSuggestionsResults(true);
        }
    };

    const handleTabChange = (tabId: TabId): void => {
        setActiveTab(tabId);
    };

    const renderPromptResults = (): JSX.Element => (
        <ResultContainer isDark={isDark} title="Your Generated Design">
            <div className={`aspect-video rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'} 
            flex items-center justify-center`}>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Prompt-based Moodboard
                </p>
            </div>
            <div className="flex gap-2">
                <ExportButton isDark={isDark} label="Export Design"/>
            </div>
        </ResultContainer>
    );

    const renderImageResults = (): JSX.Element => (
        <ResultContainer isDark={isDark} title="Your Generated Design">
            <div className={`aspect-video rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'} 
            flex items-center justify-center`}>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Image-based Moodboard
                </p>
            </div>
            <div className="flex gap-2">
                <ExportButton isDark={isDark} label="Export Design"/>
            </div>
        </ResultContainer>
    );

    const renderSuggestionsResults = (): JSX.Element => (
        <ResultContainer isDark={isDark} title="Analyzed Design">
            <div className={`aspect-video rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'} 
            flex items-center justify-center`}>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Design Preview</p>
            </div>
            <div className="space-y-6">
                <h3 className="text-xl font-bold mb-6">Improvements Details</h3>
                {[
                    {
                        color: '#FF4D4D',
                        title: 'Header Prominence',
                        description: 'Main heading could be more prominent - increase font size by 25%'
                    },
                    {
                        color: '#FF9F40',
                        title: 'CTA Visibility',
                        description: 'Primary call-to-action button needs more visual weight'
                    },
                    {
                        color: '#FFD700',
                        title: 'Touch Targets',
                        description: 'Navigation menu items need increased spacing to 32px'
                    }
                ].map((improvement, index) => (
                    <ImprovementItem
                        key={index}
                        {...improvement}
                        isDark={isDark}
                    />
                ))}
            </div>
            <div className="flex gap-2">
                <ExportButton isDark={isDark} label="Export Report"/>
            </div>
        </ResultContainer>
    );

    return (
        <main className={`min-h-screen pt-16 pb-16 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
            {/* Tab Navigation */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 mt-6">
                {/* Tab buttons */}
            </div>
            <div className="max-w-6xl mx-auto pt-40 px-4">
                {/* Main content */}
                {/* Input Section */}
                {activeTab === 'prompt' ? (
                    <div className="flex gap-2">
                        {/* Prompt input */}
                    </div>
                ) : (
                    <div onClick={handleFileUpload}
                         className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer">
                        {/* File upload section */}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Dashboard;