import _ from 'lodash';
import API from 'lib/config';
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetch, list, remove, count, error } from 'features/users.feature';
import { sagaActions }from './actions.saga';
import { pushError, pushSuccess } from 'sagas';
import history from 'lib/history';

export function* saveUser({ payload }) {
  try {
    const { id } = payload || {}
    const {data } = yield call(_.isEmpty(id) ? API.post : API.put, { url: _.isEmpty(id) ? '/users/create' : `/users/${id}`, data: payload });
    yield put(fetch(data));
    yield pushSuccess('readUser', { message: 'message.user.save.success'});

    yield _.isEmpty(id) ? history.push(`/users/${data._id}`) : history.push('/dashboard'); 
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('saveUser', err);
  }
}

export function* listUsers({ payload }) {
  try {
    const { params } = payload || {}
    const response = yield call(API.get, { url: `/users`, config: { params } });
    yield put(list(response.data));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('listUsers', err);
  }
}

export function* countUsers({ payload }) {
  try {
    const { params } = payload || {}
    const response = yield call(API.get, { url: `/users/count`, config: { params } });
    yield put(count(response.data));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('countUsers', err);
  }
}

export function* readUser({ payload }) {
  try {
    const { id } = payload || {}
    const response = yield call(API.get, { url: _.isEmpty(id) ? '/users/profile' : `/users/${id}` });
    yield put(fetch(response.data));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('readUser', err);
  }
}

export function* deleteUser({ payload }) {
  try {
    const { id } = payload || {}
    yield call(API.delete, { url: `/users/${id}` });
    yield put(remove(id));
    yield pushSuccess('deleteUser', { message: 'message.user.remove.success'});
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('deleteUser', err);
  }
}

export function* userSecurity({ payload }) {
  try {
    const { id, message, ...data } = payload;
    const response =  yield call(API.put, { url: `/users/${id}/changeSecurity`, data });
    yield pushSuccess('userSecurity', { message });
    yield put(fetch(response.data));
  } catch (err) {
    yield pushError('userSecurity', err);
  }
}

export default function* watchUsersSaga() {
  yield takeLatest(sagaActions.LIST_USERS, listUsers)
  yield takeLatest(sagaActions.SAVE_USER, saveUser)
  yield takeLatest(sagaActions.READ_USER, readUser)
  yield takeLatest(sagaActions.DELETE_USER, deleteUser)
  yield takeLatest(sagaActions.COUNT_USERS, countUsers)
  yield takeLatest(sagaActions.USER_CHANGE_SECURITY, userSecurity)
}