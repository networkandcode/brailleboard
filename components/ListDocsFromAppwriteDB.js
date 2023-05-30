import { useEffect, useState } from 'react'
import { useData } from '../hooks/useData'
import Link from 'next/link'
import { useRouter } from 'next/router'

const ListDocsFromAppwriteDB = () => {
    const data = useData()
    const router = useRouter()
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

    useEffect(() => {
        setDocs(data.docs)
    }, [ router, data ])
    
    return (
        docs.length > 0 ? (
            <>
                <h2 className='navigationElement'> List of saved documents: </h2>
                <div style={{ display: `flex`, flexWrap: `wrap`, gap:`5px` }} >
                    { docs.map(doc => (
                        <Link href={`/new/?id=${doc.$id}`} key={doc.$id} style={{ color: `inherit`, textDecoration: `none` }}>
                            <div style={{ border: `1px solid white`, flex: `200px`, padding: `5px` }}>
                                <p> { doc.text.slice(0, 100) } </p>
                                <p> Last saved on { formatDate(doc.$updatedAt) } </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </>
        ) : <h2 className='navigationElement    '> There are no documents presently </h2>
    )
}

export default ListDocsFromAppwriteDB