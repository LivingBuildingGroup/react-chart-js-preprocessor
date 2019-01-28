const { isObjectLiteral } = require('conjunction-junction');

export const createGoogleTagManagerClass = (state, action) => {
  const _action = action ? action : state.graphName ;
  const preSetName = state.preSets && state.preSets[state.preSetIdActive] && state.preSets[state.preSetIdActive].name ? state.preSets[state.preSetIdActive].name : 'no-pre-set';
  const preSetArr = preSetName.split(' ');
  const preSetIdClass = preSetArr.join('-');
  const listOfEventsObj = isObjectLiteral(state.titleText) ? state.titleText : {} ;
  console.log('state.titleText in tracking', state.titleText);
  console.log('listOfEventsObj', listOfEventsObj);
  const listOfEventsArr = [];
  for(let id in listOfEventsObj){
    listOfEventsArr.push[id];
  }
  console.log('listOfEventsArr', listOfEventsArr);

  const listOfEventsId = listOfEventsArr.length > 0 ? listOfEventsArr.join('-') : 'no-events';
  const googleTagManagerClass = `gw-graph-catcher ${_action} ${preSetIdClass} ${listOfEventsId}`;
  return googleTagManagerClass;
};