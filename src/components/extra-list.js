import {createElement} from '../util.js';

const EXTRA_TITLES = [`Top rated`, `Most commented`];

const createExtraListMarkup = (title) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>

      <div class="films-list__container"></div>
    </section>`
  );
};

const createExtraListTemplate = () => {
  return EXTRA_TITLES.map(createExtraListMarkup).join(`\n`);
};

export default class ExtraList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createExtraListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
