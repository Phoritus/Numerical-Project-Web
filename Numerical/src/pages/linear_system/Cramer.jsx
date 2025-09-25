import React from 'react'
import NavbarMain from '../../components/Navbar'

const CramersRule = () => {
  return (
    <div className='text-white'>
      <NavbarMain />
      <div className='min-h-screen bg-gradient-to-b from-blue-900 to-black py-[90px]'>
        <div className='container mx-auto px-4'>
          <h1 className='text-4xl font-bold mb-6'>Cramer Rule</h1>
          <p className='text-gray-200'>This is the Cramer Rule page. Hook your solver UI here.</p>
        </div>
      </div>
    </div>
  )
}


export default CramersRule