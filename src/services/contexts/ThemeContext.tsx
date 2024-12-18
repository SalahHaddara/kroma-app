import {createContext, useState, useEffect, FC, ReactNode} from 'react';
import {ThemeContextType} from '../../types/interfaces';

export const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    toggleTheme: () => {
    }
});


