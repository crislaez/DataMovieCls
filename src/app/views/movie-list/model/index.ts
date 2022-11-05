import { MovieFilter } from "@clmovies/shareds/movie/model";

export interface MovieListPageState {
  typeMovie?: string;
  page?: number;
  filter?: MovieFilter;
  reload?: boolean;
}
