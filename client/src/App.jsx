import { Routes, Route } from 'react-router-dom'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Collections from './components/Collections'
import Footer from './components/Footer'
import Work from './components/Work'
import Dashboard from './dashboard/Dashboard'

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Collections />
      <Footer />
    </>
  )
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <CustomCursor />
    </>
  )
}

export default App
