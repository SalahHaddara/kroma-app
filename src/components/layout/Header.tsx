import {FC, useContext} from 'react';
import {ThemeContext} from '../../services/contexts/ThemeContext';

const Header: FC = () => {
    const {theme, toggleTheme} = useContext(ThemeContext);

    return (
        <header
            className={`fixed top-0 left-0 right-0 px-6 py-2 flex justify-between items-center backdrop-blur-lg z-50 transition-colors duration-300 ${
                theme === 'dark' ? 'bg-slate-900/80' : 'bg-white/80'
            }`}>

        </header>
    );
};