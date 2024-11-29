import React from 'react'
import Link from 'next/link'
const links = [
  {
    'title': 'Create role',
    'link': '/JD-Create'
  },
  {
    'title': 'Dashboard',
    'link': '/dashboard'
  },
]

const Navbar = () => {
  return (
    <div className='min-h-10 flex items-center bg-[#5aabab]'>
      <div className='w-full flex justify-between'>
        <div>Talent Hunt</div>
        <div className='flex gap-10 font-bold'>
          {
            links.map((link) => (
              <Link href={`${link.link}`} key={link.link} className='hover:text-white'>
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

