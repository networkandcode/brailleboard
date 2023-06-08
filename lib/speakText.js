const speakText = text => {
    const msg = typeof window !== 'undefined' && new SpeechSynthesisUtterance()

    //setTimeout(msg => {
        if (msg) {
            msg.rate = 0.8
            msg.text = text
            speechSynthesis.cancel()
            speechSynthesis.speak(msg)
        }
    //}, 2000)
}

export default speakText
