import AbstractComponent from './abstract-component.js';
import {FilterName} from '../constants.js';

const createCounter = (count) => count !== `` ? `<span class="main-navigation__item-count">${count}</span>` : ``;

const createFilterMarkup = (filter) => {
  let {name, link, count, isActive} = filter;
  if (name === FilterName.ALL || name === FilterName.STATS) {
    count = ``;
  }

  return (
    // `<a href="#${link}" class="main-navigation__item${decorFilterLink(name, isActive)}">${name}
    `<a href="#${link.toLowerCase()}" id="${link.toLowerCase()}" class="main-navigation__item${isActive ? ` main-navigation__item--active` : ``}${name === FilterName.STATS ? ` main-navigation__item--additional` : ``}">${name}
    ${createCounter(count)}
    </a>`
  );
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((item) => createFilterMarkup(item)).join(`\n`);

  return (
    `<nav class="main-navigation">
      ${filtersMarkup}
    </nav>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const filterName = evt.target.id;
      handler(filterName[0].toUpperCase() + filterName.slice(1));
    });
  }
}
