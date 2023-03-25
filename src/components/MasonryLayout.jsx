import { Pin } from './';
import Masonry from 'react-masonry-css';

const breakpointCols = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1
}

const MasonryLayout = ({ pins }) => {
  return (
    <Masonry className='flex' breakpointCols={breakpointCols}>
      {pins?.map((pin) => <Pin key={pin?._id} pin={pin} className='w-max' />)}
    </Masonry>
  )
}

export default MasonryLayout;