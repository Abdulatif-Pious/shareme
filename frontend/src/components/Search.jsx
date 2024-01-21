import { useState, useEffect } from 'react';

import { client } from '../utils/client';
import { feedQuery, searchQuery } from '../utils/queries';
import { MasonryLayout, Spinner } from '.';

const Search = ({ searchTerm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pins, setPins] = useState(null);

  useEffect(() => {
    if (!searchTerm) {
      setIsLoading(true);

      const query = feedQuery;
      client
        .fetch(query)
        .then((data) => {
          setIsLoading(false);
          setPins(data);
        })
    }  else {
      setIsLoading(true);

      const query = searchQuery(searchTerm);
      client
        .fetch(query)
        .then((data) => {
          setIsLoading(false);
          setPins(data);
        })
    }
  }, [searchTerm]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center w-full h-screen'>
        <Spinner message='Searching Pins...' />
      </div>
    )
  }
  return (
    <div>
      {pins?.length ? (
        <div>
          {searchTerm && (
            <h3 className='flex justify-center font-semibold text-2xl'>
              <span className='text-red-500'>"{searchTerm}" Pins here</span>
            </h3>
          )}
        <MasonryLayout pins={pins}/>
        </div>
      ) : (
        <div className='flex justify-center font-semibold text-2xl text-red-500'>
          "{searchTerm}" Pins is not found!
        </div>
      )}
    </div>
  )
}

export default Search;