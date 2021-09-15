import _ from 'lodash';
import API from 'lib/config';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { fetch, list, remove, count, error } from 'features/categories.feature';
import { sagaActions }from './actions.saga';
import { pushError, pushSuccess } from 'sagas';
import history from 'lib/history';

export function* saveCategory({ payload }) {  
  try {
    const { id } = payload || {}
    const { data } = yield call(_.isEmpty(id) ? API.post : API.put, { url: _.isEmpty(id) ? '/categories/create' : `/categories/${id}`, data: payload });
    yield put(fetch(data));
    yield pushSuccess('readCategory', { message: 'message.category.save.success'});

    yield history.push(`/categories/${data._id}`);
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('saveCategory', err);
  }
  
}

export function* listCategories({ payload }) {  
  try {
    const { params } = payload || {}
    const response = yield call(API.get, { url: `/categories`, config: { params } });
    yield put(list(response.data));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('listCategories', err);
  }

}

export function* countCategories({ payload }) {  
  try {
    const { params, type } = payload || {}
    const { data } = yield call(API.get, { url: `/categories/count`, config: { params } });
    yield put(count({ count: data, type }));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('countCategories', err);
  }

}

export function* readCategory({ payload }) {  
  try {
    const { id } = payload || {}
    const response = yield call(API.get, { url: `/categories/${id}` });
    yield put(fetch(response.data));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('readCategory', err);
  }

}

export function* deleteCategory({ payload }) {  
  try {
    const { id } = payload || {}
    yield call(API.delete, { url: `/categories/${id}` });
    yield put(remove(id));
    yield pushSuccess('deleteCategory', { message: 'message.category.remove.success'});
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('deleteCategory', err);
  }

}

export default function* watchCategoriesSaga() {
  yield takeEvery(sagaActions.COUNT_CATEGORIES, countCategories)
  yield takeLatest(sagaActions.LIST_CATEGORIES, listCategories)
  yield takeLatest(sagaActions.SAVE_CATEGORY, saveCategory)
  yield takeLatest(sagaActions.READ_CATEGORY, readCategory)
  yield takeLatest(sagaActions.DELETE_CATEGORY, deleteCategory)
}