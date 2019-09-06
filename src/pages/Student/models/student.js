import { queryStudent } from '@/services/student';

export default {
  namespace: 'student',

  state: {
    list: [],
    count: 0,
    pages: 1,
    pageSize: 20,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryStudent, payload);
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
