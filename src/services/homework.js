import request from '@/utils/request';
import { stringify } from 'qs';

export default async function queryHomework(params) {
  return request(`/calligraphy/manager/homework/list?${stringify(params)}`);
}
