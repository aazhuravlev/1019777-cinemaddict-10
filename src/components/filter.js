const decorFilterLink = (name) => {
  if (name === `All movies`) {
    return ` main-navigation__item--active`;
  } else if (name === `Stats`) {
    return ` main-navigation__item--additional`;
  }
  return ``;
};

const createFilterMarkup = (filter) => {
  const {name, link, count} = filter;

  return (
    `<a href="#${link}" class="main-navigation__item${decorFilterLink(name)}">${name}
    ${
    count !== `` ?
      `<span class="main-navigation__item-count">${count}</span>`
      : ``
    }
    </a>`
  );
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((item, i) => createFilterMarkup(item, i === 0)).join(`\n`);

  return (
    `<nav class="main-navigation">
      ${filtersMarkup}
    </nav>`
  );
};

export {createFilterTemplate};
