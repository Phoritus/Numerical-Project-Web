import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Homepages from './pages/Homepages.jsx'
import Bisection from './pages/root_of_equation/Bisection.jsx'
import Cramer from './pages/linear_system/Cramer.jsx'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepages />} />
      <Route path="/root-of-equation/bisection" element={<Bisection />} />
      <Route path="/linear-system/cramer" element={<Cramer />} />
    </Routes>
  )
}

export default App