'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('conjunction-junction'),
    isObjectLiteral = _require.isObjectLiteral;

var _require2 = require('./palettes'),
    listBright = _require2.listBright,
    createPreSetGlobalPalettes = _require2.createPreSetGlobalPalettes;

var formatSelectors = exports.formatSelectors = function formatSelectors(thisPreSet, groupTrue, groupsRaw) {
  var groups = Array.isArray(groupsRaw) ? groupsRaw : [];
  var selectors = [''];
  if (Array.isArray(thisPreSet.layersSelected)) {
    if (thisPreSet.layersSelected.length > 0) {
      if (thisPreSet.type === 'group') {
        if (groupTrue) {
          selectors = [];
          thisPreSet.layersSelected.forEach(function (layer) {
            groups.forEach(function (group) {
              selectors.push(group + '__' + layer);
            });
          });
        } else {
          selectors = thisPreSet.layersSelected;
        }
      } else {
        selectors = thisPreSet.layersSelected;
      }
    }
  }
  var selectorsRemaining = selectors.length <= 1 ? [] : selectors.slice(1, selectors.length);

  return { selectors: selectors, selectorsRemaining: selectorsRemaining };
};

var _validateFormatAllStylesInput = exports._validateFormatAllStylesInput = function _validateFormatAllStylesInput(input) {
  if (!isObjectLiteral(input)) {
    return 'input is not an object';
  }
  var thisPreSet = input.thisPreSet,
      styles = input.styles,
      groups = input.groups,
      groupsSub = input.groupsSub,
      layersAllPrefixed = input.layersAllPrefixed;

  if (!Array.isArray(layersAllPrefixed)) {
    return 'layersAllPrefixed is not an array';
  }
  var noString = void 0;
  layersAllPrefixed.forEach(function (l, i) {
    if (typeof l !== 'string') {
      noString = 'layersAllPrefixed item ' + l + ' at index ' + i + ' is not a string';
    }
  });
  if (noString) return noString;
  if (!Array.isArray(groups)) {
    return 'groups is not an array';
  }
  if (!Array.isArray(groupsSub)) {
    return 'groupsSub is not an array';
  }
  if (!isObjectLiteral(thisPreSet)) {
    return 'thisPreSet is not an object';
  }
  if (!isObjectLiteral(styles)) {
    return 'styles is not an object';
  }
  return 'ok';
};

var parseGroupsFromLayer = exports.parseGroupsFromLayer = function parseGroupsFromLayer(layer, groups, groupsSub) {
  var group = void 0,
      groupSub = void 0;
  groups.forEach(function (g) {
    if (layer.includes(g + '__')) {
      group = g;
    }
  });
  groupsSub.forEach(function (s) {
    if (layer.includes(s + '__')) {
      groupSub = s;
    }
  });
  var g = group ? '' + group : '';
  var g_ = g ? g + '__' : '';
  var s = groupSub ? '' + groupSub : '';
  var s_ = s ? s + '__' : '';
  return { g: g, g_: g_, s: s, s_: s_ };
};

var selectBestStyleMatch = exports.selectBestStyleMatch = function selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_) {
  var preSetStyle = isObjectLiteral(thisPreSet.styles) ? thisPreSet.styles : {};
  var s = isObjectLiteral(preSetStyle[layer]) ? Object.assign({}, preSetStyle[layer]) : isObjectLiteral(preSetStyle[unPrefix]) ? Object.assign({}, preSetStyle[unPrefix]) : isObjectLiteral(preSetStyle['' + g_ + s_ + layer]) ? Object.assign({}, preSetStyle['' + g_ + s_ + layer]) : isObjectLiteral(preSetStyle['' + g_ + layer]) ? Object.assign({}, preSetStyle['' + g_ + layer]) : isObjectLiteral(preSetStyle['' + s_ + layer]) ? Object.assign({}, preSetStyle['' + s_ + layer]) : isObjectLiteral(styles[layer]) ? Object.assign({}, styles[layer]) : isObjectLiteral(styles[unPrefix]) ? Object.assign({}, styles[unPrefix]) : { style: {} };
  // make nested style consistent
  s.style = isObjectLiteral(s.style) ? s.style : {};
  return s;
};

