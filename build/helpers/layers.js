'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('conjunction-junction'),
    addAllItemsToArray = _require.addAllItemsToArray,
    removeAllItemsFromArray = _require.removeAllItemsFromArray,
    isObjectLiteral = _require.isObjectLiteral,
    immutableArraySplice = _require.immutableArraySplice,
    immutableArrayInsert = _require.immutableArrayInsert,
    subArrayByKey = _require.subArrayByKey;

var unPrefixLayers = exports.unPrefixLayers = function unPrefixLayers(layers, prefixesToKeep) {
  var pre2K = Array.isArray(prefixesToKeep) ? prefixesToKeep : [];
  var newLayerObj = {};
  layers.forEach(function (l) {
    var lSplit = l.split('__');
    var lFiltered = lSplit.filter(function (l, i) {
      return pre2K.includes(l) || pre2K.includes('' + l) || pre2K.includes(parseInt(l, 10)) || i === lSplit.length - 1; // always return the last segment
    });
    var lJoin = lFiltered.join('__');
    newLayerObj[lJoin] = true;
  });
  var newLayers = [];
  for (var k in newLayerObj) {
    newLayers.push(k);
  }
  newLayers.sort(); // this sorts by prefix, which is preferred in the UI
  return newLayers;
};

var groupLayersByUnit = exports.groupLayersByUnit = function groupLayersByUnit(layersThatHaveUnits, legendObject, indexUnits) {
  var layersGroupedByUnits = {};
  layersThatHaveUnits.forEach(function (key) {
    var thisUnit = !Array.isArray(legendObject[key]) ? 'units' : legendObject[key][indexUnits];

    if (!Array.isArray(layersGroupedByUnits[thisUnit])) {
      if (thisUnit !== 'units') {
        layersGroupedByUnits[thisUnit] = [];
      }
    }
    if (thisUnit !== 'units') {
      layersGroupedByUnits[thisUnit].push(key);
    }
  });

  // the array is so units can be sorted in a predictable order
  var layerUnitsArray = [];
  for (var unit in layersGroupedByUnits) {
    layerUnitsArray.push(unit);
    layersGroupedByUnits[unit].sort();
  }
  layerUnitsArray.sort();

  return {
    layersGroupedByUnits: layersGroupedByUnits,
    layerUnitsArray: layerUnitsArray
  };
};

var calcFirstLayerOnList = exports.calcFirstLayerOnList = function calcFirstLayerOnList(state) {
  // find the first layer listed, which is used to toggle a single layer on as a default condition if there is no preSet
  // if layers are supplied, just read the first one
  // if layers are not supplied (something else is wrong), but at least try to find a layer
  var layersGroupedByUnits = state.layersGroupedByUnits,
      layerUnitsArray = state.layerUnitsArray,
      layersThatHaveUnits = state.layersThatHaveUnits;

  var firstLayerOnList = Array.isArray(layersThatHaveUnits) ? layersThatHaveUnits[0] : !Array.isArray(layerUnitsArray) ? '' : !isObjectLiteral(layersGroupedByUnits) ? '' : !Array.isArray(layersGroupedByUnits[layerUnitsArray[0]]) ? '' : layersGroupedByUnits[layerUnitsArray[0]][0];
  return firstLayerOnList;
};

var toggleLayerGroup = exports.toggleLayerGroup = function toggleLayerGroup(state, groupOfLayers) {
  // add or remove an entire group of layer from the layers selected
  var action = !Array.isArray(state.layersSelected) ? 'new' : 'add';

  if (!Array.isArray(groupOfLayers)) {
    if (!Array.isArray(state.layersSelected)) {
      return [];
    } else {
      return state.layersSelected;
    }
  }

  var index = 0;
  while (action === 'add' && index < groupOfLayers.length) {
    action = state.layersSelected.includes(groupOfLayers[index]) ? 'remove' : 'add';
    index++;
  }

  var layersSelected = action === 'new' ? groupOfLayers : action === 'add' ? addAllItemsToArray(state.layersSelected, groupOfLayers) : action === 'remove' ? removeAllItemsFromArray(state.layersSelected, groupOfLayers) : state.layersSelected;

  return layersSelected;
};

