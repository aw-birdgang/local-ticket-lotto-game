import { ApiProperty } from "@nestjs/swagger";

/**
 * Tcp Response
 */
export class TcpResponse<T> {
  @ApiProperty()
  data: T;

  constructor(data: T) {
    this.data = data;
  }

  static from<T>(data: T) {
    return new TcpResponse<T>(data);
  }
}

/**
 * Tcp Pagination Response
 */
export class TcpPaginationResponse<T1, T2 = PaginationMeta> {
  @ApiProperty()
  data: T1;
  @ApiProperty()
  pagination: T2;

  constructor(data: T1, pagination: T2) {
    this.data = data;
    this.pagination = pagination;
  }

  static from<T1, T2 = PaginationMeta>(data: T1, pagination: T2) {
    return new TcpPaginationResponse<T1, T2>(data, pagination);
  }
}

/**
 * Pagination Meta ( Response 전용 )
 */
export class PaginationMeta {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  lastPage: number;

  static from(total: number, page: number, lastPage: number) {
    const paginationMeta = new PaginationMeta();
    paginationMeta.total = total;
    paginationMeta.page = page;
    paginationMeta.lastPage = lastPage;
    return paginationMeta;
  }
}
