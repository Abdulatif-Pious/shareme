import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { IoMdDownload } from 'react-icons/io';
import { RiExternalLinkLine } from 'react-icons/ri';
import { AiFillDelete } from 'react-icons/ai';

import { client, urlFor } from '../utils/client';;


const Pin = ({ pin }) => {
  const [isHoverPin, setIsHoverPin] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();

  const { postedBy, _id, image, destination } = pin;
  
  const user = window.localStorage.getItem('user') !== 'undefined' ? JSON.parse(window.localStorage.getItem('user')) : window.localStorage.clear();

  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => {
        window.location.reload();
      })
  };

  let alreadySaved = pin?.save?.filter((item) => item?.postedBy?._id === user?._id);
  
  alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

  const savePin = (id) => {
    if (alreadySaved?.length === 0) {
      setIsSaving(true)

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [{
          _key : uuidv4(),
          userId: user?._id,
          postedBy: {
            type: 'postedBy',
            _ref: user?.Id,
          }
        }])
        .commit()
        .then(() => {
          window.location.reload();
          setIsSaving(false)
        });
    }
  }
  return (
    <div className='m-2'>
      <div 
        onClick={() => navigate(`/pin-detail/${_id}`)}
        onMouseEnter={() => setIsHoverPin(true)}
        onMouseLeave={() => setIsHoverPin(false)}
        className='relative w-auto shadow rounded-xl transition-all duration-150 ease-in-out cursor-pointer'
      >{image && (
        <img 
          src={urlFor(image)}
          alt='user-post'
          className='w-full rounded-xl'
        />
      )}
        {isHoverPin && (
          <div className='absolute top-0 flex flex-col justify-between w-full h-full z-50 p-3'>
            <div className='flex justify-between w-full'>
              <div>
                <a 
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className='flex items-center justify-center w-8 h-8 bg-white rounded-full opacity-70 hover:shadow-lg hover:opacity-100'
                >
                  <IoMdDownload />
                </a>
              </div>
              {alreadySaved?.length !== 0 ? (
                <button 
                  className='font-bold text-white flex items-center justify-center  h-8 bg-red-500 rounded-3xl py-1 px-5 opacity-70 hover:shadow-lg hover:opacity-100'
                  type='button'
                >
                  {pin?.save?.length} Saved
                </button>
              ) : (
                <button
                  className='font-bold text-white flex items-center justify-center  h-8 bg-red-500 rounded-3xl py-1 px-5 opacity-70 hover:shadow-lg hover:opacity-100'
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                >
                  {pin?.save?.length} {isSaving ? 'Saving' : 'Save'}
                </button>
              )}
            </div>
            <div className='flex justify-between w-full'>
              {destination?.slice(8).length > 0 && (
                <a
                  href={destination}
                  target='_blank'
                  rel='noreferrer'
                  className='font-bold flex items-center justify-center gap-2 bg-white rounded-full py-1 px-5  opacity-70 hover:opacity-100 '
                >
                  <RiExternalLinkLine />
                  {destination?.slice(8, 17)}...
                </a>
              )}
              {postedBy?._id === user?._id && (
                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id)
                  }}
                  className='flex items-center justify-center w-8 h-8 bg-white rounded-full opacity-70 hover:shadow-lg hover:opacity-100'
                >
                  <AiFillDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
        <Link to={`/user-profile/${postedBy?._id}`} className='flex justify-center items-center  gap-3 mt-2'>
          <img 
            src={postedBy?.image}
            alt='user_profile'
            className='w-9 h-9 rounded-full object-cover'
          />
          <p className='font-semibold capitalize'>{postedBy?.userName}</p>
        </Link>
    </div>
  )
}

export default Pin;