import speakText from '../lib/speakText'
import { Account, Client, ID, } from 'appwrite'
import { useRouter, } from 'next/router'
import { createContext, useContext, useEffect, useState, } from 'react'

const client = new Client();

const account = new Account(client);

client
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJ_ID)

const AuthContext = createContext()
const { Provider } = AuthContext
export const useAuth = () => useContext(AuthContext)

const useAuthProvider = () => {
    const router = useRouter()

    const [session, setSession] = useState({})
    const [user, setUser] = useState({})

    const changeUser = e => {
        e.preventDefault()
        const { name, value } = e.target
        setUser({ ...user, [name]: value })

        const lastChar = value.charAt(value.length - 1)
        if (lastChar === ' ') {
            speakText('space')
        } else {
            speakText(lastChar)
        }
    }

    const createPhoneSession = () => {
        const { $id, phone, } = user
        const promise = account.createPhoneSession($id || ID.unique(), phone)

        promise.then(token => {
            speakText('OTP sent')
            setUser({ ...user, $id: token.userId })
            router.push('/otp')
        }), error => {
            console.log(error)
        }
    }

    const deleteSession = () => {
        const promise = account.deleteSession(session.$id)

        promise.then(() => {
            setSession({})
            localStorage.removeItem('APPWRITE_SESSION')
            setUser({})
            speakText('Logged out')
        }), err => {
            console.log(err)
        }
    }

    const get = () => {
        const promise = account.get()

        promise.then((resp) => {
            setUser(resp)
        }), err => {
            console.log(err)
        }
    }

    const updatePhoneSession = () => {
        const { $id, secret, } = user
        const promise = account.updatePhoneSession($id, secret)

        promise.then(response => {
            setSession(response)
            localStorage.setItem('APPWRITE_SESSION', JSON.stringify(response))
            router.push('/')
        }), error => {
            console.log(error)
        }
    }

    useEffect(() => {
        const temp = localStorage.getItem('APPWRITE_SESSION')

        if (temp) {
            const tempInJson = JSON.parse(temp)
            const expiryDate = new Date(tempInJson.expire)
            const currentDate = new Date()

            if (expiryDate >= currentDate) {
                setSession(JSON.parse(temp))
                get()
            }
        } else {
            localStorage.removeItem('APPWRITE_SESSION')
        }
    }, [])

    return {
        changeUser,
        createPhoneSession,
        deleteSession,
        session,
        user,
        updatePhoneSession,
    }
}

export const AuthProvider = ({ children }) => {
    const data = useAuthProvider()
    return <Provider value={data}> {children} </Provider>
}
