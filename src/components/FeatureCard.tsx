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
            </div>
        </div>
    );
};

export default FeatureCard;
