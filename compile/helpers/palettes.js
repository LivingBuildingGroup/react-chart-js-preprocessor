'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('conjunction-junction'),
    isPrimitiveNumber = _require.isPrimitiveNumber;

/* This creates pre-set color palettes.
 * general14 is the original palette; now DEPRECATED; it is an array of somewhat pastel colors; the contrast is not great
 * bright is 7 mostly primary and secondary colors
 * 
 * MONOCHROMATIC ORDERED ARRAYS
 * bark, fern, corn, peach, wine, eggplant, and sky are the rainbow
 * each of these has 8 values, starting from a tone in the middle, and adding tint (white) to lower values and shade (black) to higher values
 * the default factory function returns an ordered array (light to dark)
 * as an option, the corresponding "bright" hue can be added at a given position (push, unshift, or overwriting an existing value)
 * 
 * POLYCHROMATIC ORDERED ARRAYS
 * the palette functions return ordered arrays of contrasting colors
 * palette11 is the shortest, and this array is extended through palette23
 * the first few colors in palette11 should stand on their own
 * and I don't see a need to go beyond 23 colors for graphing
 * 
 * POLYCHROMATIC RANDOM ACCESS
 * namedColors returns an object with semantic keys for the colors in palette23.
 */


var general14 = exports.general14 = function general14() {
  return ['236,  83, 158', //  0 orange-red
  ' 30, 132, 197', //  1 middle blue
  '254, 127,  32', //  2 deep-orange
  '203, 198,  48', //  3 frog-green
  '244, 206, 117', //  4 yellow-tan
  '201,  54,  74', //  5 raspberry-red
  '223, 182, 131', //  6 tan
  ' 56, 174, 190', //  7 teal
  '254, 208,   8', //  8 sunflower-yellow
  '211, 73,   50', //  9 red-orange
  '148, 154, 167', // 10 traditional-gray
  '228, 203, 166', // 11 beige
  ' 50,  18,  27', // 12 prune  *pressure*
  ' 30,  28,  65', // 13 dark-blue
  '  0, 153,  51'];
};

var createBright7 = exports.createBright7 = function createBright7(option) {
  // default returns object to use to mutate 7 palettes
  if (option === 'array') {
    return ['254, 128,  0', '  0, 254,  0', '254, 254,  0', '254,  0,   0', '169,  0,  81', '254,  0, 254', '  0,  0, 254'];
  } else {
    return {
      bark8: '254, 128,   0',
      fern8: '  0, 254,   0',
      corn8: '254, 254,   0',
      peach8: '254,   0,   0',
      wine8: '169,   0,  81',
      eggplant8: '254,   0, 254',
      sky8: '  0,   0, 254'
    };
  }
};

var addBright = exports.addBright = function addBright(arr, key, pos) {
  // this MUTATES arr ! (seems the most efficient solution in this limited scope and size)
  var bright7 = createBright7();
  if (pos < 0) {
    arr.unshift(bright7[key]);
  } else if (pos < arr.length) {
    arr[pos] = bright7[key];
  } else {
    arr.push(bright7[key]);
  }
};

var addBrights = exports.addBrights = function addBrights(arr) {
  var bright7 = createBright7('array');
  return [].concat(_toConsumableArray(bright7), _toConsumableArray(arr));
};

var createBark8 = exports.createBark8 = function createBark8(pos) {
  var arr = ['246, 189, 111', '227, 163,  79', '205, 145,  67', '166, 114,  47', '137,  90,  30', '115,  74,  19', '102,  62,  12', ' 92,  55,   6'];
  if (isPrimitiveNumber(pos)) {
    addBright(arr, 'bark8', pos);
  }
  return arr;
};

var createFern8 = exports.createFern8 = function createFern8(pos) {
  var arr = ['128, 248, 109', ' 99, 224,  79', ' 79, 190,  64', ' 56, 150,  45', ' 38, 119,  31', ' 24,  93,  19', ' 13,  75,  11', '  7,  63,   5'];
  if (isPrimitiveNumber(pos)) {
    addBright(arr, 'fern8', pos);
  }
  return arr;
};

var createCorn8 = exports.createCorn8 = function createCorn8(pos) {
  var arr = ['227, 243,  92', '220, 233,  49', '203, 204,  31', '186, 173,  26', '174, 150,  22', '163, 130,  19', '155, 116,  17', '150, 106,  15'];
  if (isPrimitiveNumber(pos)) {
    addBright(arr, 'corn8', pos);
  }
  return arr;
};

