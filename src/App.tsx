import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home'
import Alunos from './pages/Alunos'
import Mensalidades from './pages/Mensalidades'
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

function App() {
  return(
    <BrowserRouter>
      <Navbar/>
      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/alunos" element={<Alunos/>} />
          <Route path="/mensalidades" element={<Mensalidades/>} />
        </Routes>
      </main>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
