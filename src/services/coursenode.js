import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryCourseNodeList(params) {
  return request(`/calligraphy/manager/course/nodelist?${stringify(params)}`);
}

export async function postCourseNode(params) {
  return request('/calligraphy/manager/course/node', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
