import speakText from "./speakText"

const focusNextElement = () => {
    const elements = typeof window !== 'undefined' && document.querySelectorAll('.navigationElement')
    const focusedElement = document.activeElement
    const index = Array.from(elements).indexOf(focusedElement)
    const nextIndex = (index + 1) % elements.length
    elements[nextIndex].focus()

    speakText(elements[nextIndex].getAttribute('description') || elements[nextIndex].innerText)
}

export default focusNextElement
