import { put, takeLatest, call, takeEvery } from 'redux-saga/effects';
import API from 'lib/config';
import { sagaActions }from './actions.saga';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import SuccessIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import ErrorIcon from '@material-ui/icons/ErrorOutlineOutlined';
import { clear, clearAll, push, types } from 'features/common.feature';
import { pushError } from 'sagas';

export const delay = (ms = 3000) => new Promise(res => setTimeout(res, ms))

export function* clearNotification({payload}) {
  const { id } = payload;
  yield put(clear(id));
}

export function* clearAllNotifications() {
  yield put(clearAll());
}

export function* pushSuccessNotification({payload}) {
  const { message, params } = payload;
  const id = Date.now();
  const defaultNotification = { id, place: 'tr', color: 'success', icon: SuccessIcon, params: {}}
  yield put(push(Object.assign(defaultNotification, { message, params })));
  yield delay();
  yield put(clear(id));
}

export function* pushInfoNotification({payload}) {
  const { message, params } = payload;
  const id = Date.now();
  const defaultNotification = { id, place: 'tr', color: 'info', icon: InfoIcon, params: {}}
  yield put(push(Object.assign(defaultNotification, { message, params })));
  yield delay();
  yield put(clear(id));
}

export function* pushErrorNotification({ payload }) {
  const { message, params } = payload;
  const id = Date.now();
  const defaultNotification = { id, place: 'tr', color: 'danger', icon: ErrorIcon, params: {}}
  yield put(push(Object.assign(defaultNotification, { message, params })));
  yield delay();
  yield put(clear(id));
}

export function* fetchTypes({ payload }) {  
  try {
    const { type } = payload;
    const { data } = yield call(API.get, { url: `/commons/${type}` });
    yield put(types({ type, data }));
  } catch (err) {
    yield pushError('fetchTypes', err);
  }
}

export function* watchNotificationSaga() {
  yield takeLatest(sagaActions.CLEAR_NOTIFICATION, clearNotification)
  yield takeLatest(sagaActions.CLEAR_ALL_NOTIFICATIONS, clearAllNotifications)
  yield takeLatest(sagaActions.PUSH_INFO_NOTIFICATION, pushInfoNotification)
  yield takeLatest(sagaActions.PUSH_SUCCESS_NOTIFICATION, pushSuccessNotification)
  yield takeLatest(sagaActions.PUSH_ERROR_NOTIFICATION, pushErrorNotification)
}

export function* watchTypeSaga() {
  yield takeEvery(sagaActions.FETCH_TYPES, fetchTypes)
}