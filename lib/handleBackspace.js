import speakText from './speakText'

const handleBackspace = e => {
    const text = e.target.value
    const length = text.length
    let start = e.target.selectionStart
    let textToSpeak = `${e.key} `

    if (e.code === 'Backspace') {
        start = start - 1
    } else if (e.code === 'Delete') {
        start = start
    }

    if (start <= 0) {
        let char = text[0]
        if (char === undefined) char = ''
        textToSpeak += `${char} beginning of the text`
    } else if (start >= length) {
        textToSpeak += `end of the text`
    } else {
        let char = text[start].trim()
        if (char === '.') char = 'dot'
        console.log(char)
        textToSpeak += char || 'space'
    }

    speakText(textToSpeak)
}
export default handleBackspace