import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import handleKeyDown from '../lib/handleKeyDown'
import { useRouter } from 'next/router'

const OTP = () => {
    const auth = useAuth()
    const { changeUser, updatePhoneSession, session, user, } = auth   
    
    const router = useRouter()

    useEffect(() => {
        if (session.current && session.userId === user.$id && user.secret) {
            router.push('/')
        } else if (!user.phone) {
            router.push('/login')
        }
    },[ router, user, ])

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

    return (
        <form onSubmit={ e => { e.preventDefault(); updatePhoneSession() } }>
            <div>
                <label className='navigationElement' description='OTP label' htmlFor='secret'> OTP: </label>
            </div>
            <div>
                <input className='navigationElement' description='OTP text box' id='secret' name='secret' onChange={changeUser} style={{ marginBottom: `15px`, width: `200px` }} type='number' value={user.secret || ''} />
            </div>
            <div>
                <button className='navigationElement' type='submit'> Continue </button>
            </div>
        </form>
    )
}

export default OTP