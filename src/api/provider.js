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
            films.forEach((film) => this._store.setItem(film.id, film.toRAW()));
            return films;
          }
      );
    }
    this._isSynchronized = false;

    const storeFilms = Object.values(this._store.getAll());

    return Promise.resolve(Movie.parseMovies(storeFilms));
  }

  getComments(id) {
    if (this._isOnLine()) {
      return this._api.getComments(id);
    }
    this._isSynchronized = false;

    return Promise.resolve(Comment.parseComments([]));
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

    const fakeUpdatedFilm = Movie.parseTask(Object.assign({}, film.toRAW(), {id}));

    this._store.setItem(id, Object.assign({}, fakeUpdatedFilm.toRAW(), {offline: true}));

    return Promise.resolve(fakeUpdatedFilm);
  }

  deleteComment(commentId) {
    if (this._isOnLine()) {
      return this._api.deleteComment(commentId).then(
          () => {
            this._store.removeItem(commentId);
          }
      );
    }
    this._isSynchronized = false;

    this._store.removeItem(commentId);

    return Promise.resolve();
  }

  sync() {
    if (this._isOnLine()) {
      const storeTasks = Object.values(this._store.getAll());

      return this._api.sync(storeTasks)
        .then((response) => {
          // Удаляем из хранилища задачи, что были созданы
          // или изменены в оффлайне. Они нам больше не нужны
          storeTasks.filter((task) => task.offline).forEach((task) => {
            this._store.removeItem(task.id);
          });

          // Забираем из ответа синхронизированные задачи
          const createdTasks = getSyncedFilms(response.created);
          const updatedTasks = getSyncedFilms(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент,
          // вдруг сеть пропадёт
          [...createdTasks, ...updatedTasks].forEach((task) => {
            this._store.setItem(task.id, task);
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
