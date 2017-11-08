import { createSelector } from 'reselect';
import { deburrUpper } from 'app/utils';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import snakeCase from 'lodash/snakeCase';

const getCountries = state => state.countries;
const getAllIndicators = state => (state.data ? state.data.indicators : {});
const getCategories = state => (state.data ? state.data.categories : {});
const getSectors = state => (state.data ? state.data.sectors : {});
const getSearch = state => deburrUpper(state.search);

export const parseIndicatorsDefs = createSelector(
  [getAllIndicators, getCategories, getCountries],
  (indicators, categories, countries) => {
    if (!indicators || !categories || !countries) return null;
    const parsedIndicators = {};
    Object.keys(categories).forEach(category => {
      const categoryIndicators = indicators.filter(
        indicator => indicator.category_ids.indexOf(parseInt(category, 10)) > -1
      );
      const parsedDefinitions = categoryIndicators.map(def => {
        const descriptions = countries.map(country => ({
          iso: country,
          value: def.locations[country] ? def.locations[country][0].value : null
        }));
        return {
          title: def.name,
          slug: def.slug,
          descriptions
        };
      });
      if (parsedDefinitions && parsedDefinitions.length) {
        parsedIndicators[category] = sortBy(parsedDefinitions, 'title');
      }
    });
    return parsedIndicators;
  }
);

export const groupIndicatorsByCategory = createSelector(
  [getAllIndicators, getCategories],
  (indicators, categories) => {
    if (!indicators || !categories) return null;
    return Object.keys(categories)
      .map(cat => ({
        ...categories[cat],
        indicators: indicators.filter(
          ind => ind.category_ids.indexOf(parseInt(cat, 10)) > -1
        )
      }))
      .filter(cat => cat.indicators.length);
  }
);

export const getCategoriesWithSectors = createSelector(
  [groupIndicatorsByCategory],
  categories => {
    if (!categories) return null;
    return categories.map(cat => {
      const sectorIds = [];
      cat.indicators.forEach(ind => {
        Object.keys(ind.locations).forEach(location => {
          ind.locations[location].forEach(
            value => value.sector_id && sectorIds.push(value.sector_id)
          );
        });
      });
      return {
        ...cat,
        sectors: sectorIds.length ? uniq(sectorIds) : null
      };
    });
  }
);

export const parsedCategoriesWithSectors = createSelector(
  [getCategoriesWithSectors, getSectors, getCountries],
  (categories, sectors, countries) => {
    if (!categories) return null;
    return sortBy(
      categories.map(cat => {
        const sectorsParsed = sortBy(
          cat.sectors &&
            cat.sectors.length &&
            cat.sectors.map(sec => {
              const definitions = sortBy(
                cat.indicators.map(ind => {
                  const descriptions = countries.map(loc => {
                    const value = ind.locations[loc]
                      ? ind.locations[loc].find(v => v.sector_id === sec)
                      : null;
                    return {
                      iso: loc,
                      value: value ? value.value : '—'
                    };
                  });
                  return {
                    title: ind.name,
                    slug: ind.slug,
                    descriptions
                  };
                }),
                'title'
              );
              return {
                title: sectors[sec].name,
                slug: snakeCase(sectors[sec].name),
                definitions
              };
            }),
          'title'
        );
        return {
          title: cat.name,
          slug: cat.slug,
          sectors: sectorsParsed
        };
      }),
      'title'
    );
  }
);

export const getNDCs = createSelector(
  [getCategories, parseIndicatorsDefs],
  (categories, indicators) => {
    if (!categories) return null;
    const ndcs = Object.keys(categories).map(category => ({
      title: categories[category].name,
      slug: categories[category].slug,
      definitions: indicators[category] ? indicators[category] : []
    }));
    return ndcs;
  }
);

export const filterNDCs = createSelector(
  [getNDCs, getSearch],
  (ndcs, search) => {
    if (!ndcs) return null;
    const filteredNDCs = ndcs.map(ndc => {
      const defs = ndc.definitions.filter(
        def =>
          deburrUpper(def.title).indexOf(search) > -1 ||
          deburrUpper(def.descriptions[0].value).indexOf(search) > -1
      );

      return {
        ...ndc,
        definitions: defs
      };
    });
    const reducedNDCs = filteredNDCs.filter(ndc => ndc.definitions.length > 0);
    return sortBy(reducedNDCs, 'title');
  }
);

export const filterSectoralNDCs = createSelector(
  [parsedCategoriesWithSectors, getSearch],
  (ndcs, search) => {
    if (!ndcs) return null;
    if (!search) return ndcs;
    const filteredNDCs = [];
    ndcs.forEach(ndc => {
      const sectors = [];
      ndc.sectors.forEach(sec => {
        const definitions = sec.definitions.filter(
          def =>
            deburrUpper(def.title).indexOf(search) > -1 ||
            deburrUpper(def.descriptions[0].value).indexOf(search) > -1
        );
        if (definitions.length) {
          sectors.push({
            ...sec,
            definitions
          });
        }
      });
      if (sectors.length) {
        filteredNDCs.push({
          ...ndc,
          sectors
        });
      }
    });
    return filteredNDCs;
  }
);

export default {
  filterNDCs,
  filterSectoralNDCs
};
