import React, {useState} from 'react';
import {Card} from '@/components/ui/card';


interface AuthPageProps {
    isLogin: boolean;
}

interface AuthFormData {
    email: string;
    password: string;
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