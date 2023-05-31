import ListDocsFromAppwriteDB from '../components/ListDocsFromAppwriteDB'
import characterDict from '../constants/characterDict'
import focusNextElement from '../lib/focusNextElement'
import Link from 'next/link'
import { useEffect, useState, } from 'react'

const Home = () => {
  const msg = typeof window !== 'undefined' && new SpeechSynthesisUtterance()
  if (msg) {
    msg.rate = 0.8
  }

  const [brailleMode, setBrailleMode] = useState(false)
  const [brailleText, setBrailleText] = useState('')
  const [dotText, setDotText] = useState('')
  const [text, setText] = useState('')
  const [textToRead, setTextToRead] = useState('')
  const [ elements, setElements ] = useState()

  const onChange = e => {
    e.preventDefault()
    const { value } = e.target

    setText(value)

    let linesInBraille = []
    let linesInDot = []

    value.split('\n').map(lineInEnglish => {
      if (lineInEnglish === '') {
        linesInBraille = [...linesInBraille, lineInEnglish]
        linesInDot = [...linesInDot, lineInEnglish]
      } else {
        let lineInBraille = ''
        let lineInDot = ''
        lineInEnglish
          .toUpperCase()
          .split('')
          .forEach(char => {
            char = char.toUpperCase()
            lineInBraille += char === ' ' ? char : characterDict[char]['braille']
            lineInDot += char === ' ' ? char : characterDict[char]['dot']
          })
        linesInBraille = [...linesInBraille, lineInBraille]
        linesInDot = [...linesInDot, lineInDot]
      }
    })

    setBrailleText(linesInBraille.join('\n'))
    setDotText(linesInDot.join('\n'))

    const lastChar = value.charAt(value.length - 1)
    if (lastChar === ' ') {
      setTextToRead('space')
    } else if (lastChar === '\n') {
      setTextToRead('newline')
    } else {
      setTextToRead(lastChar)
    }
  }

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
        const cursorText = brailleMode ? characterDict[char.toUpperCase()]['dot'] : char
        setTextToRead(`${cursorText} beginning of the document`)
      } else if (start >= length) {
        setTextToRead('End of the document')
      } else {
        const char = text[start]
        console.log(135, char)
        const cursorText = brailleMode ? characterDict[char.toUpperCase()]['dot'] : char.trim()
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

  const handleKeyDown = e => {
    if (e.ctrlKey || e.metaKey) {
      if (e.code === 'Digit1') {
        e.preventDefault()
        handleCtrl1()
      } else if (e.code === 'Digit2') {
        handleCtrl2()
      } else if (e.code === 'Digit3') {
        handleCtrl3()
      }
    } else if (e.key === 'Tab') {
      console.log(57, e.key)
      e.preventDefault()
      focusNextElement()
    } else {
      handleArrowPress(e)
    }
  }

  const toggle = e => {
    e.preventDefault()
    setBrailleMode(!brailleMode)
  }
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keypress', handleKeyDown)
    return (() => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keypress', handleKeyDown)
    })
  },[])

  const handlePlay = e => {
    e.preventDefault()
    console.log('189')
    handleCtrl3()
  }

  useEffect(() => {
    if (brailleMode) {
      setTextToRead('You are in braille view mode')
    } else {
      setTextToRead('You are in text edit mode')
    }
  }, [brailleMode])

  useEffect(() => {
    msg.text = textToRead
    if (typeof window !== 'undefined') {
      if (msg.text) {
        speechSynthesis.speak(msg)
      }
    }
  }, [textToRead])

  return (
    <div style={{ justifyContent: `center`, height: `100vh`, width: `100%` }}>
      <div className='topBtns'>
        <Link href='/new'>
          <button className='navigationElement'> Add new document </button>
        </Link>
      </div>
      <ListDocsFromAppwriteDB />
    </div>
  )
}

export default Home
