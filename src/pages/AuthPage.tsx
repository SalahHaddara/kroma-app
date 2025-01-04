import React, {useState} from 'react';
import {Card} from '@/components/ui/card';
import {Input} from '@/components/ui/input';

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

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8">
                <h2 className="text-2xl font-bold mb-2">
                    {isLogin ? 'Welcome back' : 'Create account'}
                </h2>
            </Card>
        </div>
    );
};

export default AuthPage;