import { queryCourseNodeList, postCourseNode } from '@/services/coursenode';

export default {
  namespace: 'coursenode',

  state: {
    list: [],
    count: 0,
    groupSeq: {},
    pages: 1,
    pageSize: 20,
    choose: {},
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      const { groupSeq } = yield select(({ coursenode }) => coursenode);
      const response = yield call(queryCourseNodeList, payload);
      console.log(
        'sss',
        response.data.filter(e => e.canDel).filter(e => e.gid === 1).length > 0 &&
          response.data.filter(e => e.canDel).filter(e => e.gid === 1)[0].seq
      );
      console.log('sss groupSeq::', groupSeq);
      yield put({
        type: 'save',
        payload: {
          list: response.data,
          count: response.count,
          groupSeq: {
            1:
              response.data.filter(e => e.canDel).filter(e => e.gid === 1).length > 0
                ? response.data.filter(e => e.canDel).filter(e => e.gid === 1)[0].seq
                : groupSeq[1],
            2:
              response.data.filter(e => e.canDel).filter(e => e.gid === 2).length > 0
                ? response.data.filter(e => e.canDel).filter(e => e.gid === 2)[0].seq
                : groupSeq[2],
          },
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
