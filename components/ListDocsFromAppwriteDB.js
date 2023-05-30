import { useData } from '../hooks/useData'
import Link from 'next/link'

const ListDocsFromAppwriteDB = () => {
    const data = useData()
    const { docs } = data

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
    
    return (
        <>
            <h2> List of saved documents: </h2>
            <div style={{ display: `flex`, flexWrap: `wrap`, gap:`5px` }} >
                { docs ? docs.map(doc => (
                    <Link href={`/new/?id=${doc.$id}`} key={doc.$id} style={{ color: `inherit`, textDecoration: `none` }}>
                        <div style={{ border: `1px solid white`, flex: `200px`, padding: `5px` }}>
                            <p> { doc.text.slice(0, 100) } </p>
                            <p> Last saved on { formatDate(doc.$updatedAt) } </p>
                        </div>
                    </Link>
                )) : <p style={{ color: `white` }}> Loading... </p> }
            </div>
        </>
    )
}

export default ListDocsFromAppwriteDB