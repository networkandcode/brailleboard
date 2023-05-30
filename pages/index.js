import ListDocsFromAppwriteDB from '../components/ListDocsFromAppwriteDB'
import SaveToAppwriteDB from '../components/SaveToAppwriteDB'
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

  // generated with chatgpt
  const character_dict = {
    A: { dot: 'dot 1', braille: '⠁' },
    B: { dot: 'dot 1 2', braille: '⠃' },
    C: { dot: 'dot 1 4', braille: '⠉' },
    D: { dot: 'dot 1 4 5', braille: '⠙' },
    E: { dot: 'dot 1 5', braille: '⠑' },
    F: { dot: 'dot 1 2 4', braille: '⠋' },
    G: { dot: 'dot 1 2 4 5', braille: '⠛' },
    H: { dot: 'dot 1 2 5', braille: '⠓' },
    I: { dot: 'dot 2 4', braille: '⠊' },
    J: { dot: 'dot 2 4 5', braille: '⠚' },
    K: { dot: 'dot 1 3', braille: '⠅' },
    L: { dot: 'dot 1 2 3', braille: '⠇' },
    M: { dot: 'dot 1 3 4', braille: '⠍' },
    N: { dot: 'dot 1 3 4 5', braille: '⠝' },
    O: { dot: 'dot 1 3 5', braille: '⠕' },
    P: { dot: 'dot 1 2 3 4', braille: '⠏' },
    Q: { dot: 'dot 1 2 3 4 5', braille: '⠟' },
    R: { dot: 'dot 1 2 3 5', braille: '⠗' },
    S: { dot: 'dot 2 3 4', braille: '⠎' },
    T: { dot: 'dot 2 3 4 5', braille: '⠞' },
    U: { dot: 'dot 1 3 6', braille: '⠥' },
    V: { dot: 'dot 1 2 3 6', braille: '⠧' },
    W: { dot: 'dot 2 4 5 6', braille: '⠺' },
    X: { dot: 'dot 1 3 4 6', braille: '⠭' },
    Y: { dot: 'dot 1 3 4 5 6', braille: '⠽' },
    Z: { dot: 'dot 1 3 5 6', braille: '⠵' },
    '0': { dot: 'dot 2 4 5 5', braille: '⠼⠚' },
    '1': { dot: 'dot 1', braille: '⠼⠁' },
    '2': { dot: 'dot 1 2', braille: '⠼⠃' },
    '3': { dot: 'dot 1 4', braille: '⠼⠉' },
    '4': { dot: 'dot 1 4 5', braille: '⠼⠙' },
    '5': { dot: 'dot 1 5', braille: '⠼⠑' },
    '6': { dot: 'dot 1 2 4', braille: '⠼⠋' },
    '7': { dot: 'dot 1 2 4 5', braille: '⠼⠛' },
    '8': { dot: 'dot 1 2 5', braille: '⠼⠓' },
    '9': { dot: 'dot 2 4 5 5', braille: '⠼⠚' },
    '.': { dot: 'dot 3 4 6', braille: '⠲' },
    ',': { dot: 'dot 3', braille: '⠂' },
    '?': { dot: 'dot 2 3 6', braille: '⠢' },
    '!': { dot: 'dot 1 2 3 5 6', braille: '⠖' },
    "'": { dot: 'dot 2', braille: '⠄' },
    '"': { dot: 'dot 2 3 5 6', braille: '⠶' },
    '-': { dot: 'dot 2 5 6', braille: '⠤' },
    '(': { dot: 'dot 2 3 6 6', braille: '⠐⠣' },
    ')': { dot: 'dot 2 3 6 5 6', braille: '⠐⠜' },
    '/': { dot: 'dot 1 2 4 6', braille: '⠌' },
    '+': { dot: 'dot 1 2 3 5 6', braille: '⠖' },
    '=': { dot: 'dot 2 3 5 6 6', braille: '⠐⠶' },
    '#': { dot: 'dot 3 4 6 6', braille: '⠼⠲' },
    '@': { dot: 'dot 2 3 6 5 6', braille: '⠜⠜' },
    ';': { dot: 'dot 2 3 6', braille: '⠆' },
  };

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
            lineInBraille += char === ' ' ? char : character_dict[char]['braille']
            lineInDot += char === ' ' ? char : character_dict[char]['dot']
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

  const handleKeyDown = e => {
    if (e.ctrlKey || e.metaKey) {
      if (e.code === 'Digit1') {
        handleCtrl1()
      } else if (e.code === 'Digit2') {
        handleCtrl2()
      } else if (e.code === 'Digit3') {
        handleCtrl3()
      }
    } else {
      handleArrowPress(e)
    }
  }

  const toggle = e => {
    e.preventDefault()
    setBrailleMode(!brailleMode)
  }

  useEffect(() => {
    document.addEventListener('keypress', handleKeyDown)
    return (() => {
      document.removeEventListener('keypress', handleKeyDown)
    })
  })

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
          <button> New </button>
        </Link>
      </div>
      <ListDocsFromAppwriteDB />
    </div>
  )
}

export default Home
