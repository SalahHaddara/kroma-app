import React, {useState} from 'react';
import {ThemeContext} from '@/services/contexts/ThemeContext';
import TabNavigation from '@/components/dashboard/TabNavigation';
import {TabId} from '@/types/dashboard';
import HistoryPromptSection from '@/components/history/HistoryPromptSection';
import HistorySuggestionsSection from '@/components/history/HistorySuggestionsSection';
import {useContext} from 'react';

const History = () => {
    const {theme} = useContext(ThemeContext);
    const isDark = theme === 'dark';
    const [activeTab, setActiveTab] = useState<TabId>('prompt');

    const tabs = [
        {id: 'prompt' as TabId, label: 'Mood Board History'},
        {id: 'suggestions' as TabId, label: 'Suggestions History'}
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'prompt':
                return <HistoryPromptSection isDark={isDark}/>;
            case 'suggestions':
                return <HistorySuggestionsSection isDark={isDark}/>;
            default:
                return null;
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
                        Design History
                    </h1>
                    {renderContent()}
                </div>
            </div>
        </main>
    );
};

export default History;