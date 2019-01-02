const { isPrimitiveNumber } = require('conjunction-junction');

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
export const general14 = () => ([
  '236,  83, 158', //  0 orange-red
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
  '  0, 153,  51', // 14 not happy with this yet
]);

export const createBright7 = option => {
  // default returns object to use to mutate 7 palettes
  if(option === 'array'){
    return [
      '254, 128,  0',
      '  0, 254,  0',
      '254, 254,  0',
      '254,  0,   0',
      '169,  0,  81',
      '254,  0, 254',
      '  0,  0, 254',
    ];
  } else {
    return {
      bark8:     '254, 128,   0',
      fern8:     '  0, 254,   0',
      corn8:     '254, 254,   0',
      peach8:    '254,   0,   0',
      wine8:     '169,   0,  81',
      eggplant8: '254,   0, 254',
      sky8:      '  0,   0, 254',
    };
  }
};

export const addBright = (arr, key, pos) => {
  // this MUTATES arr ! (seems the most efficient solution in this limited scope and size)
  const bright7 = createBright7();
  if(pos < 0){
    arr.unshift(bright7[key]);
  } else if (pos < arr.length) {
    arr[pos] = bright7[key];
  } else {
    arr.push(bright7[key]);
  }
};

export const addBrights = arr => {
  const bright7 = createBright7('array');
  return [...bright7, ...arr];
};

export const createBark8 = pos => {
  const arr = [
    '246, 189, 111',
    '227, 163,  79',
    '205, 145,  67',
    '166, 114,  47',
    '137,  90,  30',
    '115,  74,  19',
    '102,  62,  12',
    ' 92,  55,   6',
  ];
  if(isPrimitiveNumber(pos)){
    addBright(arr, 'bark8', pos);
  }
  return arr;
};

export const createFern8 = pos => {
  const arr = [
    '128, 248, 109',
    ' 99, 224,  79',
    ' 79, 190,  64',
    ' 56, 150,  45',
    ' 38, 119,  31',
    ' 24,  93,  19',
    ' 13,  75,  11',
    '  7,  63,   5',
  ];
  if(isPrimitiveNumber(pos)){
    addBright(arr, 'fern8', pos);
  }
  return arr;
};

export const createCorn8 = pos => {
  const arr = [
    '227, 243,  92',
    '220, 233,  49',
    '203, 204,  31',
    '186, 173,  26',
    '174, 150,  22',
    '163, 130,  19',
    '155, 116,  17',
    '150, 106,  15',
  ]; 
  if(isPrimitiveNumber(pos)){
    addBright(arr, 'corn8', pos);
  }
  return arr;
};

export const createPeach8 = pos => {
  const arr = [
    '245, 167, 143',
    '234, 138, 110',
    '224, 116,  88',
    '213,  91,  63',
    '203,  71,  43',
    '196,  54,  25',
    '189,  40,  11',
    '165,  31,   5',
  ]; 
  if(isPrimitiveNumber(pos)){
    addBright(arr, 'peach8', pos);
  }
  return arr;
};

export const createWine8 = pos => {
  const arr = [
    '243, 158, 162',
    '227, 124, 131',
    '202.  99, 108',
    '174,  70,  83',
    '150,  46,  62',
    '132,  28,  45',
    '118,  15,  34',
    ' 93,   6,  22',
  ]; 
  if(isPrimitiveNumber(pos)){
    addBright(arr, 'wine8', pos);
  }
  return arr;
};

export const createEggplant8 = pos => {
  const arr = [
    '227, 146, 247',
    '206, 114, 225',
    '183,  92, 197',
    '158,  66, 167',
    '135,  44, 139',
    '117,  26, 117',
    '107,  16, 104',
    ' 88,   6,  83',
  ]; 
  if(isPrimitiveNumber(pos)){
    addBright(arr, 'eggplant8', pos);
  }
  return arr;
};

export const createSky8 = pos => {
  const arr = [
    '189, 209, 245',
    '155, 180, 223',
    '123, 147, 190',
    ' 81, 103, 144',
    ' 53,  74, 112',
    ' 33,  53,  93',
    ' 14,  34,  71',
    '  3,  19,  51',
  ]; 
  if(isPrimitiveNumber(pos)){
    addBright(arr, 'sky8', pos);
  }
  return arr;
};

export const createMonoChrome = option => {
  if(option ==='green'){
    return createFern8(-1);
  } else if(option ==='yellow'){
    return createCorn8(-1);
  } else if(option ==='orange'){
    return createBark8(-1);
  } else if(option ==='red'){
    return createPeach8(-1);
  } else if(option ==='purple'){
    return createWine8(-1);
  } else if(option ==='violet'){
    return createEggplant8(-1);
  } else if(option ==='blue'){
    return createSky8(-1);
  } else {
    return createPeach8(-1); // just a default...
  }
};

export const listBright = () => {
  return [
    'green',
    'yellow',
    'orange',
    'red',
    'purple',
    'violet',
    'blue',
  ];
};

