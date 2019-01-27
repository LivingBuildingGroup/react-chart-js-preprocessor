const { isObjectLiteral } = require('conjunction-junction');

export const createGoogleTagManagerClass = (state, action) => {
  const _action = action ? action : state.graphName ;
  const preSetName = state.preSets && state.preSets[state.preSetIdActive] && state.preSets[state.preSetIdActive].name ? state.preSets[state.preSetIdActive].name : 'no-pre-set';
  const preSetIdClass = preSetName.join('-');
  const listOfEventsObj = isObjectLiteral(state.titleText) ? state.titleText : {} ;
  let listOfEventsArr = [];
  for(let id in listOfEventsObj){
    listOfEventstate.push[id];
  }
  const listOfEventsId = listOfEventsArr.length > 0 ? listOfEventsArr.join('-') : 'no-events';
  const googleTagManagerClass = `gw-graph-catcher ${_action} ${preSetIdClass} ${listOfEventsId}`;
  return googleTagManagerClass;
};