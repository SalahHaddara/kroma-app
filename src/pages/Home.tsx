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


    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
        }`}>
        </div>
    );
};

export default Home;
