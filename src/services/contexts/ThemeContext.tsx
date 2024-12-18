import {createContext, useState, useEffect, FC, ReactNode} from 'react';
import {ThemeContextType} from '../../types/interfaces';

export const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    toggleTheme: () => {
    }
});

export const ThemeProvider: FC<{ children: ReactNode }> = ({children}) => {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            setTheme('light');
            document.body.classList.add('light-mode');
        }
    }, []);


    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};
