import { createSelector } from 'reselect';
import { scaleLinear } from 'd3-scale';
import worldPaths from 'app/data/world-50m-paths';

const getNdcsSdgsGoalsData = state => state.goalsData || null;
const getGoalSelected = state => state.goalSelected || null;
const getGoalHover = state => state.goalHover || null;
const getTargetHover = state => state.targetHover || null;

const initialStep = '#d3d3dc';
let colorScale;
function setScaleBuckets(range) {
  colorScale = scaleLinear()
    .domain([0, 1])
    .range(range);
}

export const getNdcsSdgsGoalsDataSelected = createSelector(
  [getNdcsSdgsGoalsData, getGoalSelected, getGoalHover],
  (data, goalSelected, goalHover) => {
    if (!data) return null;
    if (goalHover) return data[goalHover - 1];
    return goalSelected ? data[goalSelected - 1] : data[0];
  }
);

export const getPathsWithStyles = createSelector(
  [getNdcsSdgsGoalsDataSelected, getTargetHover],
  (data, targetHover) => {
    if (!data) return worldPaths;
    setScaleBuckets([initialStep, data.colour]);
    return worldPaths.map(path => {
      let color = '#E5E5EB'; // default color
      if (data && data.locations && data.locations[path.id]) {
        let percentage = data.locations[path.id].length / data.targets.length;
        if (targetHover) {
          percentage = data.locations[path.id].includes(targetHover) ? 1 : 0;
        }
        color = colorScale(percentage);
      }
      const style = {
        default: {
          fill: color,
          stroke: '#000',
          strokeWidth: 0.05,
          outline: 'none'
        },
        hover: {
          fill: color,
          stroke: '#000',
          strokeWidth: 0.05,
          outline: 'none'
        },
        pressed: {
          fill: color,
          stroke: '#000',
          strokeWidth: 0.5,
          outline: 'none'
        }
      };

      return {
        ...path,
        style
      };
    });
  }
);

export default {
  getPathsWithStyles
};