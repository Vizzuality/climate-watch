import { createSelector } from 'reselect';
import { deburrUpper } from 'app/utils';
import upperFirst from 'lodash/upperFirst';

const getSectors = state => state.sectors || null;
const getTargets = state => state.targets || null;
const getGoals = state => state.goals || null;
const getQuery = state => state.query || null;
const getSearch = state => state.search || null;

export const getQueryUpper = state => deburrUpper(state.query);

export const getSectorsMapped = createSelector([getSectors], sectors => {
  if (!sectors) return [];
  return sectors.map(sector => ({
    label: upperFirst(sector.name),
    value: sector.id.toString(),
    groupId: 'sector'
  }));
});

export const getGoalsMapped = createSelector([getGoals], goals => {
  if (!goals) return [];
  return goals.map(goal => ({
    label: `SDG ${goal.number}: ${goal.title}`,
    value: goal.number,
    groupId: 'goal'
  }));
});

export const getTargetsMapped = createSelector([getTargets], targets => {
  if (!targets) return [];
  return targets.map(target => ({
    label: `${target.number}: ${target.title}`,
    value: target.number,
    groupId: 'target'
  }));
});

export const getSearchList = createSelector(
  [getSectorsMapped, getGoalsMapped, getTargetsMapped, getQuery],
  (sectors, goals, targets, query) => {
    const searchOptions = [];
    if (query) {
      searchOptions.push({
        label: `Search for "${query}" in the document`,
        value: query,
        groupId: 'query'
      });
    }
    return searchOptions.concat(sectors, goals, targets);
  }
);

export const getOptionSelected = createSelector(
  [getSearchList, getSearch],
  (options, search) => {
    if (!options || !search) return null;
    if (search.searchBy === 'query') {
      return {
        label: search.query,
        value: search.query
      };
    }
    return options.find(option => option.value === search.query);
  }
);

export default {
  getQueryUpper,
  getSearchList,
  getOptionSelected
};
