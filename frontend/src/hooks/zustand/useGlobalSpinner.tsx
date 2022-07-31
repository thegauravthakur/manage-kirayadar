import create from 'zustand';

export interface GlobalSpinnerState {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
}

export const useGlobalSpinner = create<GlobalSpinnerState>((set) => ({
    isVisible: false,
    show: () => {
        return set((prevState) => ({
            ...prevState,
            isVisible: true,
        }));
    },
    hide: () => {
        return set((prevState) => ({
            ...prevState,
            isVisible: false,
        }));
    },
}));
