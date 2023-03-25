import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';
import { RiCloseFill } from 'react-icons/ri';

import { Sidebar,  UserProfile } from '../components';
import Pins from './Pins';
import { client } from '../utils/client'
import { userQuery } from '../utils/queries';
import logo from '../assets/logo.png';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);

  const userInfo = window.localStorage.getItem('user') !== 'undefined' ? JSON.parse(window.localStorage.getItem('user')) : window.localStorage.clear();

  useEffect(() => {
    const query = userQuery(userInfo?._id); 

    client.fetch(query)
      .then((data) => {
        setUser(data[0]);
      });
  }, []);

  return (
    <div className='flex flex-col md:flex-row bg-gray-50 h-screen transition-height duration-75 ease-out'>
      
      <div className='hidden md:flex h-screen flex-initial bg-white'>
        <Sidebar user={user && user}/>
      </div>
      
      <div className='flex md:hidden'>
        <div className='flex md:hidden justify-between items-center w-full shadow-md p-2'>
          <HiMenu fontSize={40} onClick={() => setToggleSidebar(true)} className='cursor-pointer'/>
          <Link to='/'>
            <img 
              src={logo}
              alt='logo'
              className='w-28'
            />
          </Link>
          <Link to={`/user-profile/${user?._id}`}>
            <img 
              src={user?.image}
              alt="user img"
              className='w-9 h-9  rounded-full'
            />
          </Link>
          </div>
          {toggleSidebar && (
            <div className='fixed bg-white w-4/5 h-screen overflow-y-auto z-10 shadow-md'>
              <div className='absolute flex w-full justify-end items-center p-2'>
                <RiCloseFill fontSize={30} className="cursor-pointer" onClick={() => setToggleSidebar(false)}/>
              </div>
              <Sidebar closeToggle={() => setToggleSidebar(false)} user={user && user}/>
            </div>
          )}
      </div>

      <div className='pb-2 flex-1 h-screen overflow-y-auto'>
        <Routes>
          <Route path='/user-profile/:userId' element={<UserProfile />} />
          <Route path='/*' element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Home;