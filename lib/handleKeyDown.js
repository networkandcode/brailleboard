import focusNextElement from './focusNextElement'
import handleArrowPress from './handleArrowPress'
import handleBackspace from './handleBackspace'
import speakText from './speakText'

const handleKeyDown = e => {
    if (e.key === 'Tab') {
        e.preventDefault()
        focusNextElement()
    } else if (e.key?.includes('Arrow')) {
        handleArrowPress(e)
    } else if (e.key === 'Enter') {
        Array.from(document.getElementsByClassName('active')).forEach(element => {
            element.classList.remove('active')
        })
        e.target.className += ' active'
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleBackspace(e)
    } else {
        speakText(e.key)
    }
}

export default handleKeyDown
