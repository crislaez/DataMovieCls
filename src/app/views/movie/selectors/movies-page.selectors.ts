import { fromMovie } from "@clmovies/shareds/movie"
import { createSelector } from "@ngrx/store"

export const selectMoviesInit = createSelector(
  fromMovie.selectListMovies,
  (listMovieState) => {
    return listMovieState
  }
)
