import React from 'react';
import {Tab, TabId, ThemeProps} from '@/types/dashboard';

interface TabNavigationProps extends ThemeProps {
    tabs: Tab[];
    activeTab: TabId;
    onTabChange: (tabId: TabId) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
                                                         isDark,
                                                         tabs,
                                                         activeTab,
                                                         onTabChange
                                                     }) => (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 mt-6">
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} 
            border rounded-full p-1 shadow-lg flex gap-1`}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
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
);

export default TabNavigation;