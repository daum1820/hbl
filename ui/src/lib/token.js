import _ from 'lodash';

export const setToken = (token, tokenName = 'accessToken') => {
  localStorage.setItem(`HBL${tokenName}`, token);
}

export const refreshToken= () => {
  return { refreshToken: getToken('refreshToken') }
}
export const bearerToken = () => {
  return `Bearer ${getToken()}`;
}

export const getToken = (tokenName = 'accessToken') => (localStorage.getItem(`HBL${tokenName}`));

export const clearToken = (tokenName = 'accessToken') => {
  localStorage.removeItem(`HBL${tokenName}`);
}

export const hasToken = (prop = 'accessToken') => {
  return !_.isEmpty(getToken(prop));
}

export const parseToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return { _id: '', username: '', changePassword: true };
  }
};

export const readFromToken = (prop, tokenProp = 'accessToken') => {
  return !!prop ? parseToken(getToken(tokenProp))[prop] : parseToken(getToken(tokenProp));
}