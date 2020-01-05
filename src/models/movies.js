export default class Movies {
  constructor() {
    this._movies = [];
  }

  getMoviesAll() {
    return this._movies;
  }

  setMovies(movies) {
    this._movies = Array.from(movies);
  }

  updateMovie(id, movie) {
    const index = this._movie.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._movie = [].concat(this._movie.slice(0, index), movie, this._movie.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }
}