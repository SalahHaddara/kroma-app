import {FC, useContext} from 'react';
import {ThemeContext} from '../../services/contexts/ThemeContext';

const Footer: FC = () => {
    const {theme} = useContext(ThemeContext);

    return (
        <footer className={`py-8 px-8 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-white/5' : 'bg-slate-900/5'
        }`}>

        </footer>
    );
};

export default Footer;