import {FC, useContext} from 'react';
import {ThemeContext} from '../../services/contexts/ThemeContext';
import logo from "./../../assets/logo_NoText.svg";

const Footer: FC = () => {
    const {theme} = useContext(ThemeContext);

    return (
        <footer className={`py-8 px-8 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-white/5' : 'bg-slate-900/5'
        }`}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <img src={logo} alt="Logo" className="h-6 w-auto"/>
                    <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        © 2024 Design AI Hub. All rights reserved.
                    </span>
                </div>

            </div>
        </footer>
    );
};

export default Footer;