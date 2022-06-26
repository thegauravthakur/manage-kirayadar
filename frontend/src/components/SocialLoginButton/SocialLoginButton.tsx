import clsx from 'clsx';
import { IconBaseProps } from 'react-icons';
import { AiOutlineLoading } from 'react-icons/ai';

interface SocialLoginButtonProps {
    TrailingWidget: (props: IconBaseProps) => JSX.Element;
    isLoading: boolean;
    text: string;
    onClick: () => void;
}

export function SocialLoginButton({
    TrailingWidget,
    isLoading,
    text,
    onClick,
}: SocialLoginButtonProps) {
    return (
        <button
            className={clsx(
                'border px-5 py-2 shadow rounded-md w-full max-w-[250px]',
                'transition-shadow duration-300',
                'flex items-center space-x-3',
                { 'hover:shadow-xl active:shadow': !isLoading }
            )}
            disabled={isLoading}
            type='button'
            onClick={onClick}
        >
            {isLoading ? (
                <AiOutlineLoading
                    className={clsx('animate-spin')}
                    fontSize={18}
                />
            ) : (
                <TrailingWidget fontSize={18} />
            )}
            <span>{text}</span>
        </button>
    );
}
