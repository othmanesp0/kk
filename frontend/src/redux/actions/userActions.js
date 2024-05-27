import axios from 'axios';

const apiUrl = 'http://localhost:8000/api'; // Adresse de votre API

export const fetchUsersRequest = () => ({
  type: 'FETCH_USERS_REQUEST',
});

export const fetchUsersSuccess = (users) => ({
  type: 'FETCH_USERS_SUCCESS',
  payload: users,
});

export const fetchUsersFailure = (error) => ({
  type: 'FETCH_USERS_FAILURE',
  payload: error,
});

export const fetchUsers = () => {
  return async (dispatch) => {
    dispatch(fetchUsersRequest());
    try {
      const response = await axios.get(`${apiUrl}/utilisateurs`);
      dispatch(fetchUsersSuccess(response.data));
    } catch (error) {
      dispatch(fetchUsersFailure(error.message));
    }
  };
};