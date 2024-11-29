'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, Layers } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

const links = [
  { title: 'Create Role', link: '/JD-Create' },
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Configure Assessment', link: '/assessment' }
]

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className='sticky top-0 z-50 bg-white shadow-md'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center py-4'>
          {/* Logo Section */}
          <Link href="/" className='flex items-center'>
            <Layers className='mr-2 h-6 w-6 text-gray-700' />
            <span className='font-bold text-2xl text-gray-800'>Wolf-Pack</span>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-4'>
            {links.map((link) => (
              <Link 
                key={link.link} 
                href={link.link} 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                  pathname === link.link 
                    ? 'bg-gray-700 text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                {link.title}
              </Link>
            ))}
            
            {/* Search and Action Buttons */}
            {/* <div className='flex items-center space-x-2'>
              <Button variant="ghost" size="icon" className='text-gray-600 hover:text-gray-800'>
                <Search className='h-5 w-5' />
              </Button>
            </div> */}
          </div>

          {/* Mobile Menu Toggle */}
          <div className='md:hidden'>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu}
              className='text-gray-600 hover:text-gray-800'
            >
              <Menu className='h-6 w-6' />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden bg-white shadow-lg'>
            <div className='px-2 pt-2 pb-3 space-y-1'>
              {links.map((link) => (
                <Link 
                  key={link.link} 
                  href={link.link} 
                  onClick={toggleMobileMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === link.link 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
// "use client"
// import React from 'react'
// import Link from 'next/link'
// import { Menu, Search } from 'lucide-react'
// import { usePathname } from 'next/navigation'
// const links = [
//   {
//     'title': 'Create role',
//     'link': '/JD-Create'
//   },
//   {
//     'title': 'Dashboard',
//     'link': '/dashboard'
//   },
//   {
//     'title':'Configure Assessment',
//     'link':'/assessment'
//   }
// ]
 
// const Navbar = () => {
//   const [state, setState] = React.useState(false)
//   const pathname = usePathname()
//   return (
//     <nav className="bg-[#151a1f] w-full">
//       <div className="items-center  max-w-screen-xl  md:flex ">
//         <div className="flex items-center justify-between py-3 md:py-5 md:block">
//           <Link href="/">
//             <h1 className="text-3xl font-bold pl-5 text-white">Wolf-Pack</h1>
//           </Link>
//           <div className="md:hidden">
//             <button 
//               className="text-gray-700 outline-none bg-white p-2 rounded-md focus:border-gray-400 focus:border"
//               onClick={() => setState(!state)}

//             >
//               <Menu />
//             </button>
//           </div>
//         </div>
//         <div
//           className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
//             state ? "block" : "hidden"
//           }`}
//         >
//           <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
//             {links.map((link, idx) => (
//               <li key={idx} className="text-gray-600 hover:text-indigo-600">
//                 <Link href={`${link.link}`} key={link.link} className={`hover:text-[#5483b5] ${pathname === link.link? 'text-[#f9fafb] font-bold' : 'text-blue-200' }`}>
// {link.title}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   )
// }
 
// export default Navbar


// 'use client'
// import React from 'react'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'

// const links = [
//   {
//     'title': 'Create role',
//     'link': '/JD-Create'
//   },
//   {
//     'title': 'Dashboard',
//     'link': '/dashboard'
//   },
//   {
//     'title':'Design Assessment',
//     'link':'/assessment'
//   }
// ]

// const Navbar = () => {
//   const pathname = usePathname()
//   return (
//     <div className='min-h-10 flex items-center bg-[#5aabab]'>
//       <div className='w-full flex justify-between'>
//         <div>
//           <Link href='/'>TalentHunt</Link>
//         </div>
//         <div className='flex gap-10 font-bold'>
//           {
//             links.map((link) => (
//               <Link href={`${link.link}`} key={link.link} className={`hover:text-[#5483b5] ${pathname === link.link? 'text-[#314d6a] font-bold' : 'text-blue-200' }`}>
//                 {link.title}
//               </Link>
//             ))
//           }
//         </div>
//         <div>
//           user
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Navbar

