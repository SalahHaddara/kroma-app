export interface ThemeContextType {
    theme: 'dark' | 'light';
    toggleTheme: () => void;
}

export interface Feature {
    title: string;
    icon: string;
    description: string;
    buttonText: string;
    imageSrc: {
        dark: string;
        light: string;
    };
    onClick: () => void;
}