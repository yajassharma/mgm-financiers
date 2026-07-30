type TPageData = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type TServerResponse = {
  statusCode: 200 | 400 | 500 | 401 | 201 | 204 | 429 | 202 | 404;
  status: "success" | "error";
  title: string;
  message: string;
  data?: DATA;
  extraData?: EXTRA_DATA;
  pageData?: TPageData;
};
