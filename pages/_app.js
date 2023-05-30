import '../styles/global.css'

const App = ({ Component, pageProps }) => {
    return (
        <>
            <h1> Braille Board </h1>
            <Component {...pageProps} />
        </>
    ) 
}

export default App