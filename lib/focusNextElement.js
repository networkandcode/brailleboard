const focusNextElement = () => {
    const elements = typeof window !== 'undefined' && document.querySelectorAll('.navigationElement')
    console.log(3, elements, elements.length)
    const focusedElement = document.activeElement
    const index = Array.from(elements).indexOf(focusedElement)
    const nextIndex = (index + 1) % elements.length
    console.log(6, elements[nextIndex])
    elements[nextIndex].focus()
    const msg = typeof window !== 'undefined' && new SpeechSynthesisUtterance()
    if (msg) {
        msg.rate = 0.8
    }
    msg.text = elements[nextIndex].innerText || elements[nextIndex].getAttribute('name')
    speechSynthesis.cancel()
    if (msg.text) speechSynthesis.speak(msg)
}

export default focusNextElement