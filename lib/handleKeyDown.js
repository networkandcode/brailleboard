import focusNextElement from './focusNextElement'
import handleArrowPress from './handleArrowPress'

const handleKeyDown = e => {
    if (e.key === 'Tab') {
        e.preventDefault()
        focusNextElement()
    } else {
        handleArrowPress(e)
    }
}

export default handleKeyDown
