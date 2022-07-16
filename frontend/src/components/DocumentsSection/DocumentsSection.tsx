import { DocumentListItem } from './components/DocumentListItem';

export function DocumentsSection() {
    return (
        <div className='bg-base-100 h-max p-5 space-y-2 rounded-xl shadow-md'>
            <h2 className='text-xl text-primary font-semibold'>Documents</h2>
            <ul>
                <DocumentListItem name='Adhaar Card' />
                <DocumentListItem name='PAN Card' />
                <DocumentListItem name='Passport' />
                <DocumentListItem name='Driving License' />
                <DocumentListItem isLast name='Salary Slip' />
            </ul>
        </div>
    );
}
