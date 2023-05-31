import { DataProvider } from '../hooks/useData'
import '../styles/global.css'

const App = ({ Component, pageProps }) => {
    return (
        <DataProvider>
            <h1 className='navigationElement'> Braille Board </h1>
            <Component {...pageProps} />
        </DataProvider>
    )
}

export default App