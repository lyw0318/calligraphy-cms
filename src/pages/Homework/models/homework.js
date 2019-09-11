import queryHomework from '@/services/homework';

export default {
  namespace: 'homework',

  state: {
    list: [],
    count: 0,
    pages: 1,
    pageSize: 20,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryHomework, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.data,
          count: response.count,
        },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
