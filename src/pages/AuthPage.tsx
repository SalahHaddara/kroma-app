import React from 'react';
import {Card} from '@/components/ui/card';

interface AuthPageProps {
    isLogin: boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({isLogin}) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card>
            </Card>
        </div>
    );
};

export default AuthPage;