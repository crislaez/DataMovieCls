import { createAction, props } from '@ngrx/store';

export const loadAllTypeMovies = createAction(
  '[Movie] Load All movies',
  props<{typesMovies: string []}>()
);
