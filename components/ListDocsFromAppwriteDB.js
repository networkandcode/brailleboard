import { Client, Databases } from 'appwrite'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6436436d3ff7ee65228b')

const databases = new Databases(client)

const ListDocsFromAppwriteDB = () => {
    const [ docs, setDocs ] = useState([])

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            // local time zone
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          }
        
          const utcDate = new Date(dateString)
          const localDate = utcDate.toLocaleString('en-US', options)
          return localDate
    }

    const listDocuments = () => {
        const promise = databases.listDocuments('64749be89016073c0ecd', '64749bf90162aa302c42')
    
        promise.then(function (response) {
            console.log(response) // Success
            setDocs(response.documents)
        }, function (error) {
            console.log(error) // Failure
        })
    }

    useEffect(() => {
        listDocuments()
    },[])
    
    return (
        <>
            <h2> List of saved documents: </h2>
            <div style={{ display: `flex`, flexWrap: `wrap`, gap:`5px` }} >
                { docs.map(doc => (
                    <Link href={`/edit/${doc.$id}`} key={doc.$id} style={{ color: `inherit`, textDecoration: `none` }}>
                        <div style={{ border: `1px solid white`, flex: `200px`, padding: `5px` }}>
                            <p> { doc.text.slice(0, 100) } </p>
                            <p> Last saved on { formatDate(doc.$updatedAt) } </p>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    )
}

export default ListDocsFromAppwriteDB