import speakText from './speakText'

const handleArrowPress = e => {
    const text = e.target.value
    const length = text.length
    let start = e.target.selectionStart

    if (e.code === 'ArrowLeft') {
        start = start - 1
    } else if (e.code === 'ArrowRight') {
        start = start + 1
    }

    if (start <= 0) {
        let char = text[0]
        if (char === undefined) char = ''
        speakText(`${char} beginning of the text`)
    } else if (start >= length) {
        speakText('end of the text')
    } else {
        const char = text[start].trim()
        speakText(char || 'space')
    }
}
export default handleArrowPress