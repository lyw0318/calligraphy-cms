import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryStudent(params) {
  return request('/calligraphy/manager/course/student', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function queryCourseProcess(params) {
  return request(`/calligraphy/manager/course/process?${stringify(params)}`);
}
