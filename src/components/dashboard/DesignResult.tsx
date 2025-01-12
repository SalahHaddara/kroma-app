import React from 'react';
import {Download, Loader2} from 'lucide-react';
import {ThemeProps, DesignStatus, DesignData} from '@/types/dashboard';

interface DesignResultProps extends ThemeProps {
    status: DesignStatus;
    message: string;
    design?: DesignData;
}

const ResultContainer: React.FC<ThemeProps & { title: string; children: React.ReactNode }> = ({
                                                                                                  isDark,
                                                                                                  title,
                                                                                                  children
                                                                                              }) => (
    <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl border ${
        isDark ? 'border-slate-700' : 'border-slate-200'
    } p-6 space-y-8`}>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
    </div>
);

const DesignResult: React.FC<DesignResultProps> = ({
                                                       isDark,
                                                       status,
                                                       message,
                                                       design
                                                   }) => {
    if (['tokens_pending', 'tokens_generated', 'image_pending'].includes(status)) {
        return (
            <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin"/>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {message}
                </p>
            </div>
        );
    }

    if (status === 'complete' && design) {
        return (
            <ResultContainer isDark={isDark} title="Your Generated Design">
                <div className={`aspect-video rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'} 
                flex items-center justify-center overflow-hidden`}>
                    {design.designImage ? (
                        <img
                            src={`data:image/png;base64,${design.designImage}`}
                            alt="Generated Design"
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                            Design Preview
                        </p>
                    )}
                </div>
                {design.designImage && (
                    <div className="flex gap-2">
                        <a
                            href={`data:image/png;base64,${design.designImage}`}
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
    }

    return null;
};

export default DesignResult;