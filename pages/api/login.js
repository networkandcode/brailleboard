import { ID } from 'node-appwrite'
import sdk from 'node-appwrite'

const Login = (req, res) => {
    const user = req.body
    const { email, password, } = user
    console.log(7, user)
    // Init SDK
    const client = new sdk.Client()

    const users = new sdk.Users(client)

    client
        .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJ_ID) // Your project ID
        .setKey(process.env.APPWRITE_API_KEY) // Your secret API key
    
    const promise = users.createBcryptUser(ID.unique(), email, password)

    promise.then(function (response) {
        console.log(response)
        res.json(response)
    }, function (error) {
        console.log(error)
    })
}

export default Login