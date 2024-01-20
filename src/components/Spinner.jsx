import { Circles } from 'react-loader-spinner';

const Spinner = ({ message }) => {
  return (
    <div className='flex flex-col items-center justify-center w-full h-[100%]'>
      <Circles
        type="Circles"
        color="#00bfff"
        height={50}
        width={200}
      />
      <p className='font-bold text-xl text-center m-2'>{message}</p>
    </div>
  )
}

export default Spinner;