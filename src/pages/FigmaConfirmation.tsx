import React, {useEffect, useContext} from 'react';
import {useSearchParams} from 'react-router-dom';
import {ThemeContext} from '../services/contexts/ThemeContext';

const FigmaConfirmation: React.FC = () => {
    const [searchParams] = useSearchParams();
    const {theme} = useContext(ThemeContext);
    const sessionKey = searchParams.get('sessionKey');
    const isDark = theme === 'dark';

    useEffect(() => {
        async function completePluginLogin() {
            try {
                await fetch('/auth/complete-plugin-login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({sessionKey}),
                    credentials: 'include'
                });

                if (window.opener) {
                    window.close();
                }
            } catch (error) {
                console.error('Failed to complete plugin login:', error);
            }
        }

        if (sessionKey) {
            completePluginLogin();
        }
    }, [sessionKey]);

    return (
        <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
            isDark ? 'bg-slate-900' : 'bg-slate-50'
        }`}>
            <div className={`max-w-md w-full space-y-8 p-8 rounded-2xl backdrop-blur-xl ${
                isDark
                    ? 'bg-slate-800/50 border-slate-700'
                    : 'bg-white/50 border-slate-200'
            } border shadow-2xl`}>
                <div className="text-center">
                    <h2 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-500 to-pink-500 bg-clip-text text-transparent`}>
                        Successfully Connected!
                    </h2>
                    <p className={`${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                        You can now return to the Figma plugin.
                        This window will close automatically.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FigmaConfirmation;