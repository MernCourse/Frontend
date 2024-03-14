import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { GET_USER_PLACES, SERVER_URL_BASE } from '../../shared/util/Constans';

const UserPlaces = () => {
  const userId = useParams().userId
  const {isLoading, error, sendRequest, clearError} = useHttpClient()
  const [userPlaces, setUserPlaces] = useState([])
  
  useEffect(() => {
    const getAllUserPlaces = async () => {
      try {
        const places = await sendRequest(
          SERVER_URL_BASE+GET_USER_PLACES+userId)
        setUserPlaces(places)
      } catch (error) {}
    }
    getAllUserPlaces()
  }, [sendRequest, userId])

  const deletedHandler = deletedId => {
    setUserPlaces(prevPlaces => 
      prevPlaces.filter(place => 
        place._id !== deletedId))
  }

  return (
    <React.Fragment>
      {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
      )}
      {!isLoading && userPlaces && 
        <PlaceList items={userPlaces} onDelete={deletedHandler} />}
    </React.Fragment>
  );
};

export default UserPlaces;