var selectBestColorMatch = exports.selectBestColorMatch = function selectBestColorMatch(thisStyle, newGroupColors, preSetGlobalPalettes, shade, group) {
  var color = isObjectLiteral(thisStyle) ? thisStyle.color : '80, 80, 80';
  // type check newGroupColors
  var ngc = isObjectLiteral(newGroupColors) ? newGroupColors : {};
  var psgp = isObjectLiteral(preSetGlobalPalettes) ? preSetGlobalPalettes : {};
  // worst case, this is undefined, if undefined, we just skip the lookup
  var groupColor = ngc[group];
  if (groupColor) {
    if (psgp[groupColor]) {
      // shade is 1-indexed for the user
      // change shade to 0-index for JS
      if (shade >= 0 && psgp[groupColor][shade - 1]) {
        color = psgp[groupColor][shade - 1];
      }
    }
  }
  color = color ? color : '80, 80, 80';
  return color;
};

var formatAllStyles = exports.formatAllStyles = function formatAllStyles(input) {
  var layersAllPrefixed = input.layersAllPrefixed,
      groups = input.groups,
      groupsSub = input.groupsSub,
      styles = input.styles,
      thisPreSet = input.thisPreSet,
      newGroupColors = input.newGroupColors,
      preSetGlobalPalettes = input.preSetGlobalPalettes;


  var validated = _validateFormatAllStylesInput(input);
  if (validated !== 'ok') return { message: validated };

  var theseStyles = {};

  layersAllPrefixed.forEach(function (layer) {
    // double underscore denotes prefix
    var unPrefixedArr = layer.split('__');
    // un-prefixed layer is LAST part after last double-underscore.  We can have multiple prefixes.
    // e.g. "layer" >> "layer" ; "A__layer" >> "layer" ; "53__A__layer" >> "layer"
    var unPrefix = unPrefixedArr[unPrefixedArr.length - 1];

    var _parseGroupsFromLayer = parseGroupsFromLayer(layer, groups, groupsSub),
        g = _parseGroupsFromLayer.g,
        g_ = _parseGroupsFromLayer.g_,
        s = _parseGroupsFromLayer.s,
        s_ = _parseGroupsFromLayer.s_;

    var thisStyle = selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_);
    var shade = !isObjectLiteral(thisStyle.style) ? 0 : thisStyle.style.shade > 0 ? thisStyle.style.shade : 0;
    thisStyle.color = selectBestColorMatch(thisStyle, newGroupColors, preSetGlobalPalettes, shade, g);
    theseStyles[layer] = thisStyle;
  });

  return theseStyles;
};

var prioritizeGroups = exports.prioritizeGroups = function prioritizeGroups(groups, groupColors) {
  var gc = isObjectLiteral(groupColors) ? groupColors : {};

  // list priorities
  // in the event of conflicts, the first request in the ordered array 'groups' is given first priority
  // if group color not already used
  var gcPriority = {};
  groups.forEach(function (g) {
    if (gc[g] && !gcPriority[gc[g]]) {
      gcPriority[gc[g]] = g;
    }
  });

  // sort groups according to priority
  var groups1 = [];
  var groups2 = [];
  groups.forEach(function (g) {
    if (gcPriority[gc[g]] === g) {
      groups1.push(g);
    } else {
      groups2.push(g);
    }
  });

  return {
    groupsPrioritized: [].concat(groups1, groups2),
    gc: gc,
    gcPriority: gcPriority
  };
};

