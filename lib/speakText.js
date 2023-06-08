const speakText = (text) => {
    const msg = typeof window !== 'undefined' && new SpeechSynthesisUtterance()
    if (msg) {
        msg.rate = 0.8
        msg.text = text
        speechSynthesis.cancel()
        speechSynthesis.speak(msg)
    }
}

export default speakText
