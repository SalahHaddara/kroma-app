import {FC, useContext} from 'react';
import {Link} from 'react-router-dom';
import {MdOutlineLightMode, MdOutlineDarkMode} from "react-icons/md";
import {ThemeContext} from '../../services/contexts/ThemeContext';
import logo from "./../../assets/logo_NoText.svg";
import React from 'react';

const Header: FC = () => {
    const {theme, toggleTheme} = useContext(ThemeContext);

    return (
        <header
            className={`fixed top-0 left-0 right-0 px-6 py-2 flex justify-between items-center backdrop-blur-lg z-50 transition-colors duration-300 ${
                theme === 'dark' ? 'bg-slate-900/80' : 'bg-white/80'
            }`}>
            <Link to="/" className="flex items-center">
                <img src={logo} alt="Logo" className="h-16 w-auto"/>
            </Link>
            <div className="flex gap-4 items-center">
                <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-lg transition-colors duration-300 ${
                        theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-900/10 hover:bg-slate-900/20'
                    }`}
                >
                    {theme === 'dark' ? <MdOutlineDarkMode size={20}/> : <MdOutlineLightMode size={20}/>}
                </button>
                <div className="flex gap-2">
                    <button className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                        theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-900/10 hover:bg-slate-900/20'
                    }`}>
                        Log in
                    </button>
                    <button
                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors duration-300">
                        Sign up
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;