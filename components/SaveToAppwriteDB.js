import { useAuth } from '../hooks/useAuth'
import { useData } from '../hooks/useData'
import { useState } from 'react'
import speakText from '../lib/speakText'

const SaveToAppwriteDB = ({ docId, text }) => {
    const auth = useAuth()
    const { user, } = auth

    const data = useData()
    const { createDocument, updateDocument, } = data
    const [ id, setId ] = useState(docId)

    const handleSave = e => {
        e.preventDefault()
        if (text.trim()) {
            if (id) {
                updateDocument({ $id: id, text, })
            } else {
                const promise = createDocument({ text, }, user.$id)
                promise.then((newId) => {
                    setId(newId)
                })
            }
            speakText('Your document is saved')
        } else {
            speakText('Your document is empty')
        }
    }

    return (
        <button className='navigationElement' id='save' onClick={handleSave} style={{ fontSize: `20px` }}> Save </button>
    )
}

export default SaveToAppwriteDB