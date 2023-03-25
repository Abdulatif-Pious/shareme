import { useNavigate, Link } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  if (user) {
    return (
      <div className='flex items-center w-full gap-4'>
        
        <div className='flex items-center w-full bg-white my-4 p-2 rounded'>
          <AiOutlineSearch className='mx-2'/>
          <input 
            type='text'
            placeholder='Search...'
            onFocus={() => navigate('/search')}
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            className='w-full outline-none'
          />
        </div>
        <div className='flex items-center gap-4'>
          <Link to={`/user-profile/${user?._id}`} className='hidden md:block'>
            <img  
              src={user?.image}
              alt='user-img'
              className='w-14 h-12 rounded-lg'
            />
          </Link>
          <Link to='/create-pin'>
            <div className='text-xl flex items-center justify-center text-white bg-black my-4 p-2 rounded-lg w-12 h-12'>
              +
            </div>
          </Link>
        </div>
    </div>
    )
  }

  return null;
}

export default Navbar;