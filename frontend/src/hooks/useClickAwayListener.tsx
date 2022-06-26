import { RefObject, useEffect } from 'react';

export function useClickAwayListener(
    callback: () => void,
    ref: RefObject<HTMLElement>
) {
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [callback, ref]);
}
