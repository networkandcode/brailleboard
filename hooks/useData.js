import { Client, Databases, ID, Permission, Role, } from 'appwrite'
import { createContext, useContext, useEffect, useState, } from 'react'

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJ_ID)

const databases = new Databases(client)

const DataContext = createContext()
const { Provider } = DataContext
export const useData = () => useContext(DataContext)

const useDataProvider = () => {
    const [ docs, setDocs ] = useState([])

    const listDocuments = () => {
        const promise = databases.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DB_ID, process.env.NEXT_PUBLIC_APPWRITE_COLL_ID)
    
        promise.then(function (response) {
            setDocs(response.documents)
        }, function (error) {
            console.log(error) // Failure
        })
    }

    const createDocument = async(docToBeAdded, userId) => {
        const { text } = docToBeAdded
        const newDoc = await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DB_ID,
            process.env.NEXT_PUBLIC_APPWRITE_COLL_ID,
            ID.unique(),
            { text },
            [
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId))
            ]
        )
        setDocs([ ...docs, newDoc ])
        return newDoc.$id
    }

    const deleteDocument = (docToBeDeleted) => {
        const promise = databases.deleteDocument(process.env.NEXT_PUBLIC_APPWRITE_DB_ID, process.env.NEXT_PUBLIC_APPWRITE_COLL_ID, docToBeDeleted.$id)
    
        promise.then(() => {
            let temp = docs
            temp.forEach((doc, idx) => {
                if(doc.$id === docToBeDeleted.$id)
                temp.splice(idx, 1)
            })
            setDocs([ ...temp ])
        }, (err) => {
            console.log(err)
        })
    }

    const updateDocument = (docToBeModified) => {
        const { $id, text } = docToBeModified

        const promise = databases.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DB_ID,
            process.env.NEXT_PUBLIC_APPWRITE_COLL_ID,
            $id,
            { text },
        )
    
        promise.then(function (response) {
            let temp = docs
            docs.forEach( (doc, idx) => {
                if (doc.$id === docToBeModified.$id) {
                    temp[idx] = response
                }
            })
            setDocs(temp)
        }, function (error) {
            console.log(error)
        })
    }

    useEffect(() => {
        listDocuments()
    },[])

    return {
        createDocument,
        docs,
        deleteDocument,
        updateDocument,
    }
}

export const DataProvider = ({ children }) => {
    const data = useDataProvider()
    return <Provider value={data}> {children} </Provider>
}