var assignPreSetGroupColors = exports.assignPreSetGroupColors = function assignPreSetGroupColors(input) {
  var groups = input.groups,
      groupColors = input.groupColors,
      preSetGlobalColorOptions = input.preSetGlobalColorOptions,
      preSetGlobalPalettes = input.preSetGlobalPalettes;


  var defaultReturn = {
    newGroupColors: {},
    groupDotColors: {}
  };
  if (!Array.isArray(groups)) return defaultReturn;

  var psgpFromUser = isObjectLiteral(preSetGlobalPalettes) ? preSetGlobalPalettes : {};
  var psgp = Object.assign({}, createPreSetGlobalPalettes(), psgpFromUser);
  var psgco = Array.isArray(preSetGlobalColorOptions) ? preSetGlobalColorOptions : listBright();

  var defaultColor = '80, 80, 80';
  var colorsUsed = {};
  var newGroupColors = {};
  var groupDotColors = {};

  var _prioritizeGroups = prioritizeGroups(groups, groupColors),
      gc = _prioritizeGroups.gc,
      gcPriority = _prioritizeGroups.gcPriority,
      groupsPrioritized = _prioritizeGroups.groupsPrioritized;

  var _useSpecifiedColor = function _useSpecifiedColor(_group) {
    // LOCAL MUTATING FUNCTION
    colorsUsed[gc[_group]] = true;
    newGroupColors[_group] = gc[_group];
    groupDotColors[_group] = Array.isArray(psgp[newGroupColors[_group]]) ? psgp[newGroupColors[_group]][0] : defaultColor;
  };

  var _useDefaultColor = function _useDefaultColor(_group, _color) {
    // LOCAL MUTATING FUNCTION
    if (!colorsUsed[_color]) {
      colorsUsed[_color] = true;
      newGroupColors[_group] = _color;
      groupDotColors[_group] = Array.isArray(psgp[newGroupColors[_group]]) ? psgp[newGroupColors[_group]][0] : defaultColor;
    }
  };

  // these run in priority order, so we don't need to check for priority during the loop
  groupsPrioritized.forEach(function (group) {
    // if we did supply a group color
    if (gc[group]) {
      // prioritized fill up colors used first
      if (!colorsUsed[gc[group]]) {
        _useSpecifiedColor(group);
        // else if group color is already used (priority is used first)
      } else {
        psgco.forEach(function (color) {
          if (!newGroupColors[group]) {
            _useDefaultColor(group, color);
          }
        });
      }
      // we did not supply a group color
    } else {
      psgco.forEach(function (color) {
        if (!newGroupColors[group]) {
          _useDefaultColor(group, color);
        }
      });
    }
  });
  return {
    testKeys: {
      gcPriority: gcPriority,
      colorsUsed: colorsUsed
    },
    newGroupColors: newGroupColors,
    groupDotColors: groupDotColors
  };
};

var formatGroupsStyles = exports.formatGroupsStyles = function formatGroupsStyles(input) {
  var groupTrue = input.groupTrue,
      groups = input.groups,
      groupColors = input.groupColors,
      groupsSub = input.groupsSub,
      preSetGlobalColorOptions = input.preSetGlobalColorOptions,
      preSetGlobalPalettes = input.preSetGlobalPalettes,
      layersAllPrefixed = input.layersAllPrefixed,
      styles = input.styles,
      thisPreSet = input.thisPreSet;

  console.log('input to formatGroupsStyles', styles);
  console.log('isGrouped', isGrouped, 'thisPreset', thisPreSet);
  var isGrouped = groupTrue && Array.isArray(groups);

  var defaultObject = {
    stylesAppended: styles || {},
    newGroupColors: {},
    groupDotColors: {}
  };
  if (!isObjectLiteral(thisPreSet)) {
    // i.e. no material to read from
    return defaultObject;
  } else if (!isObjectLiteral(thisPreSet.styles)) {
    // i.e. no material to read from
    return defaultObject;
  } else if (!isGrouped && thisPreSet.useOnlyExplicitStylesWhenUngrouped) {
    // preSets may declare that when not grouped, ONLY explicit styles shall be used
    // this allows preSets to save specific styles for individual graphs
    // but when grouped, styles are overwritten by group styles
    // in either case, layers selected remain the same
    defaultObject.stylesAppended = Object.assign({}, defaultObject.stylesAppended, thisPreSet.styles);
    return defaultObject;
  }

  var _assignPreSetGroupCol = assignPreSetGroupColors({
    groups: groups,
    groupColors: groupColors,
    preSetGlobalPalettes: preSetGlobalPalettes,
    preSetGlobalColorOptions: preSetGlobalColorOptions
  }),
      newGroupColors = _assignPreSetGroupCol.newGroupColors,
      groupDotColors = _assignPreSetGroupCol.groupDotColors;

  var stylesAppended = formatAllStyles({
    groups: groups,
    groupsSub: groupsSub,
    newGroupColors: newGroupColors,
    preSetGlobalPalettes: preSetGlobalPalettes,
    layersAllPrefixed: layersAllPrefixed,
    styles: styles,
    thisPreSet: thisPreSet
  });

  return {
    newGroupColors: newGroupColors,
    groupDotColors: groupDotColors,
    stylesAppended: stylesAppended
  };
};

