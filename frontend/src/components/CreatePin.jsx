import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { AiFillDelete } from 'react-icons/ai';

import { client } from '../utils/client';
import { categories } from '../utils/constants';
import { Spinner } from '.';

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [category, setCategory] = useState(null);
  const [isSavingPin, setIsSavingPin] = useState(false);
  const [isNotCompleted, setIsNotCompleted] = useState(false); 
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  
  const uploadImage = (e) => {
    const selectedFile = e.target.files[0];

    // uploading asset to sanity
    const { name, type } = selectedFile;
    if (type === 'image/jpg' || type === 'image/jpeg' || type === 'image/svg' || type === 'image/png' || type === 'image/gif' || type === 'image/tiff') {
      setWrongImageType(false);
      setIsLoading(true);
      client.assets
        .upload('image', selectedFile, { contentType: type, filename: name})
        .then((document) => {
          setImageAsset(document);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log('upload error:', error.message)
        })
    } else {
      setIsLoading(false);
      setWrongImageType(true);
      
      setTimeout(() => {
        setWrongImageType(false)
      }, 5000);
    }
  }
  
  const savePin = () => {
    if (title && about && destination && category && imageAsset?._id) {
      setIsSavingPin(true);

      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id,
          },
        },
        userId: user?._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user?._id,
        },
        category
      };

      client
        .create(doc)
        .then(() => {
          navigate('/');
          window.location.reload();
        })
    } else {
      setIsSavingPin(false);
      setIsNotCompleted(true);

      setTimeout(() => {
        setIsNotCompleted(false)
      }, 3000)
    }
  }

  return (  
    <>
      <div className='flex flex-col md:flex-row  mt-4 mx-10 rounded bg-white'>
        {!isLoading ? (
          !imageAsset ? (
            <label  className='flex flex-col justify-between  min-h-[200px] bg-gray-100 rounded m-6 p-12 cursor-pointer'>
                <div className='flex flex-col items-center justify-center w-full p-3'>
                  <AiOutlineCloudUpload fontSize={30} />
                  <p>Click to upload</p>
                </div>
                <p className='text-gray-500 p-3'>
                  Recomendation: Use high-quality JPG, JPEG, SVG, PNG, GIF, or TiFF less than 20MB
                </p>
                <input 
                  type='file'
                  name='upload-image'
                  className='w-0 h-0'
                  onChange={uploadImage}
                />
                
                {wrongImageType && (
                  <p className='flex items-cetner justify-center font-semibold text-2xl text-red-500'>Wrong file type</p>
                )}       
            </label>
          ) : (
            <div className='relative min-h-[200px] bg-gray-100 rounded m-6 p-12'>
              <img 
                src={imageAsset?.url}
                alt='user_pin'
                className='w-full h-full'
              />
              <div className='absolute flex items-center justify-center w-12 h-12 rounded-full bg-white bottom-4 right-4 cursor-pointer'>
                <AiFillDelete  
                  fontSize={25}
                  onClick={() => setImageAsset(null)}
                />
              </div>
            </div>
          )
          
        ) : (
          <div className='flex items-center justify-center w-full'>
            <Spinner message='Pin is being uploaded' />
          </div>
        )}
        
        <div className='m-6 w-full'>
          <input 
            type='text'
            placeholder='Add your title'
            className='block font-semibold border-b-2 border-gray-300 my-2 p-3 outline-none  placeholder:font-semibold placeholder:text-gray-400'
            onChange={(e) => setTitle(e.target.value)}
          />
          <input 
            type='text'
            placeholder='Tell eveyone what your Pin is about'
            className='block font-semibold   border-b-2 border-gray-300 my-2 p-3 outline-none  placegolder:text-semibold placeholder:text-gray-400'
            onChange={(e) => setAbout(e.target.value)}
          />
          <input 
            type='text'
            placeholder='Add a destination link'
            className='block font-semibold  border-b-2 border-gray-300 my-2 p-3 outline-none  placegolder:text-semibold placeholder:text-gray-400'
            onChange={(e) => setDestination(e.target.value)}
          />
          <h3 className='font-bold text-2xl my-3'>
            Choose Pin category
          </h3>
          <select 
            className=' outline-none border-b-2 border-gray-300 p-3'
            onChange={(e) => setCategory(e.target.value)}  
          >
            <option value='others'>
              Select Category
            </option>
            {categories.map((category, i) => (
              <option key={`${category}-${i}`} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <div className='flex w-full justify-end mt-8'>
            <button 
              type='button'
              className='font-semibold text-xl text-white bg-red-500 px-6 py-2 rounded-full'
              onClick={savePin}
            >
              {isSavingPin ? 'Saving Pin' : 'Save Pin'}
            </button>
          </div>
        </div>
      </div>
      {isNotCompleted && (
        <p className='flex items-center justify-center font-semibold text-2xl text-red-500 mt-6'>
          Please fill all fields
        </p>
      )}
    </>
  )
}

export default CreatePin;