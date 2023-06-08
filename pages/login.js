import { useEffect, } from 'react'
import { useAuth } from '../hooks/useAuth'
import handleKeyDown from '../lib/handleKeyDown'
import { useRouter } from 'next/router'

const Login = () => {
    const auth = useAuth()
    const { changeUser, createPhoneSession, session, user, } = auth
    const router = useRouter()

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keypress', handleKeyDown)
        return (() => {
            window.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('keypress', handleKeyDown)
        })
    }, [])

    useEffect(() => {
        const elements = document.querySelectorAll('.navigationElement')

        // Assign a tabindex to each element
        elements.forEach((element, index) => {
            element.setAttribute('tabindex', index + 1)
        })

        return (() => {
            elements.forEach((element) => {
                element.removeAttribute('tabindex')
            })
        })
    }, [])

    useEffect(() => {
        if (session.current && session.userId === user.$id) {
            router.push('/')
        }
    }, [router, user,])

    return (
        <form onSubmit={e => { e.preventDefault(); createPhoneSession() }}>
            <div>
                <label className='navigationElement' description='Phone number label' htmlFor='phone'> Phone number: </label>
            </div>
            <div>
                <input
                    className='navigationElement' 
                    description='Phone number text box' 
                    id='phoneTextBox' 
                    name='phone' 
                    onChange={changeUser} 
                    style={{ marginBottom: `15px`, width: `200px` }} 
                    type='text' 
                    value={user.phone || ''} 
                />
            </div>
            <div>
                <button className='navigationElement' type='submit'> Send OTP </button>
            </div>
        </form>
    )
}

export default Login