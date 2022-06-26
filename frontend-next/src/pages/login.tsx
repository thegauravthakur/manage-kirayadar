export interface User {
    id: number;
    email: string;
    name: string;
    avatarUrl: null;
}

export default function Login() {
    return (
        <div className='h-screen flex justify-center items-center bg-slate-100'>
            <form
                className='border space-y-6 p-4 rounded-md w-full max-w-sm shadow bg-white'
                method='post'
            >
                <h1 className='text-2xl font-bold text-center text-blue-600'>
                    Login Page
                </h1>
                <fieldset className='space-y-4'>
                    <div className='space-y-1.5'>
                        <label htmlFor='email'>
                            <h2>Email</h2>
                        </label>
                        <input
                            required
                            className='border rounded-md w-full p-1.5 outline-none focus:ring bg-slate-100'
                            id='email'
                            name='email'
                            type='email'
                        />
                    </div>
                    <div className='space-y-1.5'>
                        <label htmlFor='password'>
                            <h2>Password</h2>
                        </label>
                        <input
                            required
                            className='border rounded-md w-full p-1.5 outline-none focus:ring bg-slate-100'
                            id='password'
                            name='password'
                            type='password'
                        />
                    </div>
                    <button
                        className='w-full p-1.5 border rounded-md bg-blue-600 text-white'
                        type='submit'
                    >
                        submit
                    </button>
                </fieldset>
            </form>
        </div>
    );
}
