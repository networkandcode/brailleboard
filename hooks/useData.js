import { Client, Databases, } from 'appwrite'
import { createContext, useContext, useEffect, useState, } from 'react'

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6436436d3ff7ee65228b')

const databases = new Databases(client)

const DataContext = createContext()
const { Provider } = DataContext
export const useData = () => useContext(DataContext)

const useDataProvider = () => {
    const [ docs, setDocs ] = useState([])

    const listDocuments = () => {
        const promise = databases.listDocuments('64749be89016073c0ecd', '64749bf90162aa302c42')
    
        promise.then(function (response) {
            console.log(response) // Success
            setDocs(response.documents)
        }, function (error) {
            console.log(error) // Failure
        })
    }

    const createDocumentLocally = (docToBeAdded) => {
        setDocs([ ...docs, docToBeAdded ])
    }

    const updateDocumentLocally = (docToBeModified) => {
        let temp = docs
        docs.forEach( (doc, idx) => {
            if (doc.$id === docToBeModified.$id) {
                temp[idx] = docToBeModified
            }
        })
        setDocs(temp)
    }

    useEffect(() => {
        listDocuments()
    },[])

    return {
        createDocumentLocally,
        docs,
        updateDocumentLocally,
    }
}

export const DataProvider = ({ children }) => {
    const data = useDataProvider()
    return <Provider value={data}> {children} </Provider>
}