var createPeach8 = exports.createPeach8 = function createPeach8(pos) {
  var arr = ['245, 167, 143', '234, 138, 110', '224, 116,  88', '213,  91,  63', '203,  71,  43', '196,  54,  25', '189,  40,  11', '165,  31,   5'];
  if (isPrimitiveNumber(pos)) {
    addBright(arr, 'peach8', pos);
  }
  return arr;
};

var createWine8 = exports.createWine8 = function createWine8(pos) {
  var arr = ['243, 158, 162', '227, 124, 131', '202.  99, 108', '174,  70,  83', '150,  46,  62', '132,  28,  45', '118,  15,  34', ' 93,   6,  22'];
  if (isPrimitiveNumber(pos)) {
    addBright(arr, 'wine8', pos);
  }
  return arr;
};

var createEggplant8 = exports.createEggplant8 = function createEggplant8(pos) {
  var arr = ['227, 146, 247', '206, 114, 225', '183,  92, 197', '158,  66, 167', '135,  44, 139', '117,  26, 117', '107,  16, 104', ' 88,   6,  83'];
  if (isPrimitiveNumber(pos)) {
    addBright(arr, 'eggplant8', pos);
  }
  return arr;
};

var createSky8 = exports.createSky8 = function createSky8(pos) {
  var arr = ['189, 209, 245', '155, 180, 223', '123, 147, 190', ' 81, 103, 144', ' 53,  74, 112', ' 33,  53,  93', ' 14,  34,  71', '  3,  19,  51'];
  if (isPrimitiveNumber(pos)) {
    addBright(arr, 'sky8', pos);
  }
  return arr;
};

var createMonoChrome = exports.createMonoChrome = function createMonoChrome(option) {
  if (option === 'green') {
    return createFern8(-1);
  } else if (option === 'yellow') {
    return createCorn8(-1);
  } else if (option === 'orange') {
    return createBark8(-1);
  } else if (option === 'red') {
    return createPeach8(-1);
  } else if (option === 'purple') {
    return createWine8(-1);
  } else if (option === 'violet') {
    return createEggplant8(-1);
  } else if (option === 'blue') {
    return createSky8(-1);
  } else {
    return createPeach8(-1); // just a default...
  }
};

var listBright = exports.listBright = function listBright() {
  return ['green', 'yellow', 'orange', 'red', 'purple', 'violet', 'blue'];
};

var createPalette11 = exports.createPalette11 = function createPalette11(option) {
  var white = '255 255 255';
  var bark8 = createBark8();
  var fern8 = createFern8();
  var corn8 = createCorn8();
  var peach8 = createPeach8();
  var wine8 = createWine8();
  var eggplant8 = createEggplant8();
  var sky8 = createSky8();

  var arr = [white, bark8[1], fern8[2], corn8[3], peach8[4], wine8[7], sky8[7], fern8[6], sky8[1], peach8[0], eggplant8[6], eggplant8[0]];

  if (option === 'bright') {
    return addBrights(arr);
  }
  return arr;
};

var createPalette13 = exports.createPalette13 = function createPalette13(option) {
  var white = '255 255 255';
  var bark8 = createBark8();
  var fern8 = createFern8();
  var corn8 = createCorn8();
  var peach8 = createPeach8();
  var wine8 = createWine8();
  var eggplant8 = createEggplant8();
  var sky8 = createSky8();

  var arr = [white, bark8[1], fern8[2], corn8[3], peach8[4], wine8[7], sky8[7], fern8[6], sky8[1], peach8[0], eggplant8[6], eggplant8[0], bark8[3], sky8[4]];
  if (option === 'bright') {
    return addBrights(arr);
  }
  return arr;
};

var createPalette16 = exports.createPalette16 = function createPalette16(option) {
  var white = '255 255 255';
  var bark8 = createBark8();
  var fern8 = createFern8();
  var corn8 = createCorn8();
  var peach8 = createPeach8();
  var wine8 = createWine8();
  var eggplant8 = createEggplant8();
  var sky8 = createSky8();

  var arr = [white, bark8[1], fern8[2], corn8[3], peach8[4], wine8[7], sky8[7], fern8[6], sky8[1], peach8[0], eggplant8[6], eggplant8[0], bark8[3], sky8[4], peach8[2], corn8[0], bark8[7]];
  if (option === 'bright') {
    return addBrights(arr);
  }
  return arr;
};

