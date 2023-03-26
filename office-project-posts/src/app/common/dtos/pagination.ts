export interface PaginationParams {
  ordering: 'ASC' | 'DESC';
  sortField: string;
  offset: number;
  limit: number;
}

export interface PageDTO {
  previousPage: string;
  currentPage: string;
  nextPage: string;
  totalItems: number;
}
