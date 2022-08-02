import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

interface AddNewPropertyCardProps {
    setShowDialog: Dispatch<SetStateAction<boolean>>;
}
export function AddNewPropertyCard({ setShowDialog }: AddNewPropertyCardProps) {
    return (
        <div className='card w-full max-w-sm bg-base-100 shadow-xl image-full h-60'>
            <figure>
                <Image
                    alt='house'
                    layout='fill'
                    src='https://res.cloudinary.com/gauravthakur/image/upload/v1656783892/Manage%20Kirayadar/house-image_vbvhin.jpg'
                />
            </figure>
            <div className='card-body'>
                <h2 className='card-title'>Register a new property!</h2>
                <p>
                    Simply register a new property within minutes, and
                    we&apos;ll take care of the rest
                </p>
                <div className='card-actions justify-end'>
                    <button
                        className='btn btn-primary btn-md'
                        onClick={() => setShowDialog(true)}
                    >
                        Register Now
                    </button>
                </div>
            </div>
        </div>
    );
}
