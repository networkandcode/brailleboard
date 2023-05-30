import SaveToAppwriteDB from '../../components/SaveToAppwriteDB'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'

const Home = () => {
  const router = useRouter()
  const msg = typeof window !== 'undefined' && new SpeechSynthesisUtterance()
  if (msg) {
    msg.rate = 0.8
  }

  const [ brailleText, setBrailleText ] = useState('')
  const [ dotText, setDotText ] = useState('')
  const [text, setText] = useState('')
  const [ textToRead, setTextToRead ] = useState('')

  const textRef = useRef()
  const brailleTextRef = useRef()

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
        linesInBraille = [ ...linesInBraille, lineInEnglish ]
        linesInDot = [ ...linesInDot, lineInEnglish ]
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
        linesInBraille = [ ...linesInBraille, lineInBraille ]
        linesInDot = [ ...linesInDot, lineInDot ]
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

 

  const handlePlay = e => {
    e.preventDefault()
    console.log('189')
    handleCtrl3()
  }

  useEffect(() => {
   
  })

  useEffect(() => {
    document.addEventListener('keypress', handleKeyDown)
    return(() => {
      document.removeEventListener('keypress', handleKeyDown)
    })
  })

  

  useEffect(() => {
    msg.text = textToRead
    if (typeof window !== 'undefined') {
      if(msg.text) {
        speechSynthesis.speak(msg)
      }
    }
  }, [ textToRead ])

  return (
    <div>
      <div className='topBtns'>
        <Link href='/'>
          <button>
            List
          </button>
        </Link>
        <button id='toggle' onClick={toggle} style={{ fontSize: `20px` }}> Toggle </button>
        <button id='play' onClick={handlePlay} style={{ fontSize: `20px` }}> Play </button>
        <SaveToAppwriteDB routeId={router.query.id} text={text}/>
      </div>
      <div style={{ justifyContent: `center`, height: `100vh`, width: `100%` }} >
        <h2> Edit document: </h2>
        { brailleMode 
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
    </div>
  )
}

export default Home