import React, {FC, useContext} from 'react';
import {Link} from 'react-router-dom';
import {MdOutlineLightMode, MdOutlineDarkMode} from "react-icons/md";
import {User} from 'lucide-react';
import {ThemeContext} from '../../services/contexts/ThemeContext';
import {useAuth} from '../../services/contexts/AuthContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import logo from './../../assets/logo_NoText.svg'

const Header: FC = () => {
    const {theme, toggleTheme} = useContext(ThemeContext);
    const {isAuthenticated, user, logout} = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 px-6 py-2 flex justify-between items-center backdrop-blur-lg z-50 transition-colors duration-300 ${
                theme === 'dark' ? 'bg-slate-900/80' : 'bg-white/80'
            } border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}
        >
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
                    {theme === 'dark' ?
                        <MdOutlineDarkMode size={20} className="text-white"/> :
                        <MdOutlineLightMode size={20}/>
                    }
                </button>

                {isAuthenticated ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className={`relative w-10 h-10 rounded-full ${
                                    theme === 'dark'
                                        ? 'bg-white/10 hover:bg-white/20 text-white'
                                        : 'bg-slate-900/10 hover:bg-slate-900/20 text-slate-900'
                                }`}
                            >
                                <User className="h-5 w-5"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className={`${
                                theme === 'dark'
                                    ? 'bg-slate-800 border-slate-700 text-white'
                                    : 'bg-white border-slate-200 text-slate-900'
                            }`}
                        >
                            <DropdownMenuItem
                                className={`cursor-pointer ${
                                    theme === 'dark'
                                        ? 'hover:bg-slate-700 focus:bg-slate-700'
                                        : 'hover:bg-slate-100 focus:bg-slate-100'
                                }`}
                                onClick={() => window.location.href = '/dashboard'}
                            >
                                Dashboard
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className={`cursor-pointer ${
                                    theme === 'dark'
                                        ? 'hover:bg-slate-700 focus:bg-slate-700'
                                        : 'hover:bg-slate-100 focus:bg-slate-100'
                                }`}
                                onClick={() => window.location.href = '/profile'}
                            >
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className={`cursor-pointer ${
                                    theme === 'dark'
                                        ? 'hover:bg-slate-700 focus:bg-slate-700'
                                        : 'hover:bg-slate-100 focus:bg-slate-100'
                                }`}
                                onClick={() => window.location.href = '/history'}
                            >
                                History
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className={`cursor-pointer ${
                                    theme === 'dark'
                                        ? 'hover:bg-slate-700 focus:bg-slate-700'
                                        : 'hover:bg-slate-100 focus:bg-slate-100'
                                }`}
                                onClick={handleLogout}
                            >
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="flex gap-2">
                        <Link
                            to="/login"
                            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                                theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-900/10 hover:bg-slate-900/20'
                            }`}
                        >
                            Log in
                        </Link>
                        <Link
                            to="/signup"
                            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors duration-300"
                        >
                            Sign up
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;