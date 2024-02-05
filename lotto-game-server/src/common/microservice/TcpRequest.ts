import { ApiProperty } from "@nestjs/swagger";

/**
 * Tcp Request
 */
export class TcpRequest<T> {
  @ApiProperty()
  headers: object;
  @ApiProperty()
  data: T;

  constructor(data: T, headers?: object) {
    this.data = data;
    this.headers = headers;
  }

  static from<T>(data: T, headers?: object) {
    return new TcpRequest<T>(data, headers);
  }
}

/**
 * Tcp Pagination Request
 */
export class TcpPaginationRequest<T1, T2 = Pagination> {
  @ApiProperty()
  headers: object;
  @ApiProperty()
  data: T1;
  @ApiProperty()
  pagination: T2;

  constructor(data: T1, pagination: T2, headers?: object) {
    this.data = data;
    this.pagination = pagination;
    this.headers = headers;
  }

  static from<T1, T2 = Pagination>(data: T1, pagination: T2, headers?: object) {
    return new TcpPaginationRequest<T1, T2>(data, pagination, headers);
  }
}

/**
 * Pagination
 */
export class Pagination {
  @ApiProperty()
  page: number;

  @ApiProperty()
  offset: number;

  static from(page: number, offset: number) {
    const pagination = new Pagination();
    pagination.page = page;
    pagination.offset = offset;
    return pagination;
  }
}