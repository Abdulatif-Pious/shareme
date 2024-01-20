import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { IoIosSend, IoMdDownload } from 'react-icons/io';
import { AiFillDelete } from 'react-icons/ai';

import { MasonryLayout, Spinner } from './';
import { client } from '../utils/client';
import { pinDetailQuery, pinDetailMorePinQuery } from '../utils/queries';

const PinDetail = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [pinDetail, setpinDetail] = useState(null);
  const [pins, setPins] = useState(null); 

  const navigate = useNavigate();
  const { pinId } = useParams();

  useEffect(() => {
    setIsLoading(true);
    const query = pinDetailQuery(pinId);
    
    client
      .fetch(query)
      .then((data) => {
        setpinDetail(data[0]);
        setIsLoading(false);
        
        if (data[0]) {
          const query1 = pinDetailMorePinQuery(data[0]);
          client
            .fetch(query1)
            .then((res) => {
              setPins(res);
            }) 
        }
      })
  }, [pinId]);

  const handleDelete = (id) => {
    client
      .delete(id)
      .then(() => {
        navigate('/');
        window.location.reload()
      })
  }

  const handleComment = (id) => {
    if (comment) {
      setIsLoadingComment(true);

      client
      .patch(id)
      .setIfMissing({ comments: [] })
      .insert('after', 'comments[-1]', [{
        comment,
        _key: uuidv4(),
        postedBy: {
          _type: 'postedBy',
          _ref: user?._id,
        }
      }])
      .commit()
      .then(() => {
        setComment('');
        setIsLoadingComment(false);
        window.location.reload();
      })
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center w-full h-screen'>      
        <Spinner message='Loading pin detail'/> 
      </div>
    )}

  return (
    <>
      <div className='flex flex-col md:flex-row items-center justify-center  bg-white mt-4 mx-10 rounded-2xl '>
        
        <div className='relative min-h-[200px] m-4'>
          <img 
            src={pinDetail?.image?.asset?.url}
            alt={pinDetail?.title}
            className='w-full h-full rounded-xl object-cover'
          />
          <div className='absolute flex items-center w-full justify-between bottom-3 '>
            {pinDetail?.postedBy?._id === user?._id && (
              <div className='flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full opacity-70 hover:opacity-100 cursor-pointer'>
                <AiFillDelete fontSize={24} onClick={() => handleDelete(pinDetail?._id)} />
              </div>
            )}
            <a 
              href={`${pinDetail?.image?.asset?.url}?dl=`}
              className='flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full opacity-70 hover:opacity-100 cursor-pointer'
              download
            >
              <IoMdDownload fontSize={24} />
            </a>
          </div>
        </div>

        <div className='w-full mx-4 my-8 p-4'>
          <Link to={`/user-profile/${pinDetail?.postedBy?._id}`}  className='flex items-center gap-3 my-6'>
            <img 
              src={pinDetail?.postedBy?.image}
              alt='user_img'
              className='w-12 h-12 rounded-full object-cover'
            />
            <h3 className='font-semibold text-xl'>
              {pinDetail?.postedBy?.userName}
            </h3>
          </Link>
          <h3 className='font-semibold text-2xl my-3'>
            {pinDetail?.title}
          </h3>
          <p className='text-gray-500 my-3'>
            {pinDetail?.about}
          </p>
          <h3 className='font-bold text-2xl my-6'>
            {pinDetail?.comments && pinDetail?.comments?.length} Comments
          </h3>
          {pinDetail?.comments?.length > 0  && (
            <div className='max-h-[370px] overflow-auto mb-8'>
              {pinDetail?.comments.map((comment) => (
              <div key={comment?._key} className='flex items-center gap-3 my-4'>
                <Link to={`/user-profile/${comment?.postedBy?._id}`}>
                  <img 
                    src={comment?.postedBy?.image}
                    alt='pin-user'
                    className='w-10 h-10 rounded-full objcet-cover'
                  />
                </Link>
                <div>
                  <p className='font-semibold text-xl '>
                    {comment?.postedBy?.userName}
                  </p>
                  <p className='text-gray-700'>
                    {comment?.comment}
                  </p>
                </div>
                <hr />
            </div>
            
            ))}
            </div>
          )}
          {isLoadingComment ? (
            <div className='flex flex-col items-center justify-center'>
              <Spinner message='The Comment is being sent'/>
            </div>
          ) : (
            <div className='flex items-center w-full gap-4'>
              <Link to={`/user-profile/${user?._id}`}>
                <img 
                  src={user?.image}
                  alt={user?.userName}
                  className='w-10 h-8 rounded-full object-cover'
                />
              </Link>
              <input 
                type='text'
                placeholder='comment...'
                className='font-semibold text-xl w-full p-3 border-2 border-gray-300 rounded-2xl outline-none focus:border-gray-500'
                onChange={(e) => setComment(e.target.value)}
              />
              <div 
                className='flex items-center justify-center bg-red-500 w-10 h-8 rounded-full cursor-pointer'
                onClick={() => handleComment(pinDetail?._id)}  
              >
              <IoIosSend fontSize={24} className='text-white'/>
            </div>
          </div>
          )}
        </div>
      </div>
        {pins?.length > 0 && (
          <div className='mt-8'>
            <h3 className='font-semibold text-2xl flex itemsc-etner justify-center w-full'>
              More like this
            </h3>
          {pins ? (
            <MasonryLayout pins={pins}/>
          ) : (
            <div className='flex flex-col items-center justify-center'>
              <Spinner message='More pins is loading'/>
            </div>
          )}
          </div>  
      )}
    </>
  )
}

export default PinDetail;