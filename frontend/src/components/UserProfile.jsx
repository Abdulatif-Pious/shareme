import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../utils/client';
import { userQuery, userCreatedPinsQuery, userSavedPinsQuery } from '../utils/queries';
import { MasonryLayout, Spinner } from '.';

const UserProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeBtn, setActiveBtn] = useState('Created');
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created');
  
  const { userId } = useParams();
  
  useEffect(() => {
    setIsLoading(true);

    const query = userQuery(userId);
    client
      .fetch(query)
      .then((data) => {
        setIsLoading(false);
        setUser(data[0]);
      })
  }, [userId]);

  useEffect(() => {
    if (text === "Created") {
      setIsLoading(true);

      const query = userCreatedPinsQuery(userId);
      client
        .fetch(query)
        .then((data) => {
          setPins(data);
          setIsLoading(false);
        })
    }  else {
      setIsLoading(true);

      const query = userSavedPinsQuery(userId);
      client
        .fetch(query)
        .then((data) => {
          setIsLoading(false);
          setPins(data);
        })
    }
  }, [userId, text])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center w-full h-screen'>
        <Spinner message="User profile is loading"/>
      </div>
    )
  }
  return (
    <div className='my-12 mx-6'>
      <div className='flex flex-col items-center justify-center gap-4 mt-8'>
        <img 
          src={user?.image}
          alt='user-img'
          className='w-14 h-14 object-cover rounded-full'
        />
        <h3 className='font-semibold text-2xl'>
          {user?.userName}
        </h3>
        <div className='flex items-center justify-center gap-3'>
          <button
            type="button"
            className={`font-semibold py-3 px-4 shadow rounded-full ${activeBtn === 'Created' ? 'text-white bg-red-500 ' : 'text-black'}`}
            onClick={(e) => {
              setActiveBtn(e.target.textContent)
              setText(e.target.textContent)
            }}
          >
            Created
          </button>
          <button
            type="button"
            className={`font-semibold py-3 px-4 shadow rounded-full ${activeBtn === 'Saved'  ? 'text-white bg-red-500' : 'text-black'}`}
            onClick={(e) => {
              setActiveBtn(e.target.textContent)
              setText(e.target.textContent)
            }}
          >
            Saved
          </button>
        </div>
      </div>
      <MasonryLayout pins={pins} />
    </div>
  )
}

export default UserProfile;