import { MovieFilter } from "@clmovies/shareds/movie/model";

export interface TvListPageState {
  typeTv?: string;
  page?: number;
  filter?: MovieFilter;
  reload?: boolean;
}
