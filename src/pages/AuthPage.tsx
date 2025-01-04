import React, {useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Card} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {ThemeContext} from '@/services/contexts/ThemeContext';
import {FaGoogle, FaGithub} from "react-icons/fa";


interface AuthPageProps {
    isLogin: boolean;
}

interface AuthFormData {
    email: string;
    password: string;
    fullName?: string;
    rememberMe?: boolean;
}

interface SocialLoginProps {
    provider: 'google' | 'github';
    onClick: () => void;
}

const SocialLoginButton: React.FC<SocialLoginProps> = ({provider, onClick}) => {
    const {theme} = useContext(ThemeContext);
    const Icon = provider === 'google' ? FaGoogle : FaGithub;
    const text = `Continue with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`;

    return (
        <Button
            variant="outline"
            className={`w-full transition-colors duration-300 ${
                theme === 'dark'
                    ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700 text-white'
                    : 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-800'
            }`}
            onClick={onClick}
        >
            <Icon className="w-5 h-5 mr-2"/>
            {text}
        </Button>
    );
};

const AuthPage: React.FC<AuthPageProps> = ({isLogin}) => {
    const navigate = useNavigate();
    const {theme} = useContext(ThemeContext);

    const [formData, setFormData] = useState<AuthFormData>({
        email: '',
        password: '',
        fullName: '',
        rememberMe: false
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toggleAuthMode = () => {
        navigate(isLogin ? '/signup' : '/login');
    };

    const handleSocialLogin = (provider: 'google' | 'github'): void => {
        console.log(`${provider} login clicked`);
    }

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'
        }`}>
            <div className="mb-8 text-center">
                {/* Logo waves */}
                <div className="flex justify-center gap-1 mb-6">
                    <div className="w-16 h-2 bg-pink-400 rounded-full transform translate-y-2"></div>
                    <div className="w-16 h-2 bg-indigo-600 rounded-full transform -translate-y-0"></div>
                    <div className="w-16 h-2 bg-teal-400 rounded-full transform translate-y-2"></div>
                </div>
                <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                    {isLogin ? 'Welcome back' : 'Create account'}
                </h2>
                <p className={`transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                    {isLogin ? 'Enter your details to sign in' : 'Start your design journey'}
                </p>
            </div>
            <Card
                className={`w-full max-w-md backdrop-blur-xl p-8 rounded-2xl shadow-2xl transition-colors duration-300 ${
                    theme === 'dark'
                        ? 'bg-gray-800/50 border-gray-700'
                        : 'bg-white/50 border-gray-200'
                }`}>
                <div className="mb-8 text-center">
                    {/* Logo waves */}
                    <div className="flex justify-center gap-1 mb-6">
                        <div className="w-16 h-2 bg-pink-400 rounded-full transform translate-y-2"></div>
                        <div className="w-16 h-2 bg-indigo-600 rounded-full transform -translate-y-0"></div>
                        <div className="w-16 h-2 bg-teal-400 rounded-full transform translate-y-2"></div>
                    </div>
                    <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                        {isLogin ? 'Welcome back' : 'Create account'}
                    </h2>
                    <p className={`transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        {isLogin ? 'Enter your details to sign in' : 'Start your design journey'}
                    </p>
                </div>
                <h2 className="text-2xl font-bold mb-2">
                    {isLogin ? 'Welcome back' : 'Create account'}
                </h2>

                <div className="space-y-3 mb-6">
                    <SocialLoginButton
                        provider="google"
                        onClick={() => handleSocialLogin('google')}
                    />
                    <SocialLoginButton
                        provider="github"
                        onClick={() => handleSocialLogin('github')}
                    />
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className={`w-full border-t transition-colors duration-300 ${
                            theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                        }`}></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                    <span className={`px-2 transition-colors duration-300 ${
                        theme === 'dark'
                            ? 'bg-gray-800/50 text-gray-400'
                            : 'bg-white/50 text-gray-500'
                    }`}>Or continue with</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className={`text-sm transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>Email</label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`transition-colors duration-300 ${
                                theme === 'dark'
                                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500'
                                    : 'bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400'
                            }`}
                            placeholder="you@example.com"
                        />
                    </div>
                    {!isLogin && (
                        <div className="space-y-2">
                            <label className={`text-sm transition-colors duration-300 ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>Full Name</label>
                            <Input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className={`transition-colors duration-300 ${
                                    theme === 'dark'
                                        ? 'bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500'
                                        : 'bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400'
                                }`}
                                placeholder="Salah Haddara"
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className={`text-sm transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>Password</label>
                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`transition-colors duration-300 ${
                                theme === 'dark'
                                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500'
                                    : 'bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400'
                            }`}
                            placeholder="•••••••"
                        />
                    </div>
                    {isLogin && (
                        <div className="flex items-center justify-between text-sm">
                            <label className={`text-sm transition-colors duration-300 ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                    className="mr-2 rounded"
                                />
                                Remember me
                            </label>
                            <button
                                type="button"
                                className="text-indigo-500 hover:text-indigo-400"
                            >
                                Forgot password?
                            </button>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg"
                    >
                        {isLogin ? 'Sign in' : 'Create account'}
                    </Button>
                </form>
                <div className="mt-6 text-center text-sm">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={toggleAuthMode}
                        className="text-indigo-500 hover:text-indigo-400"
                    >
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default AuthPage;