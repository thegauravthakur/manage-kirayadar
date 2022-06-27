import create from 'zustand';

interface SnackBarState {
    messages: string[];
    show: (message: string) => void;
    hide: (index: number) => void;
    hideLast: () => void;
}

export const useSnackbar = create<SnackBarState>((set) => ({
    messages: [],
    show: (value) => {
        return set((prevState) => ({
            ...prevState,
            messages: [value, ...prevState.messages],
        }));
    },
    hide: (index) => {
        return set((prevState) => ({
            ...prevState,
            messages: prevState.messages.filter((_, i) => i !== index),
        }));
    },
    hideLast: () =>
        set((state) => ({
            ...state,
            messages: state.messages.filter(
                (_, i) => i !== state.messages.length - 1
            ),
        })),
}));
