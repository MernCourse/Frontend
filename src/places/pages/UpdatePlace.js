import React, { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import './PlaceForm.css';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { PLACE_ID, SERVER_URL_BASE } from '../../shared/util/Constans';

const UpdatePlace = () => {
  const auth = useContext(AuthContext)
  const {isLoading, error, sendRequest, clearError} = useHttpClient()
  const [loadedPlace, setLoadedPlace] = useState()
  const placeId = useParams().placeId;
  const history = useHistory()

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await sendRequest(
          SERVER_URL_BASE+PLACE_ID+placeId)

        setLoadedPlace(response)
        setFormData(
          {
            title: {
              value: response.title,
              isValid: true
            },
            description: {
              value: response.description,
              isValid: true
            }
          },
          true
        )
      } catch (error) {}
    }
    fetchPlace()
  }, [sendRequest, placeId, setFormData])

  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        SERVER_URL_BASE+PLACE_ID+placeId, 
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value
        }),
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        }
      )
      history.push(`/${auth.userId}/places`)
    } catch (error) {
      console.log(error);
    }
  };

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onclear={clearError}/>
      {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
      )}
      {!isLoading && loadedPlace &&
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      }
    </React.Fragment>
  );
};

export default UpdatePlace;
