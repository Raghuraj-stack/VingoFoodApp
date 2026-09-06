import React from 'react'

function CategoryCard({name , image }) {
  return (
    <div className='w-30 h-30 md:w-40 rounded-2xl border-2 border-[#ff4d2d] shrink-0 overflow-hidden bg-white shadow-xl  shadow-gray-200 hover:shadow-lg transition-shadow relative'>
     <img src={image} alt="Image" className=' w-full h-full object-cover transform hover:scale-110 transition-transform duration-300'/>
     <div className='absolute bottom-0 left-0 w-full bg-[#ffffff96] bg-opacity-95 shadow text-center rounded-t-md font-medium text-gray-800 backdrop-blur px-3 '>
        {name}
     </div>
    </div>
  )
}

export default CategoryCard
