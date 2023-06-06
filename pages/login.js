import { useEffect, } from 'react'
import { useAuth } from '../hooks/useAuth'
import focusNextElement from '../lib/focusNextElement'
import { useRouter } from 'next/router'

const Login = () => {
    const auth = useAuth()
    const { changeUser, createPhoneSession, session, user, } = auth
    const router = useRouter()

    const handleKeyDown = e => {
        if (e.key === 'Tab') {
            console.log(57, e.key)
            e.preventDefault()
            focusNextElement()
        }
    }

    useEffect(() => {
        console.log('20')
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
        console.log(session, user)
        if (session.current && session.userId === user.$id) {
            console.log('Redirecting to home page...')
            router.push('/')
        }
    }, [router, user,])

    return (
        <form onSubmit={e => { e.preventDefault(); createPhoneSession() }}>
            <div>
                <label className='navigationElement' htmlFor='phone'> Phone number: </label>
            </div>
            <div>
                <input className='navigationElement' id='phoneTextBox' name='phone' onChange={changeUser} style={{ marginBottom: `15px`, width: `200px` }} type='text' value={user.phone || ''} />
            </div>
            <div>
                <button className='navigationElement' type='submit'> Send OTP </button>
            </div>
        </form>
    )
}

export default Login