'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  {
    'title': 'Create role',
    'link': '/JD-Create'
  },
  {
    'title': 'Dashboard',
    'link': '/dashboard'
  },
  {
    'title':'Design Assessment',
    'link':'/assessment'
  }
]

const Navbar = () => {
  const pathname = usePathname()
  return (
    <div className='min-h-10 flex items-center bg-[#5aabab]'>
      <div className='w-full flex justify-between'>
        <div>
          <Link href='/'>TalentHunt</Link>
        </div>
        <div className='flex gap-10 font-bold'>
          {
            links.map((link) => (
              <Link href={`${link.link}`} key={link.link} className={`hover:text-[#5483b5] ${pathname === link.link? 'text-[#314d6a] font-bold' : 'text-blue-200' }`}>
                {link.title}
              </Link>
            ))
          }
        </div>
        <div>
          user
        </div>
      </div>
    </div>
  )
}

export default Navbar

