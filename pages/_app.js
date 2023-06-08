import { useEffect } from 'react'
import { AuthProvider } from '../hooks/useAuth'
import { DataProvider } from '../hooks/useData'
import speakText from '../lib/speakText'
import '../styles/global.css'
import { useRouter } from 'next/router'

const App = ({ Component, pageProps }) => {
    const router = useRouter()

    useEffect(() => {
        let path = router.route
        if(path === '/') {
            path = 'Home'
        }
        speakText(`You are on the ${path} page`)
    }, [ router ])

    return (
        <AuthProvider>
            <DataProvider>
                <h1 className='navigationElement' description='Braille board heading'> Braille Board </h1>
                <Component {...pageProps} />
            </DataProvider>
        </AuthProvider>
    )
}

export default App