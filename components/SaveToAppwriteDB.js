import { useData } from '../hooks/useData'
import { Client, Databases, ID } from 'appwrite'
import { useEffect, useState } from 'react'

const AppwriteDB = ({ docId, text }) => {
    const data = useData()
    const { createDocumentLocally, updateDocumentLocally } = data
    const [ id, setId ] = useState(docId)

    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject('6436436d3ff7ee65228b')

    const databases = new Databases(client)

    const createDocument = () => {
        const promise = databases.createDocument(
            '64749be89016073c0ecd', // db id
            '64749bf90162aa302c42', // coll id
            ID.unique(),
            { text },
        )
    
        promise.then(function (response) {
            setId(response.$id)
            createDocumentLocally(response)
        }, function (error) {
            console.log(error)
        })
    }

    const updateDocument = () => {
        const promise = databases.updateDocument(
            '64749be89016073c0ecd', // db id
            '64749bf90162aa302c42', // coll id
            id,
            { text },
        )
    
        promise.then(function (response) {
            updateDocumentLocally(response)
        }, function (error) {
            console.log(error)
        })
    }

    const handleSave = e => {
        e.preventDefault()
        if (id) {
            updateDocument()
        } else {
            createDocument()
        }
        const msg = typeof window !== 'undefined' && new SpeechSynthesisUtterance()
    
        if (msg) {
            msg.rate = 0.8
        }

        msg.text = 'Your document is saved'
        speechSynthesis.speak(msg)
    } 

    useEffect(() => {

    }, [id, text])

    return (
        <button className='navigationElement' id='save' onClick={handleSave} style={{ fontSize: `20px` }}> Save </button>
    )
}

export default AppwriteDB