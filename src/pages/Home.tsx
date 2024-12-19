import {FC, useContext} from 'react';
import {ThemeContext} from '../services/contexts/ThemeContext';
import {Feature} from '../types/interfaces';

import promptMoodboardDark from '../assets/prompt-moodboard-image.svg';
import promptMoodboardLight from '../assets/prompt-moodboard-image-2.svg';
import imageMoodboardDark from '../assets/image-moodboard-image.svg';
import imageMoodboardLight from '../assets/image-moodboard-image-2.svg';
import designSuggestionsDark from '../assets/design-suggestions-image.svg';
import designSuggestionsLight from '../assets/design-suggestions-image-2.svg';
import React from 'react';

const Home: FC = () => {
    const {theme} = useContext(ThemeContext);

    const features: Feature[] = [
        {
            title: "Prompt to Moodboard",
            icon: "✨",
            description: "Transform your ideas into visual inspiration with our AI-powered prompt-to-moodboard generator. Simply describe your vision, and watch as our AI creates a perfectly curated collection of images, colors, and textures that bring your concept to life.",
            buttonText: "Generate Moodboard",
            imageSrc: {
                dark: promptMoodboardDark,
                light: promptMoodboardLight
            }
        },
        {
            title: "Image to Moodboard",
            icon: "🖼️",
            description: "Upload any image and let our AI create a perfectly matched moodboard with complementary elements, colors, and textures. Perfect for expanding on existing design concepts or finding new directions from visual inspiration.",
            buttonText: "Upload Image",
            imageSrc: {
                dark: imageMoodboardDark,
                light: imageMoodboardLight
            }
        },
        {
            title: "Design Suggestions",
            icon: "💡",
            description: "Get instant AI-powered recommendations to enhance your designs. Our intelligent system analyzes your work and provides actionable suggestions to improve composition, color harmony, and visual hierarchy for maximum impact.",
            buttonText: "Get Suggestions",
            imageSrc: {
                dark: designSuggestionsDark,
                light: designSuggestionsLight
            }
        }
    ];

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
        }`}>
        </div>
    );
};

export default Home;
