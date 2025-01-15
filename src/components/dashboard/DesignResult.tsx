import React from 'react';
import {Download, Loader2} from 'lucide-react';
import {ThemeProps, DesignStatus, DesignData} from '@/types/dashboard';
import EnhancedLoading from './EnhancedLoading';

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
        let loadingType: 'prompt' | 'image';
        let stage: string;

        loadingType = status === 'image_pending' ? 'image' : 'prompt';

        switch (status) {
            case 'tokens_pending':
                stage = 'processing';
                break;
            case 'tokens_generated':
                stage = 'tokens_generated';
                break;
            case 'image_pending':
                stage = 'processing';
                break;
            default:
                stage = 'initializing';
        }

        return <EnhancedLoading type={loadingType} stage={stage} isDark={isDark}/>;
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
                <div className="flex flex-col gap-4">
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
                    <div className={`p-4 rounded-lg border ${
                        isDark ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-emerald-500/20 bg-emerald-500/10'
                    }`}>
                        <p className="text-emerald-500">
                            Design tokens have been generated successfully!
                        </p>
                    </div>
                </div>
            </ResultContainer>
        );
    }

    return null;
};

export default DesignResult;