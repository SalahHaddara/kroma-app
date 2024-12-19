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

        </div>
    );
};

export default FeatureCard;
