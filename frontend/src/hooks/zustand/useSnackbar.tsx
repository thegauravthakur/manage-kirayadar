import create from 'zustand';

interface SnackBarState {
    message: string[];
    show: (message: string) => void;
    hide: (index: number) => void;
    hideLast: () => void;
}

export const useSnackbar = create<SnackBarState>((set) => ({
    message: [],
    show: (value) => {
        return set((prevState) => ({
            ...prevState,
            message: [value, ...prevState.message],
        }));
    },
    hide: (index) => {
        return set((prevState) => ({
            ...prevState,
            message: prevState.message.filter((_, i) => i !== index),
        }));
    },
    hideLast: () =>
        set((state) => ({
            ...state,
            message: state.message.filter(
                (_, i) => i !== state.message.length - 1
            ),
        })),
}));
