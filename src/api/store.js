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

  removeItem(dataId, key) {
    const store = this.getAll();
    const commentIndex = store[dataId].comments.indexOf(key);

    delete store[dataId].comments[commentIndex];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store)
        )
    );
  }
}
