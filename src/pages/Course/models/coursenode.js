import { queryCourseNodeList, postCourseNode } from '@/services/coursenode';

export default {
  namespace: 'coursenode',

  state: {
    list: [],
    count: 0,
    pages: 1,
    pageSize: 20,
    choose: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryCourseNodeList, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.data,
          count: response.count,
        },
      });
    },

    *choose({ payload }, { put }) {
      console.log('choose ', payload.choose);
      yield put({
        type: 'save',
        payload: {
          choose: payload.choose,
        },
      });
    },

    *update({ payload }, { call, put }) {
      yield call(postCourseNode, payload);
      yield put({
        type: 'fetch',
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
