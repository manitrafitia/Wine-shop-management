import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Intro from './components/Intro'
import Bilan from './components/Bilan'
import VinPopulaires from './components/VinPopulaires'
import About from './components/About'
import Contact from './components/Contact'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="dark:bg-black">
    <Navbar></Navbar>
      <Intro></Intro>
      <Bilan></Bilan>
      <VinPopulaires></VinPopulaires>
      <About></About>
      <Contact></Contact>
    </div>
    </>
  )
}

export default App
