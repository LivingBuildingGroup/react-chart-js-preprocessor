'use strict';

var _require = require('conjunction-junction'),
  isObjectLiteral = _require.isObjectLiteral;
var _require2 = require('pretty-colors'),
  listBright = _require2.listBright,
  createPresetGlobalPalettes = _require2.createPresetGlobalPalettes;
var createLayersSelectedFromPreset = function createLayersSelectedFromPreset(thisPreset, isGrouped, groupsRaw) {
  var groups = Array.isArray(groupsRaw) ? groupsRaw : [];
  if (!thisPreset || !Array.isArray(thisPreset.layersSelected)) {
    return [''];
  }
  if (thisPreset.type === 'group' && isGrouped && thisPreset.layersSelected.length > 0) {
    var layersSelected = [];
    thisPreset.layersSelected.forEach(function (layer) {
      groups.forEach(function (group) {
        layersSelected.push("".concat(group, "__").concat(layer));
      });
    });
    return layersSelected;
  }
  return thisPreset.layersSelected;
};
var _validateFormatAllStylesInput = function _validateFormatAllStylesInput(input) {
  if (!isObjectLiteral(input)) {
    return 'input is not an object';
  }
  var thisPreset = input.thisPreset,
    groups = input.groups,
    groupsSub = input.groupsSub,
    layersAllPrefixed = input.layersAllPrefixed;
  var styles = thisPreset ? thisPreset.styles : {};
  if (!Array.isArray(layersAllPrefixed)) {
    return 'layersAllPrefixed is not an array';
  }
  var noString;
  layersAllPrefixed.forEach(function (l, i) {
    if (typeof l !== 'string') {
      noString = "layersAllPrefixed item ".concat(l, " at index ").concat(i, " is not a string");
    }
  });
  if (noString) {
    return noString;
  }
  if (!Array.isArray(groups)) {
    return 'groups is not an array';
  }
  if (!Array.isArray(groupsSub)) {
    return 'groupsSub is not an array';
  }
  if (!isObjectLiteral(thisPreset)) {
    return 'thisPreset is not an object';
  }
  if (!isObjectLiteral(styles)) {
    return 'styles is not an object';
  }
  return 'ok';
};
var parseGroupsFromLayer = function parseGroupsFromLayer(layer, groups, groupsSub) {
  var group, groupSub;
  groups.forEach(function (g) {
    if (layer.includes("".concat(g, "__"))) {
      group = g;
    }
  });
  groupsSub.forEach(function (s) {
    if (layer.includes("".concat(s, "__"))) {
      groupSub = s;
    }
  });
  var g = group ? "".concat(group) : '';
  var g_ = g ? "".concat(g, "__") : '';
  var s = groupSub ? "".concat(groupSub) : '';
  var s_ = s ? "".concat(s, "__") : '';
  return {
    g: g,
    g_: g_,
    s: s,
    s_: s_
  };
};
var selectBestStyleMatch = function selectBestStyleMatch(thisPreset, layer, unPrefix, g_, s_) {
  var presetStyle = isObjectLiteral(thisPreset.styles) ? thisPreset.styles : {};
  var s = isObjectLiteral(presetStyle[layer]) ? Object.assign({}, presetStyle[layer]) : isObjectLiteral(presetStyle[unPrefix]) ? Object.assign({}, presetStyle[unPrefix]) : isObjectLiteral(presetStyle["".concat(g_).concat(s_).concat(layer)]) ? Object.assign({}, presetStyle["".concat(g_).concat(s_).concat(layer)]) : isObjectLiteral(presetStyle["".concat(g_).concat(layer)]) ? Object.assign({}, presetStyle["".concat(g_).concat(layer)]) : isObjectLiteral(presetStyle["".concat(s_).concat(layer)]) ? Object.assign({}, presetStyle["".concat(s_).concat(layer)]) : {
    style: {}
  };
  // make nested style consistent
  s.style = isObjectLiteral(s.style) ? s.style : {};
  return s;
};
var selectBestColorMatch = function selectBestColorMatch(thisStyle, newGroupColors, presetGlobalPalettes, shade, group) {
  var color = isObjectLiteral(thisStyle) ? thisStyle.color : '80, 80, 80';
  // type check newGroupColors
  var ngc = isObjectLiteral(newGroupColors) ? newGroupColors : {};
  var psgp = isObjectLiteral(presetGlobalPalettes) ? presetGlobalPalettes : {};
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
var formatAllStyles = function formatAllStyles(input) {
  var layersAllPrefixed = input.layersAllPrefixed,
    groups = input.groups,
    groupsSub = input.groupsSub,
    thisPreset = input.thisPreset,
    newGroupColors = input.newGroupColors,
    presetGlobalPalettes = input.presetGlobalPalettes;
  var validated = _validateFormatAllStylesInput(input);
  if (validated !== 'ok') {
    return {
      message: validated
    };
  }
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
    var thisStyle = selectBestStyleMatch(thisPreset, layer, unPrefix, g_, s_);
    var shade = !isObjectLiteral(thisStyle.style) ? 0 : thisStyle.style.shade > 0 ? thisStyle.style.shade : 0;
    thisStyle.color = selectBestColorMatch(thisStyle, newGroupColors, presetGlobalPalettes, shade, g);
    theseStyles[layer] = thisStyle;
  });
  return theseStyles;
};
var prioritizeGroups = function prioritizeGroups(groups, groupColors) {
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
var assignPresetGroupColors = function assignPresetGroupColors(input) {
  var groups = input.groups,
    groupColors = input.groupColors,
    presetGlobalColorOptions = input.presetGlobalColorOptions,
    presetGlobalPalettes = input.presetGlobalPalettes;
  var defaultReturn = {
    newGroupColors: {},
    groupDotColors: {}
  };
  if (!Array.isArray(groups)) return defaultReturn;
  var psgpFromUser = isObjectLiteral(presetGlobalPalettes) ? presetGlobalPalettes : {};
  var psgp = Object.assign({}, createPresetGlobalPalettes(), psgpFromUser);
  var psgco = Array.isArray(presetGlobalColorOptions) ? presetGlobalColorOptions : listBright();
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
var formatGroupsStyles = function formatGroupsStyles(input) {
  var groups = input.groups,
    groupColors = input.groupColors,
    groupsSub = input.groupsSub,
    presetGlobalColorOptions = input.presetGlobalColorOptions,
    presetGlobalPalettes = input.presetGlobalPalettes,
    layersAllPrefixed = input.layersAllPrefixed,
    thisPreset = input.thisPreset,
    isGrouped = input.isGrouped;
  var defaultObject = {
    styles: {},
    newGroupColors: {},
    groupDotColors: {}
  };
  if (!isObjectLiteral(thisPreset)) {
    // i.e. no material to read from
    return defaultObject;
  } else if (!isObjectLiteral(thisPreset.styles)) {
    // i.e. no material to read from
    return defaultObject;
  }
  defaultObject.styles = thisPreset.styles;

  // below are ONLY if grouped
  if (isGrouped && Array.isArray(groups)) {
    var _assignPresetGroupCol = assignPresetGroupColors({
        groups: groups,
        groupColors: groupColors,
        presetGlobalPalettes: presetGlobalPalettes,
        presetGlobalColorOptions: presetGlobalColorOptions
      }),
      newGroupColors = _assignPresetGroupCol.newGroupColors,
      groupDotColors = _assignPresetGroupCol.groupDotColors;
    var styles = formatAllStyles({
      groups: groups,
      groupsSub: groupsSub,
      newGroupColors: newGroupColors,
      presetGlobalPalettes: presetGlobalPalettes,
      layersAllPrefixed: layersAllPrefixed,
      thisPreset: thisPreset
    });
    return {
      newGroupColors: newGroupColors,
      groupDotColors: groupDotColors,
      styles: styles
    };
  }
  // if not grouped
  return defaultObject;
};
var unpackPreset = function unpackPreset(gs, thisPreset, id) {
  var isGrouped = gs.isGrouped,
    groups = gs.groups,
    groupColors = gs.groupColors,
    groupsSub = gs.groupsSub,
    presetGlobalPalettes = gs.presetGlobalPalettes,
    presetGlobalColorOptions = gs.presetGlobalColorOptions,
    layersAllPrefixed = gs.layersAllPrefixed;
  var layersSelected = createLayersSelectedFromPreset(thisPreset, isGrouped, groups);
  var _formatGroupsStyles = formatGroupsStyles({
      thisPreset: thisPreset,
      isGrouped: isGrouped,
      groups: groups,
      groupsSub: Array.isArray(groupsSub) ? groupsSub : [''],
      groupColors: groupColors,
      presetGlobalColorOptions: presetGlobalColorOptions,
      presetGlobalPalettes: presetGlobalPalettes,
      layersAllPrefixed: layersAllPrefixed
    }),
    styles = _formatGroupsStyles.styles,
    newGroupColors = _formatGroupsStyles.newGroupColors,
    groupDotColors = _formatGroupsStyles.groupDotColors;

  // this prefixes as determined by gs, i.e. parent
  // this does not allow individual presets to decide what to prefix (see above)
  var prefixesToKeepGroups = !Array.isArray(gs.groups) ? [] : gs.groups;
  var prefixesToKeepGroupsSub = !Array.isArray(gs.groupsSub) ? [] : gs.groupsSub;
  return {
    groupColors: newGroupColors,
    groupDotColors: groupDotColors,
    presetIdActive: id,
    layersSelected: layersSelected,
    styles: styles,
    prefixesToKeepGroups: prefixesToKeepGroups,
    prefixesToKeepGroupsSub: prefixesToKeepGroupsSub
  };
};
var selectDefaultPreset = function selectDefaultPreset(presets) {
  var presetIdActive;
  for (var id in presets) {
    if (presets[id].def) {
      presetIdActive = id;
    }
  }
  if (presetIdActive) {
    return presetIdActive;
  }
  // worst case, no default and id list didn't load yet

  for (var _id in presets) {
    presetIdActive = _id;
  }
  return presetIdActive;
};
module.exports = {
  createLayersSelectedFromPreset: createLayersSelectedFromPreset,
  _validateFormatAllStylesInput: _validateFormatAllStylesInput,
  parseGroupsFromLayer: parseGroupsFromLayer,
  selectBestStyleMatch: selectBestStyleMatch,
  selectBestColorMatch: selectBestColorMatch,
  formatAllStyles: formatAllStyles,
  assignPresetGroupColors: assignPresetGroupColors,
  formatGroupsStyles: formatGroupsStyles,
  unpackPreset: unpackPreset,
  selectDefaultPreset: selectDefaultPreset
};