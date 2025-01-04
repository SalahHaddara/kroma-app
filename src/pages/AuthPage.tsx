import React from 'react';
import {Card} from '@/components/ui/card';

interface AuthPageProps {
    isLogin: boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({isLogin}) => {
    return <div>Auth Page</div>;
};

export default AuthPage;