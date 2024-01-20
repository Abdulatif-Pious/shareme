import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { MasonryLayout, Spinner } from '../components'; 
import { client } from '../utils/client';
import { searchQuery, feedQuery } from '../utils/queries';

const Feed = () => {
  const [pins, setPins] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { categoryId } = useParams();

  useEffect(() => {
    if (categoryId) {
      setIsLoading(true);
      const query = searchQuery(categoryId);
      client.fetch(query).then((data) => { 
        setPins(data)
        setIsLoading(false)
      })
    } else {
      setIsLoading(true);
      client.fetch(feedQuery).then((data) =>  {
        setPins(data);
        setIsLoading(false)
      })
    }
  }, [categoryId]);

  const newIdea = categoryId || 'new';
  
  if (isLoading) {
    return <Spinner  message={`We are adding ${newIdea} ideas to your feed!`} />
  }

  return (
    <div>
      {pins?.length ? (
        <MasonryLayout pins={pins} />
      ) : (
        <div className='flex justify-center font-bold text-2xl text-red-500'>
          <h3>No Pins for "{categoryId}"</h3>
        </div>
      )}
    </div>
  )
}

export default Feed;