var createPalette19 = exports.createPalette19 = function createPalette19(option) {
  var white = '255 255 255';
  var bark8 = createBark8();
  var fern8 = createFern8();
  var corn8 = createCorn8();
  var peach8 = createPeach8();
  var wine8 = createWine8();
  var eggplant8 = createEggplant8();
  var sky8 = createSky8();

  var arr = [white, bark8[1], fern8[2], corn8[3], peach8[4], wine8[7], sky8[7], fern8[6], sky8[1], peach8[0], eggplant8[6], eggplant8[0], bark8[3], sky8[4], peach8[2], corn8[0], bark8[7], eggplant8[3], fern8[0], wine8[4]];
  if (option === 'bright') {
    return addBrights(arr);
  }
  return arr;
};

var createPalette23 = exports.createPalette23 = function createPalette23(option) {
  var white = '255 255 255';
  var bark8 = createBark8();
  var fern8 = createFern8();
  var corn8 = createCorn8();
  var peach8 = createPeach8();
  var wine8 = createWine8();
  var eggplant8 = createEggplant8();
  var sky8 = createSky8();

  var arr = [white, bark8[1], fern8[2], corn8[3], peach8[4], wine8[7], sky8[7], fern8[6], sky8[1], peach8[0], eggplant8[6], eggplant8[0], bark8[3], sky8[4], peach8[2], corn8[0], bark8[7], eggplant8[3], fern8[0], wine8[4], corn8[7], fern8[4], wine8[1], peach8[6]];
  if (option === 'bright') {
    return addBrights(arr);
  }
  return arr;
};

var selectPalette = exports.selectPalette = function selectPalette(num, option) {
  if (!isPrimitiveNumber(num)) {
    return createPalette23(option);
  } else if (num <= 11) {
    return createPalette11(option);
  } else if (num <= 13) {
    return createPalette13(option);
  } else if (num <= 16) {
    return createPalette16(option);
  } else if (num <= 19) {
    return createPalette19(option);
  } else {
    return createPalette23(option);
  }
};

var createNamed = exports.createNamed = function createNamed(option) {
  var white = '255 255 255';
  var bark8 = createBark8();
  var fern8 = createFern8();
  var corn8 = createCorn8();
  var peach8 = createPeach8();
  var wine8 = createWine8();
  var eggplant8 = createEggplant8();
  var sky8 = createSky8();

  var namedColors = {
    white: white,
    mocha: bark8[1],
    cinnamon: bark8[3],
    chocolate: bark8[7],
    sprite: fern8[0],
    lime: fern8[2],
    chartreuse: fern8[4],
    forest: fern8[6],
    parchment: corn8[0],
    mustard: corn8[3],
    tan: corn8[7],
    skin: peach8[0],
    coral: peach8[2],
    papaya: peach8[4],
    nandina: peach8[6],
    pink: wine8[1],
    rose: wine8[4],
    merlot: wine8[7],
    lavendar: eggplant8[0],
    lilac: eggplant8[3],
    aubergine: eggplant8[6],
    sea: sky8[1],
    dusk: sky8[4],
    navy: sky8[7]
  };

  if (option === 'bright') {
    var bright7 = createBright7();
    namedColors.brown = bright7.bark8;
    namedColors.green = bright7.fern8;
    namedColors.yellow = bright7.corn8;
    namedColors.red = bright7.peach8;
    namedColors.violet = bright7.wine8;
    namedColors.purple = bright7.eggplant8;
    namedColors.blue = bright7.sky8;
  }

  return namedColors;
};

var createPreSetGlobalPalettes = exports.createPreSetGlobalPalettes = function createPreSetGlobalPalettes() {
  var colors = listBright();
  var preSetGlobalPalettes = {};
  colors.forEach(function (color) {
    preSetGlobalPalettes[color] = createMonoChrome(color);
  });
  return preSetGlobalPalettes;
};

// export default {
//   general14,
//   createBright7,
//   addBright,
//   addBrights,
//   createBark8,
//   createFern8,
//   createCorn8,
//   createPeach8,
//   createWine8,
//   createEggplant8,
//   createSky8,
//   createMonoChrome,
//   listBright,
//   createPalette11,
//   createPalette13,
//   createPalette16,
//   createPalette19,
//   createPalette23,
//   selectPalette,
//   createNamed,
//   createPreSetGlobalPalettes,
// };