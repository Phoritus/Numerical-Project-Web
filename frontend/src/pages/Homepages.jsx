import NavbarMain from '../components/Navbar'
import Dropdown from '../components/all_dropdown/Dropdown'
import DropLinearSystem from '../components/all_dropdown/DropLinearSystem'

const Homepages = () => {
  return (
    <div className='text-white'>
      <NavbarMain />
      <div className='h-screen bg-gradient-to-b from-blue-900 to-black py-[90px]'>
        <h1 className='text-5xl font-bold mb-4'><span className='text-gradient'>Numerical</span> Methods</h1>

        <div className='flex flex-col items-center justify-center'>
          
          <div className='mt-4'>
            <Dropdown />
          </div>

          <div className='mt-4'>
            <DropLinearSystem />
          </div>
        </div>
      </div>

    </div>
  )
}

export default Homepages