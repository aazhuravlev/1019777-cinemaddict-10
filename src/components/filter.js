const createFilterMarkup = (filter) => {
  const {name, link, count} = filter;

  return (
    `<a href="#${link}" class="main-navigation__item${name === `All movies` ? ` main-navigation__item--active` : name === `Stats` ? ` main-navigation__item--additional` : ``}">${name}
    ${
    count !== `` ?
      `<span class="main-navigation__item-count">${count}</span>`
      : ``
    }
    </a>`
  )
}

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((item, i) => createFilterMarkup(item, i === 0)).join(`\n`);

  return (
    `<nav class="main-navigation">
      ${filtersMarkup}
    </nav>`
  );
};

export {createFilterTemplate};
