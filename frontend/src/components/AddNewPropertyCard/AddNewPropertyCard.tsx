import Image from 'next/image';
import { useState } from 'react';
import { AddNewPropertyDialog } from '../AddNewPropertyDialog';

export function AddNewPropertyCard() {
    const [showDialog, setShowDialog] = useState(false);

    return (
        <div className='card w-96 bg-base-100 shadow-xl image-full'>
            <figure>
                <Image
                    alt='house'
                    height={250}
                    src='https://res.cloudinary.com/gauravthakur/image/upload/v1656783892/Manage%20Kirayadar/house-image_vbvhin.jpg'
                    width={400}
                />
            </figure>
            <div className='card-body'>
                <h2 className='card-title'>Register a new property!</h2>
                <p>
                    Simply register a new property with minutes, and I&apos;ll
                    take care of the rest
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
            <AddNewPropertyDialog
                setShowDialog={setShowDialog}
                showDialog={showDialog}
            />
        </div>
    );
}
