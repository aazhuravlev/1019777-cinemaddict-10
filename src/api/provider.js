import Movie from "../models/movie.js";
import Comment from "../models/comment.js";

const getSyncedFilms = (items) => items.filter(({success}) => success).map(({payload}) => payload.film);

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  getFilms() {
    if (this._isOnLine()) {
      return this._api.getFilms().then(
          (films) => {
            films.forEach((film) => {
              this._api.getComments(film.id)
              .then((comments) => {
                film.comments = comments;
                this._store.setItem(film.id, film);
              });
            });

            return films;
          }
      );
    }
    this._isSynchronized = false;

    const storeFilms = Object.values(this._store.getAll());

    return Promise.resolve(storeFilms);
  }

  getComments(id) {
    if (this._isOnLine()) {
      return this._api.getComments(id);
    }
    this._isSynchronized = false;

    const storeFilmComments = this._store.getAll()[id].comments;

    return Promise.resolve(storeFilmComments);
  }

  addComment(id, comment) {
    if (this._isOnLine()) {
      return this._api.addComment(id, comment);
    }
    this._isSynchronized = false;


    return Promise.resolve(comment);
  }

  updateFilm(id, film) {
    if (this._isOnLine()) {
      return this._api.updateFilm(id, film).then(
          (newFilm) => {
            this._store.setItem(newFilm.id, newFilm.toRAW());
            return newFilm;
          }
      );
    }
    this._isSynchronized = false;

    const fakeUpdatedFilm = Movie.parseMovie(Object.assign({}, film.toRAW(), {id}));

    this._store.setItem(id, Object.assign({}, fakeUpdatedFilm.toRAW(), {offline: true}));

    return Promise.resolve(fakeUpdatedFilm);
  }

  deleteComment(dataId, commentId) {
    if (this._isOnLine()) {
      return this._api.deleteComment(commentId).then(
          () => {
            this._store.removeItem(dataId, commentId);
          }
      );
    }
    this._isSynchronized = false;

    this._store.removeItem(dataId, commentId);

    return Promise.resolve(this._store[dataId]); // проблема в этой строке
  }

  sync() {
    if (this._isOnLine()) {
      const storeMovies = Object.values(this._store.getAll());

      return this._api.sync(storeMovies)
        .then((response) => {
          // Удаляем из хранилища задачи, что были созданы
          // или изменены в оффлайне. Они нам больше не нужны
          storeMovies.filter((movie) => movie.offline).forEach((movie) => {
            this._store.removeItem(movie.id);
          });

          // Забираем из ответа синхронизированные задачи
          const createdFilms = getSyncedFilms(response.created);
          const updatedFilms = getSyncedFilms(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент,
          // вдруг сеть пропадёт
          [...createdFilms, ...updatedFilms].forEach((movie) => {
            this._store.setItem(movie.id, movie);
          });

          // Помечаем, что всё синхронизировано
          this._isSynchronized = true;

          return Promise.resolve();
        });
    }
    return Promise.reject(new Error(`Sync data failed`));
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
