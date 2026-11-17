import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Home from './pages/Home'
import Planos from './pages/Plano'
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Layout from "./components/Layout"
import Usuario from "./pages/Usuario"
import Fichas from "./pages/Ficha"
import Login from "./pages/Login"
import Cadastro from "./pages/Cadastro"
import ControlarPlano from "./pages/ControlarPlano"
import Dashboard from "./pages/Dashboard"

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" containerClassName="toast-container" />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios" element={<Usuario />} />
            <Route path="/planos" element={<Planos />} />
            <Route path="/fichas" element={<Fichas />} />
            <Route path="/meu-plano" element={<ControlarPlano />} />
            <Route path="*" element={<h1>Página não encontrada</h1>} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App