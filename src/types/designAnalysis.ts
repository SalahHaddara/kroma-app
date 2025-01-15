export interface DesignIssue {
    title: string;
    description: string;
    category: 'Layout' | 'Typography' | 'Color' | 'Spacing' | 'Navigation' | 'Accessibility';
    severity: 1 | 2 | 3;
    colorCode: string;
}


export interface DesignAnalysisData {
    critical?: DesignIssue[];
    moderate?: DesignIssue[];
    suggestions?: DesignIssue[];
    rawText?: string;
}

export interface DesignAnalysisResult {
    _id?: string;
    analysis: DesignAnalysisData;
    createdAt?: string;
}

export interface AnalysisState {
    isLoading: boolean;
    result: DesignAnalysisResult | null;
    error: string | null;
}