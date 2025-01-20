import {DesignResponse} from '@/services/imageService';

export type TabId = 'prompt' | 'image' | 'suggestions';

export type DesignStatus = 'not_started' | 'tokens_pending' | 'tokens_generated' | 'image_pending' | 'complete';

export interface Tab {
    id: TabId;
    label: string;
}

export interface ThemeProps {
    isDark: boolean;
}

export interface DesignData {
    designImage?: string;
    // Add other design data properties as needed
}

interface DesignStateEntry {
    status: DesignStatus;
    data?: DesignResponse;
    error?: string;
}

export type DesignState = {
    [K in TabId]: DesignStateEntry;
}

export type DesignStatusState = {
    [K in TabId]: DesignStatus;
}

export type GenerationMessageState = {
    [K in TabId]: string;
}