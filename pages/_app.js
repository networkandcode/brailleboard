import { useEffect } from 'react'
import { AuthProvider } from '../hooks/useAuth'
import { DataProvider } from '../hooks/useData'
import speakText from '../lib/speakText'
import '../styles/global.css'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState } from 'react'

const App = ({ Component, pageProps }) => {
    const router = useRouter()

    const [ path, setPath ] = useState()

    useEffect(() => {
        let temp = router.route.replace('/', ' ')
        if (!temp.trim()) {
            temp = 'Home'
        }
        setPath(temp)
    }, [router])

    useEffect(() => {
        speakText(`You are on the ${path} page`)
    },[path])

    return (
        <>
            <Head>
                <meta name="description" content={`Brailleboard ${router.route?.replace('/', ' ') || 'Home'} page.`} />

                <title>
                    Brailleboard webapp
                </title>
            </Head>
            <AuthProvider>
                <DataProvider>
                    <h1 className='navigationElement' description='Braille board heading'> Braille Board </h1>
                    <Component {...pageProps} />
                </DataProvider>
            </AuthProvider>
            </>
    )
}

export default App