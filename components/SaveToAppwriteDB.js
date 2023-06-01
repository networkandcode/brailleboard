import { useData } from '../hooks/useData'
import { useState } from 'react'

const SaveToAppwriteDB = ({ docId, text }) => {
    const data = useData()
    const { createDocument, updateDocument, } = data
    const [ id, setId ] = useState(docId)

    const handleSave = e => {
        e.preventDefault()
        if (id) {
            updateDocument({ $id: id, text, })
        } else {
            const promise = createDocument({ text, })
            promise.then((newId) => {
                setId(newId)
            })
        }
        const msg = typeof window !== 'undefined' && new SpeechSynthesisUtterance()
    
        if (msg) {
            msg.rate = 0.8
        }

        msg.text = 'Your document is saved'
        speechSynthesis.cancel()
        speechSynthesis.speak(msg)
    }

    return (
        <button className='navigationElement' id='save' onClick={handleSave} style={{ fontSize: `20px` }}> Save </button>
    )
}

export default SaveToAppwriteDB