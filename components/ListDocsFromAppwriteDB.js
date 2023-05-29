import { Client, Databases } from "appwrite"

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6436436d3ff7ee65228b')

const databases = new Databases(client)

const ListDocsFromAppwriteDB = () => {
    const listDocuments = () => {
        const promise = databases.listDocuments('64749be89016073c0ecd', '64749bf90162aa302c42')
    
        promise.then(function (response) {
            console.log(response) // Success
        }, function (error) {
            console.log(error) // Failure
        })
    }

    useEffect(() => {
        listDocuments()
    },[])
    
    return (
        <></>
    )
}

export default ListDocsFromAppwriteDB