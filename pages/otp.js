import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'

const OTP = () => {
    const auth = useAuth()
    const { changeUser, updatePhoneSession, session, user, } = auth   
    
    const router = useRouter()

    useEffect(() => {
        console.log(12, user)
        if (session.current && session.userId === user.$id && user.secret) {
            console.log('Redirecting to home page...')
            router.push('/')
        } else if (!user.phone) {
            console.log('Redirecting to login...')
            router.push('/login')
        }
    },[ router, user, ])

    return (
        <form onSubmit={ e => { e.preventDefault(); updatePhoneSession() } }>
            <div>
                <label htmlFor='phone'> OTP: </label>
            </div>
            <div>
                <input id='secret' name='secret' onChange={changeUser} style={{ marginBottom: `15px`, width: `200px` }} type='number' value={user.secret || ''} />
            </div>
            <div>
                <button className='button' type='submit'> Continue </button>
            </div>
        </form>
    )
}

export default OTP