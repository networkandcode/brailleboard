import focusNextElement from './focusNextElement'
import handleArrowPress from './handleArrowPress'

const handleKeyDown = e => {
    console.log(e.key)
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
    }
}

export default handleKeyDown
