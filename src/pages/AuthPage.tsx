import React from 'react';

interface AuthPageProps {
    isLogin: boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({isLogin}) => {
    return <div>Auth Page</div>;
};

export default AuthPage;