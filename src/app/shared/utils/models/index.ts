export interface Menu {
  id?:number,
  name?: string
}


export interface Movie{
  adult?:boolean,
  backdrop_path?:string,
  id?:number,
  original_language?:string,
  original_title?:string,
  overview?:string,
  popularity?:number,
  poster_path?:string,
  release_date?:string,
  title?:string,
  video?:boolean,
  vote_average?:string,
  vote_count?:number,
  belongs_to_collection?: any,
  budget?:number,
  genres?: any,
  homepage?: any,
  imdb_id?: string,
  production_companies?: any,
  production_countries?: any
  revenue?: number,
  runtime?: number,
  spoken_languages?: any,
  status?: string,
  tagline?: string
}


export interface Tv{
  backdrop_path?:string,
  created_by?: any
  episode_run_time?: number[]
  first_air_date?: string,
  genres?: any
  homepage?: string,
  id?: number,
  in_production?: boolean,
  languages?: string[],
  last_air_date?: string,
  last_episode_to_air?:any,
  name?: string,
  networks?: any,
  next_episode_to_air?: any,
  number_of_episodes?: number,
  number_of_seasons?: number,
  origin_country?: string[]
  original_language?: string,
  original_name?: string,
  overview?: string,
  popularity?: number,
  poster_path?: string,
  production_companies?: any,
  production_countries?: any,
  seasons?: any,
  spoken_languages?: any,
  status?: string,
  tagline?: string,
  type?: string,
  vote_average?: number,
  vote_count?: number,
}
