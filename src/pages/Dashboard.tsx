type TabId = 'prompt' | 'image' | 'suggestions';

interface Tab {
    id: TabId;
    label: string;
}

interface ThemeProps {
    isDark: boolean;
}

interface BaseResultProps extends ThemeProps {
    title: string;
    children: React.ReactNode;
}

interface ImprovementItemProps extends ThemeProps {
    color: string;
    title: string;
    description: string;
}

const ResultContainer: React.FC<BaseResultProps> = ({isDark, title, children}) => (
    <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl border ${
        isDark ? 'border-slate-700' : 'border-slate-200'
    } p-6 space-y-8`}>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
    </div>
);