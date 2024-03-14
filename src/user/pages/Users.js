import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import { ALL_USERS, SERVER_URL_BASE } from '../../shared/util/Constans';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
  const [userData, setUserData] = useState([])
  const {isLoading, error, sendRequest, clearError} = useHttpClient()

  useEffect(() => {
    const getAllUsersRequest = async () => {
      try {
        const response = await sendRequest(SERVER_URL_BASE+ALL_USERS)
        
        // setting users data
        setUserData(response)
      } catch (error) {}
    }
    getAllUsersRequest()
  }, [sendRequest])

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      {isLoading && (
        <div className='center'>
            <LoadingSpinner />
        </div>
      )}
      { !isLoading && userData.length > 0 && <UsersList items={userData} />}
    </React.Fragment>
  );
};

export default Users;
