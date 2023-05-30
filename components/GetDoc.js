import 'TextBox'
import { Client, Databases, } from 'appwrite'
import { useEffect } from 'react'

const GetDoc = ({ id }) => {
    const [ doc, setDoc ] = useState()

    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject('6436436d3ff7ee65228b')

    const databases = new Databases(client)

    const getDoc = () => {
        const promise = databases.getDocument(
            '64749be89016073c0ecd', // db id
            '64749bf90162aa302c42', // coll id
            id, // doc id
        )
    
        promise.then(function (response) {
            console.log(response)
            setDoc(response)
        }, function (error) {
            console.log(error)
        })
    }

    useEffect(() => {
        getDoc()
    },[])

    return (
        <TextBox doc={doc} />
    )
}

export default GetDoc