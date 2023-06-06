import { AuthProvider } from '../hooks/useAuth'
import { DataProvider } from '../hooks/useData'
import '../styles/global.css'

const App = ({ Component, pageProps }) => {
    return (
        <AuthProvider>
            <DataProvider>
                <h1 className='navigationElement'> Braille Board </h1>
                <Component {...pageProps} />
            </DataProvider>
        </AuthProvider>
    )
}

export default App