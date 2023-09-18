'use strict';

var _require = require('conjunction-junction'),
  addAllItemsToArray = _require.addAllItemsToArray,
  removeAllItemsFromArray = _require.removeAllItemsFromArray,
  immutableArraySplice = _require.immutableArraySplice,
  immutableArrayInsert = _require.immutableArrayInsert;
var unPrefixLayers = function unPrefixLayers(layers, prefixesToKeep) {
  var pre2K = Array.isArray(prefixesToKeep) ? prefixesToKeep : [];
  var newLayerObj = {};
  layers.forEach(function (l) {
    var lSplit = l.split('__');
    var lFiltered = lSplit.filter(function (l, i) {
      return pre2K.includes(l) || pre2K.includes("".concat(l)) || pre2K.includes(parseInt(l, 10)) || i === lSplit.length - 1; // always return the last segment
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
var groupLayersByUnit = function groupLayersByUnit(layersThatHaveUnits, legendHash) {
  var layersGroupedByUnits = {};
  layersThatHaveUnits.forEach(function (key) {
    var thisUnit = legendHash[key] && legendHash[key].u ? legendHash[key].u : 'units';
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
var createLayersSelectedByGroup = function createLayersSelectedByGroup(layersSelected, groupOfLayers) {
  // add or remove an entire group of layer from the layers selected
  var action = !Array.isArray(layersSelected) ? 'new' : 'add';
  if (!Array.isArray(groupOfLayers)) {
    if (!Array.isArray(layersSelected)) {
      return [];
    } else {
      return layersSelected;
    }
  }
  var index = 0;
  while (action === 'add' && index < groupOfLayers.length) {
    action = layersSelected.includes(groupOfLayers[index]) ? 'remove' : 'add';
    index++;
  }
  var newLayersSelected = action === 'new' ? groupOfLayers : action === 'add' ? addAllItemsToArray(layersSelected, groupOfLayers) : action === 'remove' ? removeAllItemsFromArray(layersSelected, groupOfLayers) : layersSelected;
  return newLayersSelected;
};
var createLayersSelectedWithOneLayerFlipped = function createLayersSelectedWithOneLayerFlipped(layerSelected, layersSelected) {
  if (!layerSelected) {
    return layersSelected;
  }
  if (layerSelected === 'de-select-all') {
    return [];
  }
  var indexSelected = Array.isArray(layersSelected) ? layersSelected.findIndex(function (s) {
    return s === layerSelected;
  }) : -1;
  var newLayersSelected = indexSelected >= 0 ? immutableArraySplice(indexSelected, layersSelected) :
  // it is selected, so remove it
  immutableArrayInsert(null, layersSelected, layerSelected); // not selected, so add it
  if (!Array.isArray(newLayersSelected) || newLayersSelected.length <= 0) {
    // make sure at least 1 layerSelected is selected
    // eslint-disable-next-line no-console
    console.warn('No layers are selected. Cancelling');
    return;
  }
  return newLayersSelected;
};
var createLayerSelectorsInner = function createLayerSelectorsInner(input) {
  var data = input.data,
    legendHash = input.legendHash;
  var oneUnit = data[0]; // always receiving dataType1
  // console.log({oneUnit});
  var _legendHash = {};
  var layersAllTemp = [];
  var layersThatHaveUnitsTemp = [];
  var layersThatHaveNoUnitsHash = {};
  for (var layerName in oneUnit) {
    var split = layerName.split('__');
    var unPrefix = split[split.length - 1];
    layersAllTemp.push({
      unPrefix: unPrefix,
      layerName: layerName
    });
    var thisLayerInHash = legendHash[unPrefix];
    // console.log({layerName, split, unPrefix, thisLayerInHash});
    if (thisLayerInHash) {
      if (!thisLayerInHash.l) {
        thisLayerInHash.l = layerName;
      }
      if (!thisLayerInHash.a) {
        thisLayerInHash.a = thisLayerInHash.l;
      }
      if (!thisLayerInHash.d) {
        thisLayerInHash.d = thisLayerInHash.l;
      }
      if (!thisLayerInHash.u) {
        thisLayerInHash.u = 'none';
      }
      var prefixes = split.length > 1 ? split.slice(0, split.length - 1) : [];
      var prefixesFormatted = prefixes.length > 0 ? "".concat(prefixes.join(' '), " ") : '';
      layersThatHaveUnitsTemp.push({
        unPrefix: unPrefix,
        layerName: layerName
      });
      _legendHash[layerName] = {
        l: "".concat(prefixesFormatted).concat(thisLayerInHash.l),
        a: "".concat(prefixesFormatted).concat(thisLayerInHash.a),
        u: thisLayerInHash.u,
        d: "".concat(prefixesFormatted).concat(thisLayerInHash.d)
      };
    } else {
      layersThatHaveNoUnitsHash[unPrefix] = true;
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
    return l.layerName;
  });
  var layersThatHaveUnits = layersThatHaveUnitsTemp.map(function (l) {
    return l.layerName;
  });
  var layersThatHaveNoUnits = [];
  for (var l in layersThatHaveNoUnitsHash) {
    layersThatHaveNoUnits.push(l);
  }
  return {
    layersThatHaveUnits: layersThatHaveUnits,
    layersAllPrefixed: layersAllPrefixed,
    legendHash: legendHash
  };
};
var createLayerSelectors = function createLayerSelectors(gs, _legendHash) {
  var _createLayerSelectors = createLayerSelectorsInner({
      data: gs.dataType1,
      groups: gs.groups,
      groupsSub: gs.groupsSub,
      legendHash: _legendHash
    }),
    layersThatHaveUnits = _createLayerSelectors.layersThatHaveUnits,
    layersThatHaveNoUnits = _createLayerSelectors.layersThatHaveNoUnits,
    layersAllPrefixed = _createLayerSelectors.layersAllPrefixed,
    legendHash = _createLayerSelectors.legendHash;

  // console.log({layersThatHaveUnits, // all layers with units, available for selection
  //   layersThatHaveNoUnits,
  //   layersAllPrefixed,      // all layers, regardless of unit or selection capability, such as ids and timestamps
  //   legendHash,});

  var _groupLayersByUnit = groupLayersByUnit(layersThatHaveUnits, legendHash),
    layersGroupedByUnits = _groupLayersByUnit.layersGroupedByUnits,
    layerUnitsArray = _groupLayersByUnit.layerUnitsArray;

  // console.log({layersGroupedByUnits, layerUnitsArray})
  return {
    layersThatHaveUnits: layersThatHaveUnits,
    layersThatHaveNoUnits: layersThatHaveNoUnits,
    layersAllPrefixed: layersAllPrefixed,
    legendHash: legendHash,
    layersGroupedByUnits: layersGroupedByUnits,
    layerUnitsArray: layerUnitsArray
  };
};
module.exports = {
  unPrefixLayers: unPrefixLayers,
  groupLayersByUnit: groupLayersByUnit,
  createLayersSelectedByGroup: createLayersSelectedByGroup,
  createLayersSelectedWithOneLayerFlipped: createLayersSelectedWithOneLayerFlipped,
  createLayerSelectors: createLayerSelectors,
  createLayerSelectorsInner: createLayerSelectorsInner
};