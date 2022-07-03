import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import { getCurrentUser } from '../../helpers/userHelper';
import { createEndpoint, fetchWithToken } from '../../helpers/fetchHelper';
import { Property, Response } from '../../types';

export default function DetailedProperty() {
    return (
        <div>
            <p>yooo</p>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({
    req,
    res,
    query,
}) => {
    const { id: propertyId } = query;
    const redirect = { redirect: { destination: '/login', permanent: false } };
    try {
        const accessToken = getCookie('accessToken', { req, res });
        if (!accessToken) return redirect;
        if (accessToken) {
            const result = await getCurrentUser(accessToken as string);
            if (!result.data?.user) return redirect;
            const response = await fetchWithToken(
                createEndpoint('property/get'),
                accessToken as string
            );
            const { data } = (await response.json()) as Response<{
                properties: Property[];
            }>;
            const hasAccess = data.properties.some(
                ({ id }) => Number(id) === Number(propertyId)
            );
            if (hasAccess) {
                return { props: {} };
            }
            return { notFound: true };
        }
    } catch (error) {
        return redirect;
    }
    return { notFound: true };
};
