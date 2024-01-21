import { GoogleLogin } from '@react-oauth/google';
import  jwt_decode  from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

import  sharemeVideo  from '../assets/share.mp4';
import  Logo  from '../assets/logowhite.png'; 
import { client } from '../utils/client';

const Login = () => {
  const navigate = useNavigate();

  const createOrGetUser = (response) => {
    const decoded = jwt_decode(response.credential);
    const { name, sub, picture } = decoded;
    
    const user = {
      _type: 'user',
      _id: sub,
      userName: name,
      image: picture,
    };
    
    window.localStorage.setItem('user', JSON.stringify(user));

    client.createIfNotExists(user)
      .then(() => {
        navigate('/')
      })
  }
  
  return (
    <div className="flex  flex-col items-center   h-screen">
      <div className='relative w-full h-full'>
        <video 
          src={sharemeVideo}
          type='video/mp4'
          loop
          muted
          autoPlay
          controls={false}
          className='w-full h-full object-cover'
        />

        <div className='absolute flex flex-col items-center justify-center inset-0 bg-[rgba(0,0,0,0.7)]'>
          <div className='p-5'>
            <img 
              src={Logo}
              alt="logo img"
              className='w-[130px]'
            />
          </div>
          <div>
            <GoogleLogin 
              onSuccess={(response) => createOrGetUser(response)}
              onError={() => console.log('login error')}
            />
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Login;