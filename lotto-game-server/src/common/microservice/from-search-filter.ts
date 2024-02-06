import { ApiProperty } from "@nestjs/swagger";

export class SearchFilterSort {
  @ApiProperty()
  searchKeywords: string;

  @ApiProperty()
  filter: Record<string, any>;

  @ApiProperty()
  sort: Record<string, any>;

  constructor(searchKeywords: string, filter: Record<string, any>, sort: Record<string, any>) {
    this.filter = filter;
    this.sort = sort;
    this.searchKeywords = searchKeywords;
  }

  static from(searchKeywords: string, filter: Record<string, any>, sort: Record<string, any>) {
    return new SearchFilterSort(searchKeywords, filter, sort);
  }
}

export class FilterSort {
  @ApiProperty()
  filter: Record<string, any>;

  @ApiProperty()
  sort: Record<string, any>;

  constructor(filter: Record<string, any>, sort: Record<string, any>) {
    this.filter = filter;
    this.sort = sort;
  }

  static from(filter: Record<string, any>, sort: Record<string, any>) {
    return new FilterSort(filter, sort);
  }
}

export class Filter {
  @ApiProperty()
  filter: Record<string, any>;

  constructor(filter: Record<string, any>) {
    this.filter = filter;
  }

  static from(filter: Record<string, any>) {
    return new Filter(filter);
  }
}

export enum SortingType {
  ASC = "ASC",
  DESC = "DESC",
}
