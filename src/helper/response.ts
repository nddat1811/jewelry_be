interface MyResponse<T> {
  Code: number;
  Message: string;
  Data: T;
}

interface PageInfo<T> {
  Total: number;
  CurrentTotal: number;
  CurrentPage: number;
  Data: T;
}

interface PagingResponse<T> {
  Code: number;
  Message: string;
  Data: PageInfo<T>;
}

function returnPagingResponse<T>(
  Code: number,
  Message: string,
  Total: number,
  CurrentTotal: number,
  CurrentPage: number,
  Data: T
): PagingResponse<T> {
  return {
    Code,
    Message,
    Data: {
      Total,
      CurrentTotal,
      CurrentPage,
      Data,
    },
  };
}

function returnResponse<T>(
  Code: number,
  Message: string,
  Data: T
): MyResponse<T> {
  return { Code, Message, Data };
}

export { returnResponse, returnPagingResponse };
