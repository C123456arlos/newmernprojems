import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
      <div className='flex h-screen bg-iinear-to-br from-slate-50 via-white to-indigo-50/30'>
          <p>sidebar</p>
          <main className='flex-s overflow-y-auto'>
              <div className='p-4 pt-16 sm:p-6 sm:pt-6 lg:p-8 max-w-400 mx-auto'>
                  <Outlet></Outlet>
              </div>
      </main>
      </div>
  )
}

export default Layout