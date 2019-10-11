import request from '@/utils/request';
import { stringify } from 'qs';

export default async function queryCourseNodeList(params) {
  return request(`/calligraphy/manager/course/nodelist?${stringify(params)}`);
}
