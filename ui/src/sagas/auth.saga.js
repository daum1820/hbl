import { parseToken, clearToken, setToken } from 'lib/token';
import API from 'lib/config';
import { put, takeLatest, call } from 'redux-saga/effects';
import { login, logout } from 'features/auth.feature';
import { sagaActions }from './actions.saga';
import history from 'lib/history';
import { error } from 'features/auth.feature';
import { pushError } from 'sagas';
import { delay } from './common.saga';

export function* doLogin({payload}) {
  try {
    const { username, password } = payload;
    const response = yield call(API.post, { url: '/auth/login', data: { username, password } });
    
    yield setToken(response.data.accessToken, 'accessToken');
    yield setToken(response.data.refreshToken, 'refreshToken');
    const authUser = parseToken(response.data.accessToken);
    yield put(login(authUser));

  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('doLogin', err);
  }
};

export function* doLogout() {
    clearToken();
    yield delay(300);
    yield put(logout());
    yield history.push('/');
};

export default function* watchAuthSaga() {
  yield takeLatest(sagaActions.LOGIN, doLogin)
  yield takeLatest(sagaActions.LOGOUT, doLogout)
}