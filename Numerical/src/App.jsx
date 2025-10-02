import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Homepages from './pages/Homepages.jsx'
import Bisection from './pages/root_of_equation/Bisection.jsx'
import Graphical from './pages/root_of_equation/Graphical.jsx'
import FalsePosition from './pages/root_of_equation/FalsePosition.jsx'
import OnePoint from './pages/root_of_equation/OnePoint.jsx'
import NewtonRaphson from './pages/root_of_equation/NewtonRaphson.jsx'
import Cramer from './pages/linear_system/Cramer.jsx'


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepages />} />
      <Route path="/root-of-equation/bisection" element={<Bisection />} />
      <Route path="/root-of-equation/graphical" element={<Graphical />} />
      <Route path="/root-of-equation/false-position" element={<FalsePosition />} />
      <Route path="/root-of-equation/one-point" element={<OnePoint />} />
      <Route path="/root-of-equation/newton-raphson" element={<NewtonRaphson />} />
      <Route path="/linear-system/cramer" element={<Cramer />} />
    </Routes>
  )
}

export default App