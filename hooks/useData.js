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

    const deleteDocument = (docToBeDeleted) => {
        const promise = databases.deleteDocument('64749be89016073c0ecd', '64749bf90162aa302c42', docToBeDeleted.$id)
    
        promise.then(function (response) {
            console.log(response) // Success
            let temp = docs
            temp.forEach((doc, idx) => {
                if(doc.$id === docToBeDeleted.$id)
                temp.splice(idx, 1)
            })
            setDocs(temp)
        }, function (error) {
            console.log(error) // Failure
        })
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
        deleteDocument,
        updateDocumentLocally,
    }
}

export const DataProvider = ({ children }) => {
    const data = useDataProvider()
    return <Provider value={data}> {children} </Provider>
}