var createLayerSelectorsInner = exports.createLayerSelectorsInner = function createLayerSelectorsInner(input) {
  var data = input.data,
      units = input.units,
      abbrevs = input.abbrevs,
      labels = input.labels;

  // always receiving dataType1Processed

  var oneUnit = data[0];

  var legendObject = {};
  var layersAllTemp = [];
  var layersThatHaveUnitsTemp = [];

  for (var layer in oneUnit) {
    var split = layer.split('__');
    var unPrefix = split[split.length - 1];
    layersAllTemp.push({ unPrefix: unPrefix, layer: layer });
    if (units[unPrefix]) {
      var prefixes = split.length > 1 ? split.slice(0, split.length - 1) : [];
      var prefixesFormatted = prefixes.length > 0 ? prefixes.join(' ') + ' ' : '';
      layersThatHaveUnitsTemp.push({ unPrefix: unPrefix, layer: layer });
      legendObject[layer] = ['' + prefixesFormatted + abbrevs[unPrefix], '' + prefixesFormatted + labels[unPrefix], units[unPrefix]];
    }
  }

  // sort by unprefixed layers so that like layers (e.g. "rain") are grouped, not like groups (e.g. "test 52")
  layersAllTemp.sort(function (a, b) {
    return a.unPrefix > b.unPrefix;
  });
  layersThatHaveUnitsTemp.sort(function (a, b) {
    return a.unPrefix > b.unPrefix;
  });
  var layersAllPrefixed = layersAllTemp.map(function (l) {
    return l.layer;
  });
  var layersThatHaveUnits = layersThatHaveUnitsTemp.map(function (l) {
    return l.layer;
  });

  return {
    layersThatHaveUnits: layersThatHaveUnits,
    layersAllPrefixed: layersAllPrefixed,
    legendObject: legendObject
  };
};

var createLayerSelectors = exports.createLayerSelectors = function createLayerSelectors(state) {
  var _createLayerSelectors = createLayerSelectorsInner({
    data: state.dataType1Processed,
    groups: state.groups,
    groupsSub: state.groupsSub,
    layersRawPrefixCount: state.layersRawPrefixCount,
    units: state.legendUnits,
    abbrevs: state.legendAbbrevs,
    labels: state.legendLabels
  }),
      layersThatHaveUnits = _createLayerSelectors.layersThatHaveUnits,
      layersAllPrefixed = _createLayerSelectors.layersAllPrefixed,
      legendObject = _createLayerSelectors.legendObject;

  var _groupLayersByUnit = groupLayersByUnit(layersThatHaveUnits, legendObject, state.indexUnits),
      layersGroupedByUnits = _groupLayersByUnit.layersGroupedByUnits,
      layerUnitsArray = _groupLayersByUnit.layerUnitsArray;

  return {
    layersThatHaveUnits: layersThatHaveUnits,
    layersAllPrefixed: layersAllPrefixed,
    legendObject: legendObject,
    layersGroupedByUnits: layersGroupedByUnits,
    layerUnitsArray: layerUnitsArray
  };
};

var createLayersSelected = exports.createLayersSelected = function createLayersSelected(key, layersSelected) {
  if (!key) return;
  var indexSelected = Array.isArray(layersSelected) ? layersSelected.findIndex(function (s) {
    return s === key;
  }) : -1;
  var newLayersSelected = indexSelected >= 0 ? immutableArraySplice(indexSelected, layersSelected) : // it is selected, so remove it
  immutableArrayInsert(null, layersSelected, key); // not selected, so add it
  if (!Array.isArray(layersSelected)) {
    // make sure at least 1 key is selected
    console.warn('No keys are selected. Cancelling');
    return;
  } else if (layersSelected.length <= 0) {
    console.warn('At least one key must be selected. Cancelling');
    return;
  }
  return newLayersSelected;
};

var createGroupByData = exports.createGroupByData = function createGroupByData(theKey, dataType1Raw) {
  // convert data type 1 to type 2
  if (!theKey) return;

  var _subArrayByKey = subArrayByKey(dataType1Raw, theKey),
      groupBy = _subArrayByKey.groupBy,
      arraysOfDataObjects = _subArrayByKey.arraysOfDataObjects,
      arrayOfDataGroups = _subArrayByKey.arrayOfDataGroups;

  return {
    dataType2Raw: arraysOfDataObjects,
    dataConvertFrom: 2,
    groupBy: groupBy,
    groups: arrayOfDataGroups,
    groupTrue: true
  };
};

var parseDefaultLayerSelection = exports.parseDefaultLayerSelection = function parseDefaultLayerSelection(state) {
  var firstLayerOnList = calcFirstLayerOnList(state);
  var layersSelected = createLayersSelected(firstLayerOnList, state.layersSelected);
  return {
    firstLayerOnList: firstLayerOnList,
    layersSelected: layersSelected
  };
};

// export default {
//   unPrefixLayers,
//   groupLayersByUnit,
//   calcFirstLayerOnList,
//   toggleLayerGroup,
//   createLayerSelectors,
//   createLayerSelectorsInner,
//   createLayersSelected,
//   createGroupByData,
//   parseDefaultLayerSelection,
// };