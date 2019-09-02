import request from '@/utils/request';

export async function queryStudent(params) {
  return request('/calligraphy/manager/course/student', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function queryCurrent() {
  return request('/api/currentUser');
}
