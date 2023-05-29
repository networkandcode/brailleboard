import { Client, Databases, ID } from 'appwrite'
import { useState } from 'react'

const AppwriteDB = ({ text }) => {
    const [ id, setId ] = useState()

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
            console.log(response)
            setId(response.$id)
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
            console.log(response)
        }, function (error) {
            console.log(error)
        })
    }

    const handleSave = e => {
        e.preventDefault()
        console.log(text)
        if (id) {
            updateDocument()
        } else {
            createDocument()
        }
    } 

    return (
        <button id='save' onClick={handleSave} style={{ fontSize: `20px` }}> Save </button>
    )
}

export default AppwriteDB