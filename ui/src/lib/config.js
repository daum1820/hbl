
import axios from 'axios';
import { baseURL } from 'utils';
import { hasToken, bearerToken, clearToken, refreshToken } from 'lib/token'
import store from 'lib/store';
import { sagaActions } from 'sagas';
import { startLoading } from 'features/common.feature';
import { stopLoading } from 'features/common.feature';
import { setToken } from './token';

// Set config defaults when creating the instance
const axiosInstance = axios.create({
  baseURL
});

axiosInstance.interceptors.response.use(
  response => {
    store.dispatch(stopLoading());
    return response;
  },
  async(error) => {
    store.dispatch(stopLoading())
    
    if (hasToken()) {
      const request = error.config;
      
      if (error.response.status === 401 && error.response.data.message === 'TOKEN_EXPIRED' & !request.retry) {
        try {
          request.retry = true;
          const { data: { accessToken }} = await axiosInstance.post('auth/refresh', refreshToken());
          setToken(accessToken);
          return axiosInstance(request);
        } catch(e) {
          console.error('Your session could not be refreshed.', error.response);
          notifyAndLogout();          
        }
      }
      if (error.response.status === 403 || error.response.status === 401) {
        console.error('Your session expired.', error.response);
        notifyAndLogout();
      }

      if (error.response.status === 400) {
          notifyAndLogout();
      }
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use((config) => {
  store.dispatch(startLoading());
  
  if (hasToken()) {
      config.headers.Authorization = bearerToken();
  }

  return config;
});

const notifyAndLogout = () => {
  clearToken();
  store.dispatch({ type: sagaActions.PUSH_ERROR_NOTIFICATION , payload: { message: 'error.user.logout', params: { time : 3 }}})
  setTimeout(() => {
    store.dispatch({ type: sagaActions.LOGOUT });
  }, 3000);
}

const API = {
  get: async ({ url, config }) => await axiosInstance.get(url, config),
  post: async ({ url, data, config }) => await axiosInstance.post(url, data, config),
  put: async ({ url, data, config }) => await axiosInstance.put(url, data, config),
  delete: async ({ url, config }) => await axiosInstance.delete(url, config),
};

export default API;