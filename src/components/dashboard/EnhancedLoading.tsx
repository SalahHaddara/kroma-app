import React from 'react';
import {
    Loader2,
    RefreshCw,
    Sparkles,
    ImagePlus,
    Binary,
    Lightbulb,
    Palette,
    ArrowRight
} from 'lucide-react';

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
            'processing': 'Processing your creative prompt...',
            'generating': 'Generating your unique moodboard...',
            'tokens_pending': 'Creating design tokens...',
            'tokens_generated': 'Design tokens ready! Head to Figma plugin...',
            'finalizing': 'Almost there! Open your Figma plugin to generate the design'
        }
    },
    image: {
        icon: Palette,
        stages: {
            'initializing': 'Preparing image processing...',
            'processing': 'Analyzing your image composition...',
            'generating': 'Creating matching design elements...',
            'tokens_pending': 'Generating design tokens...',
            'tokens_generated': 'Design tokens ready! Head to Figma plugin...',
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
    const isPluginStage = stage === 'tokens_generated' || stage === 'finalizing';

    return (
        <div className={`flex flex-col items-center space-y-4 p-6 rounded-lg ${
            isDark ? 'bg-slate-800/50' : 'bg-slate-100/50'
        } backdrop-blur-sm transition-all duration-500`}>
            <div className="flex items-center space-x-4">
                {isPluginStage ? (
                    <ArrowRight className={`w-8 h-8 ${
                        isDark ? 'text-emerald-400' : 'text-emerald-600'
                    } animate-bounce`}/>
                ) : (
                    <LoadingIcon className={`w-8 h-8 ${
                        isDark ? 'text-emerald-400' : 'text-emerald-600'
                    } animate-pulse`}/>
                )}

                <div className="flex space-x-2">
                    {!isPluginStage && [...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                                isDark ? 'bg-emerald-400' : 'bg-emerald-600'
                            } animate-bounce`}
                            style={{animationDelay: `${i * 0.15}s`}}
                        />
                    ))}
                </div>
            </div>

            <div className="text-center">
                <p className={`text-lg font-medium ${
                    isDark ? 'text-white' : 'text-slate-900'
                } ${isPluginStage ? 'animate-pulse' : ''}`}>
                    {message}
                </p>
                {!isPluginStage && (
                    <p className={`text-sm ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                        This may take a few moments...
                    </p>
                )}
            </div>

            {!isPluginStage && (
                <div className="flex space-x-4 mt-4">
                    <div className="animate-spin">
                        <RefreshCw className="w-5 h-5"/>
                    </div>
                    <div className={`w-5 h-5 ${
                        isDark ? 'text-emerald-400' : 'text-emerald-600'
                    } animate-pulse`}>
                        <Loader2/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedLoading;