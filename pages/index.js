import { useEffect, useState, useRef } from "react"

const Home = () => {
  const msg = typeof window !== 'undefined' && new SpeechSynthesisUtterance()

  const [ brailleMode, setBrailleMode ] = useState(false)
  const [ brailleText, setBrailleText ] = useState('')
  const [text, setText] = useState('')
  const [ textToRead, setTextToRead ] = useState('')

  const textareaRef = useRef()

  const onChange = e => {
    e.preventDefault()
    const { value } = e.target
    
    setText(value)

    let linesInBraille = []

    value.split('\n').map(lineInEnglish => {
      if (lineInEnglish === '') {
        linesInBraille = [ ...linesInBraille, lineInEnglish ]
      } else {
        const lineInBraille = lineInEnglish
          .toUpperCase()
          .split('')
          // https://stackoverflow.com/questions/69756010/convert-string-to-braille
          .map(char => "⠀⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿"[" A1B'K2L@CIF/MSP\"E3H9O6R^DJG>NTQ,*5<-U8V.%[$+X!&;:4\\0Z7(_?W]#Y)=".indexOf(char)]).join("")
          linesInBraille = [ ...linesInBraille, lineInBraille ]
      }
    })

    setBrailleText(linesInBraille.join('\n'))

    const lastChar = value.charAt(value.length - 1)
    if (lastChar === ' ') {
      setTextToRead('space')
    } else if (lastChar === '\n') {
      setTextToRead('newline')
    } else {
      setTextToRead(lastChar)
    }
  }

  const onKeyDown = e => {
    const { value } = e.target
    if (e.shiftKey, e.key === 'T') {
      e.preventDefault()
      setBrailleMode(!brailleMode)
    } else if (e.code.includes('Arrow')) {
      const length = value.length
      let start = e.target.selectionStart
     
      if (e.code === 'ArrowLeft') {
        start = start - 1
      } else if (e.code === 'ArrowRight') {
        start = start + 1
      }

      console.log(start, length)
      
      if (start <= 0) {
        setTextToRead(`${value[0]}, beginning of the document`)
      } else if (start >= length) {
        setTextToRead('End of the document')
      } else {
        setTextToRead(value[start])
      }
    } else if (e.ctrlKey) {
      if (e.code === 'KeyA') {
        setTextToRead(value)
      }
    }
  }

  const onSelect = e => {
    e.preventDefault()
    if (typeof window !== 'undefined') {
      setTextToRead(window.getSelection().toString())
    }
  }

  const toggle = e => {
    e.preventDefault()
    setBrailleMode(!brailleMode)
  }

  useEffect(() => {
    textareaRef.current.focus()
  },[])

  useEffect(() => {
    msg.text = textToRead
    if (typeof window !== 'undefined') {
      if(msg.text) {
        speechSynthesis.speak(msg)
      }
    }
  }, [ textToRead ])

  return (
    <div style={{ height: `100vh`, width: `100%` }}>
      <h1>Braille Board</h1>
      <button id='toggle' onClick={toggle}> Toggle </button>
      { brailleMode 
        ? (
          <textarea
            id='brailleText'
            name='brailleText'
            placeholder='View in Braille'
            readOnly
            style={{ fontSize: `50px`, height: `100%`, lineHeight: `1`, overflow: `hidden`, width: `100%` }}
            value={brailleText}
          />
        ) : ( 
          <textarea
            id='text'
            onChange={onChange}
            onKeyDown={onKeyDown}
            name='text'
            placeholder='Type in English'
            ref={textareaRef}
            style={{ fontSize: `50px`, height: `100%`, lineHeight: `1`, overflow: `hidden`, width: `100%` }}
            value={text}
          />
        )
      }
    </div>
  )
}

export default Home
