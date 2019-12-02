const EXTRA_TITLES = [`Top rated`, `Most commented`];

const createExtraListTemplate = () => {
  return EXTRA_TITLES.map((title) => {

    return (
      `<section class="films-list--extra">
        <h2 class="films-list__title">${title}</h2>

        <div class="films-list__container"></div>
      </section>`
    );
  })
  .join(`\n`);
};

export {createExtraListTemplate};
