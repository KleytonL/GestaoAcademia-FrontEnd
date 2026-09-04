import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home'
import Planos from './pages/Plano'
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Usuario from "./pages/Usuario"

function App() {
  return(
    <BrowserRouter>
      <Navbar/>
      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/usuarios" element={<Usuario/>} />
          <Route path="/planos" element={<Planos/>} />
        </Routes>
      </main>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
