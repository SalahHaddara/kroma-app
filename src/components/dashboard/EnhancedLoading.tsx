import React from 'react';
import {Sparkles, Palette, Binary} from 'lucide-react';

interface EnhancedLoadingProps {
    type: 'prompt' | 'image' | 'analysis';
    stage: string;
    isDark: boolean;
}

const loadingConfigs = {
    prompt: {
        icon: Sparkles,
        stages: {
            'initializing': 'Initializing AI system...',
            'processing': 'Our AI is crafting your design tokens...',
            'generating': 'Generating your unique moodboard...',
            'tokens_pending': 'Creating design tokens from your prompt...',
            'tokens_generated': 'Design tokens ready! Head to your Figma plugin to generate the design.',
            'finalizing': 'Almost there! Open your Figma plugin to generate the design'
        }
    },
    image: {
        icon: Palette,
        stages: {
            'initializing': 'Preparing image processing...',
            'processing': 'Analyzing your image composition...',
            'generating': 'Creating matching design elements...',
            'tokens_pending': 'Extracting design tokens from your image...',
            'tokens_generated': 'Design tokens ready! Head to your Figma plugin to generate the design.',
            'finalizing': 'Almost there! Open your Figma plugin to generate the design'
        }
    },
    analysis: {
        icon: Binary,
        stages: {
            'initializing': 'Starting design analysis...',
            'processing': 'Analyzing design patterns...',
            'extracting': 'Extracting design principles...',
            'generating': 'Generating suggestions...',
            'finalizing': 'Preparing detailed feedback...'
        }
    }
};

const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({type, stage, isDark}) => {
    const config = loadingConfigs[type];
    const LoadingIcon = config.icon;
    const message = config.stages[stage] || 'Processing...';

    return (
        <div className={`flex flex-col items-center space-y-4 p-6 rounded-lg ${
            isDark ? 'bg-slate-800/50' : 'bg-slate-100/50'
        } backdrop-blur-sm transition-all duration-500 animate-[fadeIn_0.5s_ease-out]`}>
            <div className="flex items-center justify-center relative">
                <div className={`absolute inset-0 ${
                    isDark ? 'bg-emerald-400' : 'bg-emerald-600'
                } opacity-20 rounded-full blur-xl animate-[pulse_2s_ease-in-out_infinite]`}/>
                <LoadingIcon className={`w-8 h-8 relative ${
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                } transition-all duration-300 hover:scale-110`}/>
            </div>

            <div className="text-center space-y-2">
                <p className={`text-lg font-medium ${
                    isDark ? 'text-white' : 'text-slate-900'
                }`}>
                    {message}
                </p>
                <p className={`text-sm ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                    This may take a few moments...
                </p>
            </div>
        </div>
    );
};

export default EnhancedLoading;