var unpackPreSet = exports.unpackPreSet = function unpackPreSet(state, thisPreSet, id) {
  var groupTrue = state.groupTrue,
      groups = state.groups,
      groupColors = state.groupColors,
      groupsSub = state.groupsSub,
      preSetGlobalPalettes = state.preSetGlobalPalettes,
      preSetGlobalColorOptions = state.preSetGlobalColorOptions,
      layersAllPrefixed = state.layersAllPrefixed,
      styles = state.styles;

  console.log('state in unpackPreSet', state);

  var _formatSelectors = formatSelectors(thisPreSet, groupTrue, groups),
      selectorsRemaining = _formatSelectors.selectorsRemaining,
      selectors = _formatSelectors.selectors;

  var _formatGroupsStyles = formatGroupsStyles({
    thisPreSet: thisPreSet,
    groupTrue: groupTrue,
    groups: groups,
    groupsSub: Array.isArray(groupsSub) ? groupsSub : [''],
    groupColors: groupColors,
    preSetGlobalColorOptions: preSetGlobalColorOptions,
    preSetGlobalPalettes: preSetGlobalPalettes,
    styles: styles,
    layersAllPrefixed: layersAllPrefixed
  }),
      stylesAppended = _formatGroupsStyles.stylesAppended,
      newGroupColors = _formatGroupsStyles.newGroupColors,
      groupDotColors = _formatGroupsStyles.groupDotColors;

  // this prefixes as determined by state, i.e. parent
  // this does not allow individual presets to decide what to prefix (see above)


  var prefixesToKeepGroups = !Array.isArray(state.groups) ? [] : !state.preSetSaveSettings ? [] : !state.preSetSaveSettings.prefixGroups ? [] : state.groups;

  var prefixesToKeepGroupsSub = !Array.isArray(state.groupsSub) ? [] : !state.preSetSaveSettings ? [] : !state.preSetSaveSettings.prefixGroupsSub ? [] : state.groupsSub;

  return {
    groupColors: newGroupColors,
    groupDotColors: groupDotColors,
    preSetIdActive: id,
    selector0: selectors[0],
    layersSelected: selectorsRemaining,
    styles: stylesAppended,
    prefixesToKeepGroups: prefixesToKeepGroups,
    prefixesToKeepGroupsSub: prefixesToKeepGroupsSub
  };
};

var selectDefaultPreSet = exports.selectDefaultPreSet = function selectDefaultPreSet(preSets, graphName) {
  var preSetIdActive = void 0;
  for (var id in preSets) {
    if (preSets[id].graph === graphName && preSets[id].def) {
      preSetIdActive = id;
    }
  }
  if (preSetIdActive) return preSetIdActive;
  // worst case, no default and id list didn't load yet

  for (var _id in preSets) {
    if (preSets[_id].graph === graphName) {
      preSetIdActive = _id;
    }
  }

  return preSetIdActive;
};

// export default {
//   formatSelectors,
//   _validateFormatAllStylesInput,
//   parseGroupsFromLayer,
//   selectBestStyleMatch,
//   selectBestColorMatch,
//   formatAllStyles,
//   assignPreSetGroupColors,
//   formatGroupsStyles,
//   unpackPreSet,
//   selectDefaultPreSet,
// };