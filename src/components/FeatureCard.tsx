import {FC, useContext} from 'react';
import {Feature} from '../types/interfaces';
import {ThemeContext} from '../services/contexts/ThemeContext';
import React from 'react';

interface FeatureCardProps {
    feature: Feature;
    index: number;
    reverse: boolean;
}

const FeatureCard: FC<FeatureCardProps> = ({feature, index, reverse}) => {
    const {theme} = useContext(ThemeContext);

    return (
        <div
            className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-16 mb-16 lg:mb-32`}>
            <div className="flex-1 w-full lg:w-1/2">
                <div className="w-full overflow-hidden rounded-2xl shadow-2xl">
                    <img
                        src={theme === 'dark' ? feature.imageSrc.dark : feature.imageSrc.light}
                        alt={feature.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
            <div className="flex-1 w-full lg:w-1/2">
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-6"
                    style={{
                        background: `rgba(${
                            index === 0 ? '16,185,129' :
                                index === 1 ? '236,72,153' :
                                    '139,92,246'
                        },0.2)`
                    }}
                >
                    {feature.icon}
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-500 via-pink-500 to-violet-500 bg-clip-text text-transparent p-[0.1em] bg-[length:100%_120%] bg-bottom">
                    {feature.title}
                </h2>
                <span className={`inline-flex px-4 py-2 rounded-full text-sm mb-4 transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-white/10 text-slate-400' : 'bg-slate-900/10 text-slate-600'
                }`}>
                    ✓ Export to PNG, PDF, JPG and Figma
                </span>
                <p className={`text-base lg:text-lg mb-6 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                    {feature.description}
                </p>
                <button
                    onClick={feature.onClick}
                    className={`w-full sm:w-auto px-6 py-3 rounded-lg transition-colors duration-300 ${
                        theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-900/10 hover:bg-slate-900/20'
                    }`}>
                    {feature.buttonText}
                </button>
            </div>
        </div>
    );
};

export default FeatureCard;
