import { fromTv } from "@clmovies/shareds/tv"
import { createSelector } from "@ngrx/store"

export const selectTvInit = createSelector(
  fromTv.selectListTvs,
  (listTvState) => {
    return listTvState
  }
)
