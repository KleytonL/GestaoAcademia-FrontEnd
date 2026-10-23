import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Home from './pages/Home'
import Planos from './pages/Plano'
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Usuario from "./pages/Usuario"
import Fichas from "./pages/Ficha"

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" containerClassName="toast-container" />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/usuarios" element={<Usuario />} />
          <Route path="/planos" element={<Planos />} />
          <Route path="/fichas" element={<Fichas />} />
          <Route path="*" element={<h1>Página não encontrada</h1>} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
