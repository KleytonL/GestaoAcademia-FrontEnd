import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home'
import Mensalidades from './pages/Mensalidades'
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Clientes from "./pages/Clientes"

function App() {
  return(
    <BrowserRouter>
      <Navbar/>
      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/clientes" element={<Clientes/>} />
          <Route path="/mensalidades" element={<Mensalidades/>} />
        </Routes>
      </main>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