export const createPalette11 = option => {
  const white     = '255 255 255';
  const bark8     = createBark8();
  const fern8     = createFern8();
  const corn8     = createCorn8();
  const peach8    = createPeach8();
  const wine8     = createWine8();
  const eggplant8 = createEggplant8();
  const sky8      = createSky8();

  const arr = [
    white,
    bark8[1],
    fern8[2],
    corn8[3],
    peach8[4],
    wine8[7],
    sky8[7],
    fern8[6],
    sky8[1],
    peach8[0],
    eggplant8[6],
    eggplant8[0],
  ];

  if(option === 'bright'){
    return addBrights(arr);
  }
  return arr;
};

export const createPalette13 = option => {
  const white     = '255 255 255';
  const bark8     = createBark8();
  const fern8     = createFern8();
  const corn8     = createCorn8();
  const peach8    = createPeach8();
  const wine8     = createWine8();
  const eggplant8 = createEggplant8();
  const sky8      = createSky8();

  const arr = [
    white,
    bark8[1],
    fern8[2],
    corn8[3],
    peach8[4],
    wine8[7],
    sky8[7],
    fern8[6],
    sky8[1],
    peach8[0],
    eggplant8[6],
    eggplant8[0],
    bark8[3],
    sky8[4],
  ];
  if(option === 'bright'){
    return addBrights(arr);
  }
  return arr;
};

export const createPalette16 = option => {
  const white     = '255 255 255';
  const bark8     = createBark8();
  const fern8     = createFern8();
  const corn8     = createCorn8();
  const peach8    = createPeach8();
  const wine8     = createWine8();
  const eggplant8 = createEggplant8();
  const sky8      = createSky8();

  const arr = [
    white,
    bark8[1],
    fern8[2],
    corn8[3],
    peach8[4],
    wine8[7],
    sky8[7],
    fern8[6],
    sky8[1],
    peach8[0],
    eggplant8[6],
    eggplant8[0],
    bark8[3],
    sky8[4],
    peach8[2],
    corn8[0],
    bark8[7],
  ];
  if(option === 'bright'){
    return addBrights(arr);
  }
  return arr;
};

export const createPalette19 = option => {
  const white     = '255 255 255';
  const bark8     = createBark8();
  const fern8     = createFern8();
  const corn8     = createCorn8();
  const peach8    = createPeach8();
  const wine8     = createWine8();
  const eggplant8 = createEggplant8();
  const sky8      = createSky8();

  const arr = [
    white,
    bark8[1],
    fern8[2],
    corn8[3],
    peach8[4],
    wine8[7],
    sky8[7],
    fern8[6],
    sky8[1],
    peach8[0],
    eggplant8[6],
    eggplant8[0],
    bark8[3],
    sky8[4],
    peach8[2],
    corn8[0],
    bark8[7],
    eggplant8[3],
    fern8[0],
    wine8[4],
  ];
  if(option === 'bright'){
    return addBrights(arr);
  }
  return arr;
};

export const createPalette23 = option => {
  const white     = '255 255 255';
  const bark8     = createBark8();
  const fern8     = createFern8();
  const corn8     = createCorn8();
  const peach8    = createPeach8();
  const wine8     = createWine8();
  const eggplant8 = createEggplant8();
  const sky8      = createSky8();

  const arr = [
    white,
    bark8[1],
    fern8[2],
    corn8[3],
    peach8[4],
    wine8[7],
    sky8[7],
    fern8[6],
    sky8[1],
    peach8[0],
    eggplant8[6],
    eggplant8[0],
    bark8[3],
    sky8[4],
    peach8[2],
    corn8[0],
    bark8[7],
    eggplant8[3],
    fern8[0],
    wine8[4],
    corn8[7],
    fern8[4],
    wine8[1],
    peach8[6],
  ];
  if(option === 'bright'){
    return addBrights(arr);
  }
  return arr;
};

export const selectPalette = (num, option) => {
  if(!isPrimitiveNumber(num)){
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

export const createNamed = option => {
  const white     = '255 255 255';
  const bark8     = createBark8();
  const fern8     = createFern8();
  const corn8     = createCorn8();
  const peach8    = createPeach8();
  const wine8     = createWine8();
  const eggplant8 = createEggplant8();
  const sky8      = createSky8();

  const namedColors = {
    white,
    mocha:      bark8[1],
    cinnamon:   bark8[3],
    chocolate:  bark8[7],
    sprite:     fern8[0],
    lime:       fern8[2],
    chartreuse: fern8[4],
    forest:     fern8[6],
    parchment:  corn8[0],
    mustard:    corn8[3],
    tan:        corn8[7],
    skin:       peach8[0],
    coral:      peach8[2],
    papaya:     peach8[4],
    nandina:    peach8[6],
    pink:       wine8[1],
    rose:       wine8[4],
    merlot:     wine8[7],
    lavendar:   eggplant8[0],
    lilac:      eggplant8[3],
    aubergine:  eggplant8[6],
    sea:        sky8[1],
    dusk:       sky8[4],
    navy:       sky8[7],
  };

  if(option === 'bright'){
    const bright7 = createBright7();
    namedColors.brown  = bright7.bark8;
    namedColors.green  = bright7.fern8;
    namedColors.yellow = bright7.corn8;
    namedColors.red    = bright7.peach8;
    namedColors.violet = bright7.wine8;
    namedColors.purple = bright7.eggplant8;
    namedColors.blue   = bright7.sky8;
  }

  return namedColors;
};

export const createPreSetGlobalPalettes = () => {
  const colors = listBright();
  const preSetGlobalPalettes = {};
  colors.forEach(color=>{
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