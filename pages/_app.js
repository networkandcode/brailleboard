import { DataProvider } from '../hooks/useData'
import '../styles/global.css'
import { useEffect } from 'react'

const App = ({ Component, pageProps }) => {
    const msg = typeof window !== 'undefined' && new SpeechSynthesisUtterance()
    
    if (msg) {
        msg.rate = 0.8
    }

    useEffect(() => {
        const elements = document.querySelectorAll('.navigationElement')
        
        // Assign a tabindex to each element
        elements.forEach((element, index) => {
            element.setAttribute('tabindex', index + 1)
        })

        const focusNextElement = () => {
            const focusedElement = document.activeElement
            const index = Array.from(elements).indexOf(focusedElement)
            const nextIndex = (index + 1) % elements.length
            elements[nextIndex].focus()
            msg.text = elements[nextIndex].innerText
            if (msg.text) speechSynthesis.speak(msg)
        }

        const onKeyDown = e => {
            const { key } = e
            switch(key) {
                case 'Tab':
                    e.preventDefault()
                    focusNextElement()
                    break
            }
        }

        document.addEventListener('keydown', onKeyDown)
    }, [])

    return (
        <DataProvider>
            <h1 className='navigationElement'> Braille Board </h1>
            <Component {...pageProps} />
        </DataProvider>
    ) 
}

export default App