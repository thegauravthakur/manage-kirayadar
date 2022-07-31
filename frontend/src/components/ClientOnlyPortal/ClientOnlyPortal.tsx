import { useRef, useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ClientOnlyPortal {
    children: ReactNode;
    selector?: string;
}
export default function ClientOnlyPortal({
    children,
    selector = '#__next',
}: ClientOnlyPortal) {
    const ref = useRef<HTMLElement | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        ref.current = document.querySelector(selector);
        setMounted(true);
    }, [selector]);

    return mounted ? createPortal(children, ref.current!) : null;
}
