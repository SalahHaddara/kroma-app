import {FC} from 'react';
import {Feature} from '../types/interfaces';
import React from 'react';

interface FeatureCardProps {
    feature: Feature;
    index: number;
    reverse: boolean;
}

const FeatureCard: FC<FeatureCardProps> = ({feature, index, reverse}) => {

    return (
        <div
            className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-16 mb-16 lg:mb-32`}>
        </div>
    );
};

export default FeatureCard;
