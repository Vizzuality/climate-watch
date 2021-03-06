import { createSelector } from 'reselect';
import { snakeCase, uniq } from 'lodash';

const getData = kvt => kvt.state.keyVisualizations.data;
const getTagsSelection = kvt =>
  (kvt.search.tags && kvt.search.tags.split(',')) || null;
const getTopicSelection = kvt => kvt.search.topic || null;
const getGeographiesSelection = kvt =>
  (kvt.search.geographies && kvt.search.geographies.split(',')) || null;
const getVisualizationSelection = kvt => kvt.search.visualization || null;

export const dropdownOption = label => ({
  label,
  value: snakeCase(label)
});

export const getFormattedKeyVisualizations = createSelector(getData, data => {
  if (!data) return [];

  return data.map(item => {
    const copy = Object.assign({}, item);
    copy.geographies = item.geographies.map(label => dropdownOption(label));
    copy.tags = item.tags.map(label => dropdownOption(label));
    copy.topic = dropdownOption(copy.topic);

    return copy;
  });
});

export const getTagOptions = createSelector(getData, data => {
  if (!data || data.length === 0) return [];

  const options = uniq(data.reduce((acc, cur) => acc.concat(cur.tags), [])).map(
    dropdownOption
  );

  const allOption = {
    label: 'All Tags',
    value: 'all',
    expandsTo: options.map(option => option.value)
  };

  return [allOption, ...options];
});

export const getTopicOptions = createSelector(getData, data => {
  if (!data) return [];

  return uniq(data.reduce((acc, cur) => acc.concat([cur.topic]), [])).map(
    dropdownOption
  );
});

export const getTagsSelected = createSelector(
  [getTagOptions, getTagsSelection],
  (tags, selected) => {
    if (!tags || tags.length === 0) return [];
    if (!selected) return [tags.find(tag => tag.value === 'all')];
    return tags.filter(t => selected.indexOf(t.value) !== -1);
  }
);

export const getTopicSelected = createSelector(
  [getTopicOptions, getTopicSelection],
  (topics, selected) => {
    if (!topics || !selected) return null;
    return topics.find(topic => topic.value === selected);
  }
);

export const getGeographyOptions = createSelector(getData, data => {
  if (!data || data.length === 0) return [];

  const options = uniq(
    data.reduce((acc, cur) => acc.concat(cur.geographies), [])
  ).map(dropdownOption);

  const allOption = {
    label: 'All Geographies',
    value: 'all',
    expandsTo: options.map(option => option.value)
  };

  return [allOption, ...options];
});

export const getGeographiesSelected = createSelector(
  [getGeographyOptions, getGeographiesSelection],
  (geos, selected) => {
    if (!geos || geos.length === 0) return [];
    if (!selected) return [geos.find(geo => geo.value === 'all')];
    return geos.filter(g => selected.indexOf(g.value) !== -1);
  }
);

export const getVisualizationSelected = createSelector(
  [getFormattedKeyVisualizations, getVisualizationSelection],
  (visualizations, selected) => {
    if (!visualizations) return null;
    if (!selected) return null;
    return visualizations.find(
      visualization => visualization.id === parseInt(selected, 10)
    );
  }
);
