import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import groupBy from 'lodash/groupBy';

const getIso = state => state.iso || null;
const getTimeline = state => state.timeline || null;

export const getDates = createSelector(
  [getIso, getTimeline],
  (iso, timeline) => {
    const { data } = timeline;
    if (isEmpty(data) || !data[iso]) return null;
    const documents = [];
    uniqBy(data[iso], 'link').forEach(d => {
      if (d.date) {
        documents.push({
          year: d.date.split('-')[0],
          link: d.link,
          label: d.label
        });
      }
    });
    // add year 2020 as due date for new NDCS submissions
    documents.push({
      year: '2020',
      link: null,
      label: 'new NDCS submissions due date'
    });
    return groupBy(documents, 'year');
  }
);

export default {
  getDates
};
