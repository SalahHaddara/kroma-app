import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Card} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';

interface AuthPageProps {
    isLogin: boolean;
}

interface AuthFormData {
    email: string;
    password: string;
    fullName?: string;
    rememberMe?: boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({isLogin}) => {
    const navigate = useNavigate();

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

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8">
                <h2 className="text-2xl font-bold mb-2">
                    {isLogin ? 'Welcome back' : 'Create account'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm">Email</label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full"
                            placeholder="you@example.com"
                        />
                    </div>
                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="text-sm">Full Name</label>
                            <Input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full"
                                placeholder="Salah Haddara"
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm">Password</label>
                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full"
                            placeholder="•••••••"
                        />
                    </div>
                    {isLogin && (
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center">
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