import { createAction, props } from "@ngrx/store";

export const loadAllTypeTvs = createAction(
  '[TV] Load All tvs',
  props<{typesTvs: string []}>()
);
