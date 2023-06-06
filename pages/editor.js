import SaveToAppwriteDB from '../components/SaveToAppwriteDB'
import { useData } from '../hooks/useData'
import characterDict from '../constants/characterDict'
import focusNextElement from '../lib/focusNextElement'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'

const Editor = () => {
  const [brailleMode, setBrailleMode] = useState(false)
  const [brailleText, setBrailleText] = useState('')
  const [docId, setDocId] = useState()
  const [dotText, setDotText] = useState('')
  const [text, setText] = useState('')
  const [textToRead, setTextToRead] = useState('')

  const data = useData()
  const router = useRouter()
  const textRef = useRef()
  const brailleTextRef = useRef()

  const { deleteDocument, docs, } = data

  const convToBraille = (value) => {
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

    return { linesInBraille, linesInDot }
  }

  const onChange = e => {
    e.preventDefault()
    const { value } = e.target

    setText(value)
    const { linesInBraille, linesInDot } = convToBraille(value)
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
        setTextToRead(`${cursorText !== 'undefined' ? cursorText : ''} beginning of the document`)
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

  const handleDelete = e => {
    e.preventDefault()
    alert('Press enter to confirm delete.')
    deleteDocument({ $id: router.query.id })
    setTextToRead('Document deleted. You are being redirected to home page.')
    router.push('/')
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

  const handlePlay = e => {
    e.preventDefault()
    handleCtrl3()
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
  }, [])

  useEffect(() => {
    const elements = typeof window !== 'undefined' && document.querySelectorAll('.navigationElement')

    console.log(174, elements.length, elements)
    // Assign a tabindex to each element
    elements.forEach((element, index) => {
      element.setAttribute('tabindex', index + 1)
    })

    return (() => {
      elements.forEach((element) => {
        element.removeAttribute('tabindex')
      })
    })
  }, [brailleMode])

  useEffect(() => {
    if (router) {
      const docId = router.query.id
      docs.forEach(doc => {
        if (doc.$id === docId) {
          setText(doc.text)
        }
      })
    }
  }, [docs, router])

  useEffect(() => {
    if (brailleMode) {
      brailleTextRef.current.focus()
      setTextToRead('You are in braille view mode')
    } else {
      textRef.current.focus()
      setTextToRead('You are in text edit mode')
    }
  }, [brailleMode])

  useEffect(() => {
    const msg = typeof window !== 'undefined' && new SpeechSynthesisUtterance()
    if (msg) {
      msg.rate = 0.8
    }
    msg.text = textToRead

    if (typeof window !== 'undefined') {
      if (msg.text) {
        speechSynthesis.cancel()
        speechSynthesis.speak(msg)
      }
    }
  }, [textToRead])

  useEffect(() => {
    const { linesInBraille, linesInDot } = convToBraille(text)
    setBrailleText(linesInBraille.join('\n'))
    setDotText(linesInDot.join('\n'))
  }, [text])

  return (
    <div>
      <div className='topBtns'>
        <Link href='/'>
          <button className='navigationElement'>
            Home
          </button>
        </Link>
        <button className='navigationElement' id='toggle' onClick={toggle} style={{ fontSize: `20px` }}> Toggle </button>
        <button className='navigationElement' id='play' onClick={handlePlay} style={{ fontSize: `20px` }}> Play </button>
        <SaveToAppwriteDB docId={router.query.id} text={text} />
        {router?.query?.id && <button className='navigationElement' id='delete' onClick={handleDelete} style={{ fontSize: `20px` }}> Delete </button>}
      </div>
      <div style={{ justifyContent: `center`, height: `100vh`, width: `100%` }} >
        <h2 className='navigationElement'> Text editor below: </h2>
        {brailleMode
          ? (
            <textarea
              className='navigationElement'
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
              className='navigationElement'
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

        <div className='navigationElement' name='keyboardShortcuts' style={{ paddingBottom: `10px` }}>
          Keyboard shortcuts:
          When you are in the textbox, press Ctrl 1 for Text edit mode, Ctrl 2 for Braille view mode, Ctrl 3 to speak text
        </div>

      </div>
    </div>
  )
}

export default Editor
