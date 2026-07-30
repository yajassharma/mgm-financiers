import { TServerResponse, TPageData } from '../types/server-response.type';

export function makeResponse<DATA = any, EXTRA_DATA = any>(res: {
  statusCode: TServerResponse<DATA, EXTRA_DATA>['statusCode'];
  status: TServerResponse<DATA, EXTRA_DATA>['status'];
  title: string;
  message: string;
  data?: DATA;
  extraData?: EXTRA_DATA;
  pageData?: TPageData;
}): TServerResponse<DATA, EXTRA_DATA> {
  const { statusCode, status, title, message, data, extraData, pageData } = res;
  return { statusCode, status, title, message, data, extraData, pageData };
}
