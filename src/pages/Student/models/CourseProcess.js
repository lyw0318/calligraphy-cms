import { queryCourseProcess } from '@/services/student';

export default {
  namespace: 'CourseProcess',

  state: {
    list: [],
    pages: 1,
    pageSize: 20,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryCourseProcess, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.data,
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
