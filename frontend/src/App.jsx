import './index.css'
import { Routes, Route } from 'react-router-dom'
import Homepages from './pages/Homepages.jsx'
import Bisection from './pages/root_of_equation/Bisection.jsx'
import Graphical from './pages/root_of_equation/Graphical.jsx'
import FalsePosition from './pages/root_of_equation/FalsePosition.jsx'
import OnePoint from './pages/root_of_equation/OnePoint.jsx'
import NewtonRaphson from './pages/root_of_equation/NewtonRaphson.jsx'
import Secant from './pages/root_of_equation/Secant.jsx'
import Cramer from './pages/linear_system/Cramer.jsx'
import GaussElimination from './pages/linear_system/GaussElimination.jsx'
import GaussJordan from './pages/linear_system/GaussJordan.jsx'
import MatrixInversion from './pages/linear_system/MatrixInversion.jsx'
import LUDecompostionPage from './pages/linear_system/LUDecompostion.jsx'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepages />} />
      <Route path="/root-of-equation/bisection" element={<Bisection />} />
      <Route path="/root-of-equation/graphical" element={<Graphical />} />
      <Route path="/root-of-equation/false-position" element={<FalsePosition />} />
      <Route path="/root-of-equation/one-point" element={<OnePoint />} />
      <Route path="/root-of-equation/newton-raphson" element={<NewtonRaphson />} />
      <Route path="/root-of-equation/secant" element={<Secant />} />
      <Route path="/linear-system/cramer" element={<Cramer />} />
      <Route path="/linear-system/gauss-elimination" element={<GaussElimination />} />
      <Route path="/linear-system/gauss-jordan" element={<GaussJordan />} />
      <Route path="/linear-system/matrix-inversion" element={<MatrixInversion />} />
      <Route path="/linear-system/lu-decomposition" element={<LUDecompostionPage />} />
    </Routes>
  )
}

export default App