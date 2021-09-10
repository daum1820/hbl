import _ from 'lodash';
import API from 'lib/config';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { fetch, list, remove, count, error } from 'features/products.feature';
import { sagaActions }from './actions.saga';
import { pushError, pushSuccess } from 'sagas';
import history from 'lib/history';

export function* saveProduct({ payload }) {  
  try {
    const { id } = payload || {}
    const { data } = yield call(_.isEmpty(id) ? API.post : API.put, { url: _.isEmpty(id) ? '/products/create' : `/products/${id}`, data: payload });
    yield put(fetch(data));
    yield pushSuccess('readProduct', { message: 'message.product.save.success'});

    yield history.push('/dashboard');
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('saveProduct', err);
  }
  
}

export function* listProducts({ payload }) {  
  try {
    const { params } = payload || {}
    const response = yield call(API.get, { url: `/products`, config: { params } });
    yield put(list(response.data));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('listProducts', err);
  }

}

export function* countProducts({ payload }) {  
  try {
    const { params, type } = payload || {}
    const { data } = yield call(API.get, { url: `/products/count`, config: { params } });
    yield put(count({ count: data, type }));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('countProducts', err);
  }

}

export function* readProduct({ payload }) {  
  try {
    const { id } = payload || {}
    const response = yield call(API.get, { url: `/products/${id}` });
    yield put(fetch(response.data));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('readProduct', err);
  }

}

export function* deleteProduct({ payload }) {  
  try {
    const { id } = payload || {}
    yield call(API.delete, { url: `/products/${id}` });
    yield put(remove(id));
    yield pushSuccess('deleteProduct', { message: 'message.product.remove.success'});
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('deleteProduct', err);
  }

}

export default function* watchProductsSaga() {
  yield takeEvery(sagaActions.COUNT_PRODUCTS, countProducts)
  yield takeLatest(sagaActions.LIST_PRODUCTS, listProducts)
  yield takeLatest(sagaActions.SAVE_PRODUCT, saveProduct)
  yield takeLatest(sagaActions.READ_PRODUCT, readProduct)
  yield takeLatest(sagaActions.DELETE_PRODUCT, deleteProduct)
}