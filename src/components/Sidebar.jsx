import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';

import { categories } from '../utils/constants';
import logo from '../assets/logo.png';


const Sidebar = ({ closeToggle, user }) => {

  const active='font-bold flex items-center  color-[#f51997] border-r-2 border-r-[#f51997] my-4'
  const notActive='flex items-center my-4';

  return (
    <div className='flex flex-col justify-between h-screen min-w-[250px] p-4'>
      <div>
        <Link to='/' className='cursor-pointer' onClick={closeToggle}>
          <img 
            src={logo}
            alt='logo'
            className='w-32 mb-6'
          />
        </Link>
        <NavLink
          to='/'
          className={({ isActive }) => isActive ? active : notActive}
          onClick={closeToggle}
        >
          <AiFillHome />
          <p className='pl-2'>
            Home
          </p>
        </NavLink>
        <h3>
          Discover categories
        </h3>
        {
          categories.map((category) => (
            <NavLink
              to={`/categories/${category.name}`}
              key={category.name}
              className={({ isActive }) => isActive ? active : notActive}
              onClick={closeToggle}
            >
              <img 
                src={category.image}
                alt={category.name}
                className="w-8 h-8 sm:w-12 sm:h-12 rounded-full"
              />
              <p className='capitalize pl-2'>{category.name}</p>
            </NavLink>
          ))
        }
      </div>
      
      <div className='shadow p-2 rounded'>
        <Link
          to={`/user-profile/${user?._id}`}
          className='flex items-center'
        > 
          <img 
            src={user?.image}
            alt='user_img'
            className='w-10 h-10 rounded-full'
          />
          <p className='ml-2 font-semibold'>
            {user?.userName}
          </p>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar;