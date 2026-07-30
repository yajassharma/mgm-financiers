import { HttpStatus } from '@nestjs/common';

export type TPageData = {
  total: number;
  currentPage: number;
  pageSize: number;
};

export type TServerResponse<DATA = unknown, EXTRA_DATA = unknown> = {
  statusCode: HttpStatus;
  status: 'success' | 'error';
  title: string;
  message: string;
  data?: DATA;
  extraData?: EXTRA_DATA;
  pageData?: TPageData;
  requestId?: string;
};
