import React from 'react'
import { LoaderIcon } from 'react-hot-toast'

const PageLoader = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-800'>
        <LoaderIcon className='text-white animate-spin size-10 text-primary'/>
    </div>
  )
}

export default PageLoader