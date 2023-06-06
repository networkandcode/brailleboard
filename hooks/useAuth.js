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

    const [ session, setSession ] = useState({})
    const [user, setUser] = useState({})

    const changeUser = e => {
        e.preventDefault()
        const { name, value } = e.target
        setUser({ ...user, [name]: value })
    }

    const createPhoneSession = () => {
        const { $id, phone, } = user
        const promise = account.createPhoneSession($id || ID.unique(), phone)

        promise.then(token => {
            setUser({ ...user, $id: token.userId })
            router.push('/otp')
        }), error => {
            console.log(error)
        }
    }

    const deleteSession = () => {
        const promise = account.deleteSession(session.$id)

        promise.then(() => {
            console.log('clear session')
            setSession({})
            localStorage.removeItem('APPWRITE_SESSION')
            setUser({})
        }), err => {
            console.log(err)
        }
    }

    const deleteSessions = () => {
        const promise = account.deleteSessions()

        promise.then(() => {
            setSession({})
            setUser({})
        }), err => {
            console.log(err)
        }
    }

    const get = () => {
        const promise = account.get()

        promise.then((resp) => {
            setUser(resp)
            console.log(56, resp)
        }), err => {
            console.log(57, err)
        }
    }

    const updatePhoneSession = () => {
        console.log(59, user)
        const { $id, secret, } = user
        const promise = account.updatePhoneSession($id, secret)

        promise.then(response => {
            setSession(response)
            localStorage.setItem('APPWRITE_SESSION', JSON.stringify(response))
            console.log(response)
            router.push('/')
        }), error => {
            console.log(error)
        }
    }

    useEffect(() => {
        const temp = localStorage.getItem('APPWRITE_SESSION')
        console.log(temp)
    
        if (temp) {
            const tempInJson = JSON.parse(temp)
            const expiryDate = new Date(tempInJson.expire)
            const currentDate = new Date()

            if (expiryDate >= currentDate) {
                setSession(JSON.parse(temp))
                get()
            }
        }
    }, [])

    return {
        changeUser,
        createPhoneSession,
        deleteSession,
        deleteSessions,
        session,
        user,
        updatePhoneSession,
    }
}

export const AuthProvider = ({ children }) => {
    const data = useAuthProvider()
    return <Provider value={data}> {children} </Provider>
}
