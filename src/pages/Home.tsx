import {FC, useContext} from 'react';
import {ThemeContext} from '../services/contexts/ThemeContext';
import FeatureCard from '../components/FeatureCard';
import {Feature} from '../types/interfaces';
import {useAuth} from '../services/contexts/AuthContext';

import promptMoodboardDark from '../assets/prompt-moodboard-image.svg';
import promptMoodboardLight from '../assets/prompt-moodboard-image-2.svg';
import imageMoodboardDark from '../assets/image-moodboard-image.svg';
import imageMoodboardLight from '../assets/image-moodboard-image-2.svg';
import designSuggestionsDark from '../assets/design-suggestions-image.svg';
import designSuggestionsLight from '../assets/design-suggestions-image-2.svg';
import React from 'react';
import {useNavigate} from "react-router-dom";

const Home: FC = () => {
    const {theme} = useContext(ThemeContext);
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();

    const handleFeatureClick = (featureRoute: string) => {
        if (isAuthenticated) {
            navigate(`/dashboard${featureRoute}`);
        } else {
            navigate('/login', {
                state: {
                    from: `/dashboard${featureRoute}`
                }
            });
        }
    };

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
            <div className="fixed z-0">
                <div
                    className="fixed inset-0"
                    style={{
                        background: `
                            radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.15), transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.15), transparent 50%),
                            radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15), transparent 50%)
                        `,
                        opacity: theme === 'dark' ? 1 : 0.7
                    }}
                />
                <div className="absolute inset-0 backdrop-blur-[100px]"/>
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <section className="min-h-screen flex items-center justify-center p-8 pt-20">
                    <div className="text-center max-w-3xl">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
                            Transform Your Design Process
                        </h1>
                        <p className={`text-xl sm:text-2xl mb-8 transition-colors duration-300 ${
                            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                            Harness the power of AI to create stunning moodboards and enhance your designs instantly
                        </p>
                        <a
                            href="#features"
                            className={`inline-flex px-6 py-3 rounded-lg transition-colors duration-300 motion-safe:animate-[bounce_1s_ease-in-out_infinite] ${
                                theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-900/10 hover:bg-slate-900/20'
                            }`}
                        >
                            Explore Tools ↓
                        </a>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            feature={feature}
                            index={index}
                            reverse={index % 2 === 1}
                        />
                    ))}
                </section>
            </div>
        </div>
    );
};

export default Home;
