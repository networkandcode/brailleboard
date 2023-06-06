import ListDocsFromAppwriteDB from '../components/ListDocsFromAppwriteDB'
import { useAuth } from '../hooks/useAuth'
import focusNextElement from '../lib/focusNextElement'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState, } from 'react'

const Home = () => {
  const auth = useAuth()
  const { deleteSession, user, } = auth

  const router = useRouter()

  const handleKeyDown = e => {
    if (e.key === 'Tab') {
      console.log(57, e.key)
      e.preventDefault()
      focusNextElement()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keypress', handleKeyDown)
    return (() => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keypress', handleKeyDown)
    })
  },[])

  useEffect(() => {
    console.log(user)
    if (!user?.$id) {
      console.log('Redirecting to login...')
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
