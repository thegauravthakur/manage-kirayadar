import { useSnackbar } from '../../hooks/zustand/useSnackbar';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { SnackbarItem } from './components/SnackbarItem';

export function Snackbar() {
    const { messages } = useSnackbar();
    return (
        <TransitionGroup className='absolute w-max mx-auto left-0 right-0 flex flex-col items-center space-y-2 pt-10'>
            {messages.map((value, index) => (
                <CSSTransition
                    key={value}
                    classNames='transition'
                    timeout={1000}
                >
                    <SnackbarItem key={value} index={index} value={value} />
                </CSSTransition>
            ))}
        </TransitionGroup>
    );
}
