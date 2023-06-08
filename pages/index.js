import ListDocsFromAppwriteDB from '../components/ListDocsFromAppwriteDB'
import { useAuth } from '../hooks/useAuth'
import handleKeyDown from '../lib/handleKeyDown'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState, } from 'react'

const Home = () => {
  const auth = useAuth()
  const { deleteSession, user, } = auth

  const router = useRouter()

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keypress', handleKeyDown)
    return (() => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keypress', handleKeyDown)
    })
  },[])

  useEffect(() => {
    if (!user?.$id) {
      router.push('/login')
    }
  }, [ router, user ])

  return (
    <div style={{ justifyContent: `center`, height: `100vh`, width: `100%` }}>
      <div className='topBtns'>
        <Link href='/editor'>
          <button className='navigationElement'> Add new document </button>
        </Link>
        <button className='navigationElement' onClick={e => { e.preventDefault(); deleteSession() }}> Logout </button>
      </div>
      <ListDocsFromAppwriteDB />
    </div>
  )
}

export default Home
