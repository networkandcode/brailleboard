import { useEffect, useState, } from 'react'
import { useAuth, } from '../hooks/useAuth'
import { useData, } from '../hooks/useData'
import Link from 'next/link'
import { useRouter, } from 'next/router'

const ListDocsFromAppwriteDB = () => {
    const auth = useAuth()
    const { session } = auth

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

    const handleEnter = e => {
        if (e.key === 'Enter') {
            e.preventDefault()
            e.target.click()
        }
    }

    useEffect(() => {
        setDocs(data.docs)
    }, [ data, router, session, ])

    useEffect(() => {
        const elements = typeof window !== 'undefined' && document.querySelectorAll('.navigationElement')
        
        // Assign a tabindex to each element
        elements.forEach((element, index) => {
            element.setAttribute('tabindex', index + 1)
        })

        return (() => {
            elements.forEach((element, index) => {
                element.removeAttribute('tabindex')
            })
        })
      },[ docs ])
    
    return (
        docs.length > 0 ? (
            <>
                <h2 className='navigationElement'> List of saved documents: </h2>
                <div onKeyDown={handleEnter} style={{ display: `flex`, flexWrap: `wrap`, gap:`5px` }} >
                    { docs.map(doc => (
                        <Link href={`/editor/?id=${doc.$id}`} key={doc.$id} style={{ color: `inherit`, textDecoration: `none` }}>
                            <div className='navigationElement' style={{ border: `1px solid white`, padding: `5px` }}>
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