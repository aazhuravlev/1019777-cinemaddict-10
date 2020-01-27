export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getAll() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey));
    } catch (err) {
      return {};
    }
  }

  setItem(key, value) {
    const store = this.getAll();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {[key]: value})
        )
    );
  }

  setComments(id, comments, flag) {
    const store = this.getAll();
    if (flag) {
      const commentsId = comments.map((comment) => comment.id);
      store[id].comments = commentsId;
    } else {
      const commentsObj = comments;

      store[id] = commentsObj;
    }
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(store)
    );
  }

  removeComment(dataId, key, flag) {
    const store = this.getAll();
    let index;
    if (flag) {
      store[dataId].comments.forEach((comment, i) => {
        if (comment === key) {
          index = i;
        }
      });
      store[dataId].comments.splice([index], 1);
    } else {
      store[dataId].forEach((comment, i) => {
        if (comment.id === key) {
          index = i;
        }
      });
      store[dataId].splice([index], 1);
    }

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store)
        )
    );
  }

  removeItem(id) {
    const store = this.getAll();

    delete store[id];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store)
        )
    );
  }
}
