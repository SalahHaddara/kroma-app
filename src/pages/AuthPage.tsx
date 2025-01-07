import React, {useState, useContext, useEffect} from 'react';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {FaGoogle, FaGithub} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {ThemeContext} from '@/services/contexts/ThemeContext';
import * as authService from '../services/auth';
import {useAuth} from '../services/contexts/AuthContext';

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
    const {login, signup, isAuthenticated, loading} = useAuth();
    const [error, setError] = useState<string>('');
    const [formLoading, setFormLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<AuthFormData>({
        email: '',
        password: '',
        fullName: '',
        rememberMe: false
    });

    useEffect(() => {
        if (isAuthenticated && !loading) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, loading, navigate]);

    const handleSocialLogin = (provider: 'google' | 'github'): void => {
        console.log(`${provider} login clicked`);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setFormLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                if (!formData.fullName) {
                    throw new Error('Full name is required');
                }
                await signup(formData.fullName, formData.email, formData.password);
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Authentication failed');
        } finally {
            setFormLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const auth2 = google.accounts.oauth2.initCodeClient({
                client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID!,
                scope: 'email profile',
                callback: async (response) => {
                    if (response.code) {
                        await authService.googleAuth(response.code);
                        navigate('/dashboard');
                    }
                },
            });
            auth2.requestCode();
        } catch (err) {
            setError('Google sign-in failed');
        }
    };

    const handleGithubLogin = () => {
        const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;
        const REDIRECT_URI = `${window.location.origin}/github-callback`;
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email`;
    };

    const toggleAuthMode = () => {
        navigate(isLogin ? '/signup' : '/login');
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'
        }`}>
            {/* Decorative waves */}
            <div className="fixed top-0 right-0 w-1/2 h-screen opacity-10">
                <div
                    className="absolute top-1/4 right-0 w-96 h-32 bg-pink-400 rounded-full blur-3xl transform rotate-12"></div>
                <div
                    className="absolute top-1/3 right-24 w-96 h-32 bg-indigo-600 rounded-full blur-3xl transform -rotate-12"></div>
                <div
                    className="absolute top-1/2 right-12 w-96 h-32 bg-teal-400 rounded-full blur-3xl transform rotate-6"></div>
            </div>

            <Card
                className={`mt-16 w-full max-w-md backdrop-blur-xl p-8 rounded-2xl shadow-2xl transition-colors duration-300 ${
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

                {/* Social Login Buttons */}
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

                {/* Divider */}
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
                            <label className={`flex items-center transition-colors duration-300 ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                    className={`mr-2 rounded transition-colors duration-300 ${
                                        theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600'
                                            : 'bg-gray-100 border-gray-200'
                                    }`}
                                />
                                Remember me
                            </label>
                            <button type="button" className="text-indigo-500 hover:text-indigo-400">
                                Forgot password?
                            </button>
                        </div>
                    )}

                    <Button type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg">
                        {isLogin ? 'Sign in' : 'Create account'}
                    </Button>
                </form>

                <div className={`mt-6 text-center text-sm transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
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

export const GitHubCallback: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get('code');
        if (code) {
            authService.githubAuth(code)
                .then(() => navigate('/dashboard'))
                .catch(err => {
                    setError('GitHub authentication failed');
                    setTimeout(() => navigate('/login'), 3000);
                });
        }
    }, [navigate]);

    if (error) {
        return <div>{error}</div>;
    }

    return <div>Processing GitHub login...</div>;
};