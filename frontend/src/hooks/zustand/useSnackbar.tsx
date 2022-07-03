import create from 'zustand';

export interface SnackBarState {
    message: string;
    type: 'error' | 'info' | 'success';
    show: (message: string, type: SnackBarState['type']) => void;
    hide: () => void;
}

export const useSnackbar = create<SnackBarState>((set) => ({
    message: '',
    type: 'success',
    show: (value, type) => {
        return set((prevState) => ({
            ...prevState,
            message: value,
            type,
        }));
    },
    hide: () => {
        return set((prevState) => ({
            ...prevState,
            message: '',
        }));
    },
}));
