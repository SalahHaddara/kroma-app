interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    loading: boolean;
    login: (token: string, userData: any) => void;
    logout: () => void;
}

