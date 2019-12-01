const filterNames = [
  `All movies`, `Watchlist`, `History`, `Favorites`, `Stats`
];

const FILTER_MAX_VALUE = 20;

const generateFilters = () => {
  return filterNames.map((it) => {
    return {
      name: it,
      link: it.slice(0, it.includes(' ') ? it.indexOf(' ') : it.length).toLowerCase(),
      count: it.includes(filterNames[0]) ? `` : it.includes(filterNames[4]) ? `` : Math.floor(Math.random() * FILTER_MAX_VALUE)
    };
  });
};

export {generateFilters};
