import { useState } from 'react'

const TextBox = ({ doc }) => {
    const [brailleMode, setBrailleMode] = useState(false)
    const [text, setText] = useState(doc.text)

    const handleArrowPress = e => {
        if (e.code.includes('Arrow')) {
            //const { value } = e.target
            const length = text.length
            let start = e.target.selectionStart

            if (e.code === 'ArrowLeft') {
                start = start - 1
            } else if (e.code === 'ArrowRight') {
                start = start + 1
            }

            if (start <= 0) {
                const char = text[0]
                const cursorText = brailleMode ? character_dict[char.toUpperCase()]['dot'] : char
                setTextToRead(`${cursorText} beginning of the document`)
            } else if (start >= length) {
                setTextToRead('End of the document')
            } else {
                const char = text[start]
                console.log(135, char)
                const cursorText = brailleMode ? character_dict[char.toUpperCase()]['dot'] : char.trim()
                setTextToRead(cursorText || 'space')
            }
        }
    }

    const handleCtrl1 = () => {
        if (brailleMode) {
            setBrailleMode(false)
        }
    }

    const handleCtrl2 = () => {
        if (!brailleMode) {
            setBrailleMode(true)
        }
    }

    const handleCtrl3 = () => {
        const selectedText = window.getSelection().toString()
        if (selectedText) {
            setTextToRead(selectedText)
        } else if (!text) {
            setTextToRead('Your document is empty.')
        } else {
            if (brailleMode) {
                setTextToRead(dotText)
            } else {
                setTextToRead(text)
            }
        }
    }

    const toggle = e => {
        e.preventDefault()
        setBrailleMode(!brailleMode)
    }

    useEffect(() => {
        if (brailleMode) {
            brailleTextRef.current.focus()
            setTextToRead('You are in braille view mode')
        } else {
            textRef.current.focus()
            setTextToRead('You are in text edit mode')
        }
    }, [brailleMode])

    return (
        <div style={{ justifyContent: `center`, height: `100vh`, width: `100%` }} >
            <h2> New document: </h2>
            {brailleMode
                ? (
                    <textarea
                        id='brailleText'
                        name='brailleText'
                        onKeyDown={handleKeyDown}
                        placeholder='View in Braille'
                        ref={brailleTextRef}
                        style={{ fontSize: `50px`, height: `100%`, lineHeight: `1`, overflow: `hidden`, width: `100%` }}
                        value={brailleText}
                    />
                ) : (
                    <textarea
                        id='text'
                        onChange={onChange}
                        onKeyDown={handleKeyDown}
                        name='text'
                        placeholder='Type in English'
                        ref={textRef}
                        style={{ fontSize: `50px`, height: `100%`, lineHeight: `1`, overflow: `hidden`, width: `100%` }}
                        value={text}
                    />
                )
            }
        </div>
    )
}

export default TextBox