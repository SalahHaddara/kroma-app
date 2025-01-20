import React from 'react';

interface HistorySuggestionsSectionProps {
    isDark: boolean;
}

const HistorySuggestionsSection: React.FC<HistorySuggestionsSectionProps> = ({isDark}) => {
    return (
        <div className={`text-center p-12 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Design suggestions history feature coming soon
        </div>
    );
};

export default HistorySuggestionsSection;