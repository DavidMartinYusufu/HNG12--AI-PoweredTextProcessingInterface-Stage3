import { useState } from 'react'
import './App.css'
import Home from './components/Home'

function App() {
  const [count, setCount] = useState(0)

  function run() {
    if ('ai' in self && 'translator' in self.ai) {
      
      console.log('// The Translator API is supported.')
    }else {
      console.log('not supported')
    }
  }

  if ('ai' in self && 'translator' in self.ai) {
    // The Translator API is supported.
  }

  return (
    <>
      <Home/>
    </>
  )
}

export default App
