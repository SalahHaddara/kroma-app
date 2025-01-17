import React from 'react';

interface HistoryImageSectionProps {
    isDark: boolean;
}

const HistoryImageSection: React.FC<HistoryImageSectionProps> = ({isDark}) => {
    return (
        <div className={`text-center p-12 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Image history feature coming soon
        </div>
    );
};

export default HistoryImageSection;