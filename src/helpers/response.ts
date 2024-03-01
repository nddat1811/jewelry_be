interface MyResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface PageInfo<T> {
  total: number;
  currentTotal: number;
  currentPage: number;
  data: T;
}

interface PagingResponse<T> {
  code: number;
  message: string;
  data: PageInfo<T>;
}

function returnPagingResponse<T>(
  code: number,
  message: string,
  total: number,
  currentTotal: number,
  currentPage: number,
  data: T
): PagingResponse<T> {
  return {
    code,
    message,
    data: {
      total,
      currentTotal,
      currentPage,
      data,
    },
  };
}

function returnResponse<T>(
  code: number,
  message: string,
  data: T
): MyResponse<T> {
  return { code, message, data };
}

export { returnResponse, returnPagingResponse };
