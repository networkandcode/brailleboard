import SaveToAppwriteDB from '../components/SaveToAppwriteDB'
import { useData } from '../hooks/useData'
import characterDict from '../constants/characterDict'
import handleKeyDown from '../lib/handleKeyDown'
import speakText from '../lib/speakText'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'

const Editor = () => {
  const [brailleMode, setBrailleMode] = useState(false)
  const [brailleText, setBrailleText] = useState('')
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
    speakText('Press enter to confirm delete.')
    alert('Press enter to confirm delete.')
    deleteDocument({ $id: router.query.id })
    speakText('Document deleted. You are being redirected to home page.')
    router.push('/')
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
    const elements = document.querySelectorAll('.navigationElement')

    // Assign a tabindex to each element
    elements.forEach((element, index) => {
        element.setAttribute('tabindex', index + 1)
    })

    return (() => {
        elements.forEach((element) => {
            element.removeAttribute('tabindex')
        })
    })
}, [])

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
      setTextToRead('You are in braille view mode')
    } else {
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
    <div style={{ justifyContent: `center`, height: `100vh`, width: `100%` }}>
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
        <h2 className='navigationElement' description='Text editor label'> Text editor: </h2>
        {brailleMode
          ? (
            <textarea
              className='navigationElement'
              description='Braille text box'
              id='brailleText'
              maxlength="1000"
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
              description='English text box'
              id='text'
              onChange={onChange}
              onKeyDown={handleKeyDown}
              maxlength="1000"
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

export default Editor
