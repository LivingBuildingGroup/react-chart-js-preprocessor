'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  general14,
  createBright7,
  addBright, // tested as a helper
  addBrights, // tested as helper
  createBark8,
  createFern8,
  createCorn8,
  createPeach8,
  createWine8,
  createEggplant8,
  createSky8,
  createMonoChrome,
  listBright,
  createPalette11,
  createPalette13,
  createPalette16,
  createPalette19,
  createPalette23,
  selectPalette,
  createNamed,
  createPreSetGlobalPalettes,
} = require('../compile/helpers/palettes');

describe('palettes', ()=> { 

  const bark8Unshift = [
    '254, 128,   0', // bright
    '246, 189, 111',
    '227, 163,  79',
    '205, 145,  67',
    '166, 114,  47',
    '137,  90,  30',
    '115,  74,  19',
    '102,  62,  12',
    ' 92,  55,   6',
  ];
  const fern8Unshift = [
    '  0, 254,   0', // bright
    '128, 248, 109',
    ' 99,  24,  79',
    ' 79, 190,  64',
    ' 56, 150,  45',
    ' 38, 119,  31',
    ' 24,  93,  19',
    ' 13,  75,  11',
    ' 92,  55,   6',
  ];
  const corn8Unshift = [
    '254, 254,   0', // bright
    '227, 243,  92',
    '220, 233,  49',
    '203, 204,  31',
    '186, 173,  26',
    '174, 150,  22',
    '163, 130,  19',
    '155, 116,  17',
    '150, 106,  15',
  ];
  const peach8Unshift = [
    '254,   0,   0', // bright
    '245, 167, 143',
    '234, 138, 110',
    '224, 116,  88',
    '213,  91,  63',
    '203,  71,  43',
    '196,  54,  25',
    '189,  40,  11',
    '165,  31,   5',
  ];
  const wine8Unshift = [
    '169,   0,  81', // bright
    '243, 158, 162',
    '227, 124, 131',
    '202.  99, 108',
    '174,  70,  83',
    '150,  46,  62',
    '132,  28,  45',
    '118,  15,  34',
    ' 93,   6,  22',
  ];
  const eggplant8Unshift = [
    '254,   0, 254', // bright
    '227, 146, 247',
    '206, 114, 225',
    '183,  92, 197',
    '158,  66, 167',
    '135,  44, 139',
    '117,  26, 117',
    '107,  16, 104',
    ' 88,   6,  83',
  ];
  const sky8Unshift = [
    '  0,   0, 254', // bright
    '189, 209, 245',
    '155, 180, 223',
    '123, 147, 190',
    ' 81, 103, 144',
    ' 53,  74, 112',
    ' 33,  53,  93',
    ' 14,  34,  71',
    '  3,  19,  51',
  ];

  it('general14', () => {
    const expectedResult = [
      '236,  83, 158',  
      ' 30, 132, 197',   
      '254, 127,  32',   
      '203, 198,  48', 
      '244, 206, 117', 
      '201,  54,  74',  
      '223, 182, 131', 
      ' 56, 174, 190', 
      '254, 208,   8', 
      '211, 73,   50', 
      '148, 154, 167', 
      '228, 203, 166', 
      ' 50,  18,  27',  
      ' 30,  28,  65', 
      '  0, 153,  51', 
    ];
    const result = general14();
    expect(result).to.deep.equal(expectedResult);
  });

  it('bright7 array', () => {
    const expectedResult = [
      '254, 128,  0',
      '  0, 254,  0',
      '254, 254,  0',
      '254,  0,   0',
      '169,  0,  81',
      '254,  0, 254',
      '  0,  0, 254',
    ];
    const option = 'array';
    const result = createBright7(option);
    expect(result).to.deep.equal(expectedResult);
  });

  it('bright7 default', () => {
    const expectedResult = {
      bark8:     '254, 128,   0',
      fern8:     '  0, 254,   0',
      corn8:     '254, 254,   0',
      peach8:    '254,   0,   0',
      wine8:     '169,   0,  81',
      eggplant8: '254,   0, 254',
      sky8:      '  0,   0, 254',
    };
    const result = createBright7();
    expect(result).to.deep.equal(expectedResult);
  });

  it('createBark8 default', () => {
    const expectedResult = [
      '246, 189, 111',
      '227, 163,  79',
      '205, 145,  67',
      '166, 114,  47',
      '137,  90,  30',
      '115,  74,  19',
      '102,  62,  12',
      ' 92,  55,   6',
    ];
    const result = createBark8();
    expect(result).to.deep.equal(expectedResult);
  });

  it('createBark8 unshift', () => {
    const expectedResult = bark8Unshift;
    const pos = -1;
    const result = createBark8(pos);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createBark8 3', () => {
    const expectedResult = [
      '246, 189, 111',
      '227, 163,  79',
      '205, 145,  67',
      '254, 128,   0', // bright
      '137,  90,  30',
      '115,  74,  19',
      '102,  62,  12',
      ' 92,  55,   6',
    ];
    const pos = 3;
    const result = createBark8(pos);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createBark8 push', () => {
    const expectedResult = [
      '246, 189, 111',
      '227, 163,  79',
      '205, 145,  67',
      '166, 114,  47',
      '137,  90,  30',
      '115,  74,  19',
      '102,  62,  12',
      ' 92,  55,   6',
      '254, 128,   0', // bright
    ];
    const pos = 9;
    const result = createBark8(pos);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createFern8 default', () => {
    const expectedResult = [
      '128, 248, 109',
      ' 99, 224,  79',
      ' 79, 190,  64',
      ' 56, 150,  45',
      ' 38, 119,  31',
      ' 24,  93,  19',
      ' 13,  75,  11',
      '  7,  63,   5',
    ];
    const result = createFern8();
    expect(result).to.deep.equal(expectedResult);
  });

  it('createFern8 unshift', () => {
    const expectedResult = fern8Unshift;
    const pos = -1;
    const result = createFern8(pos);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createFern8 3', () => {
    const expectedResult = [
      '  0, 254,   0', // bright
      ' 99, 224,  79',
      ' 79, 190,  64',
      ' 56, 150,  45',
      ' 38, 119,  31',
      ' 24,  93,  19',
      ' 13,  75,  11',
      '  7,  63,   5',
    ];
    const pos = 0;
    const result = createFern8(pos);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createFern8 push', () => {
    const expectedResult = [
      '128, 248, 109',
      ' 99, 224,  79',
      ' 79, 190,  64',
      ' 56, 150,  45',
      ' 38, 119,  31',
      ' 24,  93,  19',
      ' 13,  75,  11',
      '  7,  63,   5',
      '  0, 254,   0', // bright
    ];
    const pos = 10;
    const result = createFern8(pos);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createCorn8 default', () => {
    const expectedResult = [
      '227, 243,  92',
      '220, 233,  49',
      '203, 204,  31',
      '186, 173,  26',
      '174, 150,  22',
      '163, 130,  19',
      '155, 116,  17',
      '150, 106,  15',
    ];
    const result = createCorn8();
    expect(result).to.deep.equal(expectedResult);
  });

  it('createCorn8 unshift', () => {
    const expectedResult = corn8Unshift;
    const pos = -13;
    const result = createCorn8(pos);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createCorn8 1', () => {
    const expectedResult = [
      '227, 243,  92',
      '254, 254,   0', // bright
      '203, 204,  31',
      '186, 173,  26',
      '174, 150,  22',
      '163, 130,  19',
      '155, 116,  17',
      '150, 106,  15',
    ];
    const pos = 1;
    const result = createCorn8(pos);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createCorn8 push', () => {
    const expectedResult = [
      '227, 243,  92',
      '220, 233,  49',
      '203, 204,  31',
      '186, 173,  26',
      '174, 150,  22',
      '163, 130,  19',
      '155, 116,  17',
      '150, 106,  15',
      '254, 254,   0', // bright
    ];
    const pos = 30;
    const result = createCorn8(pos);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createPeach8 default', () => {
    const expectedResult = [
      '245, 167, 143',
      '234, 138, 110',
      '224, 116,  88',
      '213,  91,  63',
      '203,  71,  43',
      '196,  54,  25',
      '189,  40,  11',
      '165,  31,   5',
    ];
    const result = createPeach8();
    expect(result).to.deep.equal(expectedResult);
  });

  it('createPeach8 unshift', () => {
    const expectedResult = peach8Unshift;
    const pos = -1;
    const result = createPeach8(pos);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createPeach8 5', () => {
    const expectedResult = [
      '245, 167, 143',
      '234, 138, 110',
      '224, 116,  88',
      '213,  91,  63',
      '203,  71,  43',
      '254,   0,   0', // bright
      '189,  40,  11',
      '165,  31,   5',
    ];
    const pos = 5;
    const result = createPeach8(pos);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createPeach8 push', () => {
    const expectedResult = [
      '245, 167, 143',
      '234, 138, 110',
      '224, 116,  88',
      '213,  91,  63',
      '203,  71,  43',
      '196,  54,  25',
      '189,  40,  11',
      '165,  31,   5',
      '254,   0,   0', // bright
    ];
    const pos = 100;
    const result = createPeach8(pos);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createWine8 default', () => {
    const expectedResult = [
      '243, 158, 162',
      '227, 124, 131',
      '202.  99, 108',
      '174,  70,  83',
      '150,  46,  62',
      '132,  28,  45',
      '118,  15,  34',
      ' 93,   6,  22',
    ];
    const result = createWine8();
    expect(result).to.deep.equal(expectedResult);
  });

  it('createWine8 unshift', () => {
    const expectedResult = wine8Unshift;
    const pos = -1;
    const result = createWine8(pos);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createWine8 7', () => {
    const expectedResult = [
      '243, 158, 162',
      '227, 124, 131',
      '202.  99, 108',
      '174,  70,  83',
      '150,  46,  62',
      '132,  28,  45',
      '118,  15,  34',
      '169,   0,  81', // bright
    ];
    const pos = 7;
    const result = createWine8(pos);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createWine8 push', () => {
    const expectedResult = [
      '243, 158, 162',
      '227, 124, 131',
      '202.  99, 108',
      '174,  70,  83',
      '150,  46,  62',
      '132,  28,  45',
      '118,  15,  34',
      ' 93,   6,  22',
      '169,   0,  81', // bright
    ];
    const pos = 1000;
    const result = createWine8(pos);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createEggplant8 default', () => {
    const expectedResult = [
      '227, 146, 247',
      '206, 114, 225',
      '183,  92, 197',
      '158,  66, 167',
      '135,  44, 139',
      '117,  26, 117',
      '107,  16, 104',
      ' 88,   6,  83',
    ];
    const result = createEggplant8();
    expect(result).to.deep.equal(expectedResult);
  });

  it('createEggplant8 unshift', () => {
    const expectedResult = eggplant8Unshift;
    const pos = -1;
    const result = createEggplant8(pos);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createEggplant8 6', () => {
    const expectedResult = [
      '227, 146, 247',
      '206, 114, 225',
      '183,  92, 197',
      '158,  66, 167',
      '135,  44, 139',
      '117,  26, 117',
      '254,   0, 254', // bright
      ' 88,   6,  83',
    ];
    const pos = 6;
    const result = createEggplant8(pos);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createEggplant8 push', () => {
    const expectedResult = [
      '227, 146, 247',
      '206, 114, 225',
      '183,  92, 197',
      '158,  66, 167',
      '135,  44, 139',
      '117,  26, 117',
      '107,  16, 104',
      ' 88,   6,  83',
      '254,   0, 254', // bright
    ];
    const pos = 10;
    const result = createEggplant8(pos);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createSky8 default', () => {
    const expectedResult = [
      '189, 209, 245',
      '155, 180, 223',
      '123, 147, 190',
      ' 81, 103, 144',
      ' 53,  74, 112',
      ' 33,  53,  93',
      ' 14,  34,  71',
      '  3,  19,  51',
    ];
    const result = createSky8();
    expect(result).to.deep.equal(expectedResult);
  });

  it('createSky8 unshift', () => {
    const expectedResult = sky8Unshift;
    const pos = -1;
    const result = createSky8(pos);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createSky8 4', () => {
    const expectedResult = [
      '189, 209, 245',
      '155, 180, 223',
      '123, 147, 190',
      ' 81, 103, 144',
      '  0,   0, 254', // bright
      ' 33,  53,  93',
      ' 14,  34,  71',
      '  3,  19,  51',
    ];
    const pos = 4;
    const result = createSky8(pos);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createSky8 push', () => {
    const expectedResult = [
      '189, 209, 245',
      '155, 180, 223',
      '123, 147, 190',
      ' 81, 103, 144',
      ' 53,  74, 112',
      ' 33,  53,  93',
      ' 14,  34,  71',
      '  3,  19,  51',
      '  0,   0, 254', // bright
    ];
    const pos = 10;
    const result = createSky8(pos);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createMonoChrome green',()=>{
    const result = createMonoChrome('green');
    expect(result).to.deep.equal(fern8Unshift);
  });
  it('createMonoChrome yellow',()=>{
    const result = createMonoChrome('yellow');
    expect(result).to.deep.equal(corn8Unshift);
  });
  it('createMonoChrome green',()=>{
    const result = createMonoChrome('orange');
    expect(result).to.deep.equal(bark8Unshift);
  });
  it('createMonoChrome yellow',()=>{
    const result = createMonoChrome('red');
    expect(result).to.deep.equal(peach8Unshift);
  });
  it('createMonoChrome green',()=>{
    const result = createMonoChrome('purple');
    expect(result).to.deep.equal(wine8Unshift);
  });
  it('createMonoChrome yellow',()=>{
    const result = createMonoChrome('violet');
    expect(result).to.deep.equal(eggplant8Unshift);
  });
  it('createMonoChrome green',()=>{
    const result = createMonoChrome('blue');
    expect(result).to.deep.equal(sky8Unshift);
  });
  it('createMonoChrome yellow',()=>{
    const result = createMonoChrome('anything else');
    expect(result).to.deep.equal(peach8Unshift);
  });

  it('listBright',()=>{
    const expectedResult = [
      'green',
      'yellow',
      'orange',
      'red',
      'purple',
      'violet',
      'blue',
    ];
    const result = listBright();
    expect(result).to.deep.equal(expectedResult);
  });

  it('createPalette11', () => {
    const expectedResult = [
      '255 255 255', // white
      '227, 163,  79', // bark8[1]
      ' 79, 190,  64', // fern8[2]
      '186, 173,  26', // corn8[3]
      '203,  71,  43', // peach8[4],
      ' 93,   6,  22', // wine8[7],
      '  3,  19,  51', // sky8[7],
      ' 13,  75,  11', // fern8[6],
      '155, 180, 223', // sky8[1],
      '245, 167, 143', // peach8[0],
      '107,  16, 104', // eggplant8[6],
      '227, 146, 247', // eggplant8[0],
    ];
    const result = createPalette11();
    expect(result).to.deep.equal(expectedResult);
    const result2 = selectPalette(11);
    expect(result2).to.deep.equal(expectedResult);
  });

  it('createPalette11 bright', () => {
    const expectedResult = [
      '254, 128,  0',
      '  0, 254,  0',
      '254, 254,  0',
      '254,  0,   0',
      '169,  0,  81',
      '254,  0, 254',
      '  0,  0, 254',
      '255 255 255', // white
      '227, 163,  79', // bark8[1]
      ' 79, 190,  64', // fern8[2]
      '186, 173,  26', // corn8[3]
      '203,  71,  43', // peach8[4],
      ' 93,   6,  22', // wine8[7],
      '  3,  19,  51', // sky8[7],
      ' 13,  75,  11', // fern8[6],
      '155, 180, 223', // sky8[1],
      '245, 167, 143', // peach8[0],
      '107,  16, 104', // eggplant8[6],
      '227, 146, 247', // eggplant8[0],
    ];
    const option = 'bright';
    const result = createPalette11(option);
    expect(result).to.deep.equal(expectedResult);
    const result2 = selectPalette(10, option);
    expect(result2).to.deep.equal(expectedResult);
  });

  it('createPalette13', () => {
    const expectedResult = [
      '255 255 255', // white
      '227, 163,  79', // bark8[1]
      ' 79, 190,  64', // fern8[2]
      '186, 173,  26', // corn8[3]
      '203,  71,  43', // peach8[4],
      ' 93,   6,  22', // wine8[7],
      '  3,  19,  51', // sky8[7],
      ' 13,  75,  11', // fern8[6],
      '155, 180, 223', // sky8[1],
      '245, 167, 143', // peach8[0],
      '107,  16, 104', // eggplant8[6],
      '227, 146, 247', // eggplant8[0],
      '166, 114,  47', // bark8[3],
      ' 53,  74, 112', // sky8[4],
    ];
    const result = createPalette13();
    expect(result).to.deep.equal(expectedResult);
    const result2 = selectPalette(13);
    expect(result2).to.deep.equal(expectedResult);
  });

  it('createPalette13 bright', () => {
    const expectedResult = [
      '254, 128,  0',
      '  0, 254,  0',
      '254, 254,  0',
      '254,  0,   0',
      '169,  0,  81',
      '254,  0, 254',
      '  0,  0, 254',
      '255 255 255', // white
      '227, 163,  79', // bark8[1]
      ' 79, 190,  64', // fern8[2]
      '186, 173,  26', // corn8[3]
      '203,  71,  43', // peach8[4],
      ' 93,   6,  22', // wine8[7],
      '  3,  19,  51', // sky8[7],
      ' 13,  75,  11', // fern8[6],
      '155, 180, 223', // sky8[1],
      '245, 167, 143', // peach8[0],
      '107,  16, 104', // eggplant8[6],
      '227, 146, 247', // eggplant8[0],
      '166, 114,  47', // bark8[3],
      ' 53,  74, 112', // sky8[4],
    ];
    const option = 'bright';
    const result = createPalette13(option);
    expect(result).to.deep.equal(expectedResult);
    const result2 = selectPalette(12, option);
    expect(result2).to.deep.equal(expectedResult);
  });

  it('createPalette16', () => {
    const expectedResult = [
      '255 255 255', // white
      '227, 163,  79', // bark8[1]
      ' 79, 190,  64', // fern8[2]
      '186, 173,  26', // corn8[3]
      '203,  71,  43', // peach8[4],
      ' 93,   6,  22', // wine8[7],
      '  3,  19,  51', // sky8[7],
      ' 13,  75,  11', // fern8[6],
      '155, 180, 223', // sky8[1],
      '245, 167, 143', // peach8[0],
      '107,  16, 104', // eggplant8[6],
      '227, 146, 247', // eggplant8[0],
      '166, 114,  47', // bark8[3],
      ' 53,  74, 112', // sky8[4],
      '224, 116,  88', // peach8[2],
      '227, 243,  92', // corn8[0],
      ' 92,  55,   6', // bark8[7],
    ];
    const result = createPalette16();
    expect(result).to.deep.equal(expectedResult);
    const result2 = selectPalette(16);
    expect(result2).to.deep.equal(expectedResult);
  });

  it('createPalette16 bright', () => {
    const expectedResult = [
      '254, 128,  0',
      '  0, 254,  0',
      '254, 254,  0',
      '254,  0,   0',
      '169,  0,  81',
      '254,  0, 254',
      '  0,  0, 254',
      '255 255 255', // white
      '227, 163,  79', // bark8[1]
      ' 79, 190,  64', // fern8[2]
      '186, 173,  26', // corn8[3]
      '203,  71,  43', // peach8[4],
      ' 93,   6,  22', // wine8[7],
      '  3,  19,  51', // sky8[7],
      ' 13,  75,  11', // fern8[6],
      '155, 180, 223', // sky8[1],
      '245, 167, 143', // peach8[0],
      '107,  16, 104', // eggplant8[6],
      '227, 146, 247', // eggplant8[0],
      '166, 114,  47', // bark8[3],
      ' 53,  74, 112', // sky8[4],
      '224, 116,  88', // peach8[2],
      '227, 243,  92', // corn8[0],
      ' 92,  55,   6', // bark8[7],
    ];
    const option = 'bright';
    const result = createPalette16(option);
    expect(result).to.deep.equal(expectedResult);
    const result2 = selectPalette(15, option);
    expect(result2).to.deep.equal(expectedResult);
  });

  it('createPalette19', () => {
    const expectedResult = [
      '255 255 255', // white
      '227, 163,  79', // bark8[1]
      ' 79, 190,  64', // fern8[2]
      '186, 173,  26', // corn8[3]
      '203,  71,  43', // peach8[4],
      ' 93,   6,  22', // wine8[7],
      '  3,  19,  51', // sky8[7],
      ' 13,  75,  11', // fern8[6],
      '155, 180, 223', // sky8[1],
      '245, 167, 143', // peach8[0],
      '107,  16, 104', // eggplant8[6],
      '227, 146, 247', // eggplant8[0],
      '166, 114,  47', // bark8[3],
      ' 53,  74, 112', // sky8[4],
      '224, 116,  88', // peach8[2],
      '227, 243,  92', // corn8[0],
      ' 92,  55,   6', // bark8[7],
      '158,  66, 167', // eggplant8[3],
      '128, 248, 109', // fern8[0],
      '150,  46,  62', // wine8[4],
    ];
    const result = createPalette19();
    expect(result).to.deep.equal(expectedResult);
    const result2 = selectPalette(19);
    expect(result2).to.deep.equal(expectedResult);
  });

  it('createPalette19 bright', () => {
    const expectedResult = [
      '254, 128,  0',
      '  0, 254,  0',
      '254, 254,  0',
      '254,  0,   0',
      '169,  0,  81',
      '254,  0, 254',
      '  0,  0, 254',
      '255 255 255', // white
      '227, 163,  79', // bark8[1]
      ' 79, 190,  64', // fern8[2]
      '186, 173,  26', // corn8[3]
      '203,  71,  43', // peach8[4],
      ' 93,   6,  22', // wine8[7],
      '  3,  19,  51', // sky8[7],
      ' 13,  75,  11', // fern8[6],
      '155, 180, 223', // sky8[1],
      '245, 167, 143', // peach8[0],
      '107,  16, 104', // eggplant8[6],
      '227, 146, 247', // eggplant8[0],
      '166, 114,  47', // bark8[3],
      ' 53,  74, 112', // sky8[4],
      '224, 116,  88', // peach8[2],
      '227, 243,  92', // corn8[0],
      ' 92,  55,   6', // bark8[7],
      '158,  66, 167', // eggplant8[3],
      '128, 248, 109', // fern8[0],
      '150,  46,  62', // wine8[4],
    ];
    const option = 'bright';
    const result = createPalette19(option);
    expect(result).to.deep.equal(expectedResult);
    const result2 = selectPalette(18, option);
    expect(result2).to.deep.equal(expectedResult);
  });

  it('createPalette23', () => {
    const expectedResult = [
      '255 255 255', // white
      '227, 163,  79', // bark8[1]
      ' 79, 190,  64', // fern8[2]
      '186, 173,  26', // corn8[3]
      '203,  71,  43', // peach8[4],
      ' 93,   6,  22', // wine8[7],
      '  3,  19,  51', // sky8[7],
      ' 13,  75,  11', // fern8[6],
      '155, 180, 223', // sky8[1],
      '245, 167, 143', // peach8[0],
      '107,  16, 104', // eggplant8[6],
      '227, 146, 247', // eggplant8[0],
      '166, 114,  47', // bark8[3],
      ' 53,  74, 112', // sky8[4],
      '224, 116,  88', // peach8[2],
      '227, 243,  92', // corn8[0],
      ' 92,  55,   6', // bark8[7],
      '158,  66, 167', // eggplant8[3],
      '128, 248, 109', // fern8[0],
      '150,  46,  62', // wine8[4],
      '150, 106,  15', // corn8[7]
      ' 38, 119,  31', // fern8[4],
      '227, 124, 131', // wine8[1],
      '189,  40,  11', // peach8[6],
    ];
    const result = createPalette23();
    expect(result).to.deep.equal(expectedResult);
    const result2 = selectPalette(22);
    expect(result2).to.deep.equal(expectedResult);
  });

  it('createPalette23 bright', () => {
    const expectedResult = [
      '254, 128,  0',
      '  0, 254,  0',
      '254, 254,  0',
      '254,  0,   0',
      '169,  0,  81',
      '254,  0, 254',
      '  0,  0, 254',
      '255 255 255', // white
      '227, 163,  79', // bark8[1]
      ' 79, 190,  64', // fern8[2]
      '186, 173,  26', // corn8[3]
      '203,  71,  43', // peach8[4],
      ' 93,   6,  22', // wine8[7],
      '  3,  19,  51', // sky8[7],
      ' 13,  75,  11', // fern8[6],
      '155, 180, 223', // sky8[1],
      '245, 167, 143', // peach8[0],
      '107,  16, 104', // eggplant8[6],
      '227, 146, 247', // eggplant8[0],
      '166, 114,  47', // bark8[3],
      ' 53,  74, 112', // sky8[4],
      '224, 116,  88', // peach8[2],
      '227, 243,  92', // corn8[0],
      ' 92,  55,   6', // bark8[7],
      '158,  66, 167', // eggplant8[3],
      '128, 248, 109', // fern8[0],
      '150,  46,  62', // wine8[4],
      '150, 106,  15', // corn8[7]
      ' 38, 119,  31', // fern8[4],
      '227, 124, 131', // wine8[1],
      '189,  40,  11', // peach8[6],
    ];
    const option = 'bright';
    const result = createPalette23(option);
    expect(result).to.deep.equal(expectedResult);
    const result2 = selectPalette(23, option);
    expect(result2).to.deep.equal(expectedResult);
    const result3 = selectPalette(500, option);
    expect(result3).to.deep.equal(expectedResult);
  });

  it('createNamed', ()=>{
    const expectedResult = { 
      white: '255 255 255',
      mocha: '227, 163,  79',
      cinnamon: '166, 114,  47',
      chocolate: ' 92,  55,   6',
      sprite: '128, 248, 109',
      lime: ' 79, 190,  64',
      chartreuse: ' 38, 119,  31',
      forest: ' 13,  75,  11',
      parchment: '227, 243,  92',
      mustard: '186, 173,  26',
      tan: '150, 106,  15',
      skin: '245, 167, 143',
      coral: '224, 116,  88',
      papaya: '203,  71,  43',
      nandina: '189,  40,  11',
      pink: '227, 124, 131',
      rose: '150,  46,  62',
      merlot: ' 93,   6,  22',
      lavendar: '227, 146, 247',
      lilac: '158,  66, 167',
      aubergine: '107,  16, 104',
      sea: '155, 180, 223',
      dusk: ' 53,  74, 112',
      navy: '  3,  19,  51' 
    };
    const result = createNamed();
    expect(result).to.deep.equal(expectedResult);
  });
  it('createNamed bright', ()=>{
    const expectedResult = { 
      white: '255 255 255',
      mocha: '227, 163,  79',
      cinnamon: '166, 114,  47',
      chocolate: ' 92,  55,   6',
      sprite: '128, 248, 109',
      lime: ' 79, 190,  64',
      chartreuse: ' 38, 119,  31',
      forest: ' 13,  75,  11',
      parchment: '227, 243,  92',
      mustard: '186, 173,  26',
      tan: '150, 106,  15',
      skin: '245, 167, 143',
      coral: '224, 116,  88',
      papaya: '203,  71,  43',
      nandina: '189,  40,  11',
      pink: '227, 124, 131',
      rose: '150,  46,  62',
      merlot: ' 93,   6,  22',
      lavendar: '227, 146, 247',
      lilac: '158,  66, 167',
      aubergine: '107,  16, 104',
      sea: '155, 180, 223',
      dusk: ' 53,  74, 112',
      navy: '  3,  19,  51',
      blue:   '  0,   0, 254',
      brown:  '254, 128,   0',
      green:  '  0, 254,   0',
      purple: '254,   0, 254',
      red:    '254,   0,   0',
      violet: '169,   0,  81',
      yellow: '254, 254,   0',
    };
    const result = createNamed('bright');
    expect(result).to.deep.equal(expectedResult);
  });

  it('createPreSetGlobalPalettes', () => {
    const expectedResult = {
      blue: [
        '  0,   0, 254',
        '189, 209, 245',
        '155, 180, 223',
        '123, 147, 190',
        ' 81, 103, 144',
        ' 53,  74, 112',
        ' 33,  53,  93',
        ' 14,  34,  71',
        '  3,  19,  51',
      ],
      green: [
        '  0, 254,   0',
        '128, 248, 109',
        ' 99,  24,  79',
        ' 79, 190,  64',
        ' 56, 150,  45',
        ' 38, 119,  31',
        ' 24,  93,  19',
        ' 13,  75,  11',
        ' 92,  55,   6',
      ],
      orange: [
        '254, 128,   0',
        '246, 189, 111',
        '227, 163,  79',
        '205, 145,  67',
        '166, 114,  47',
        '137,  90,  30',
        '115,  74,  19',
        '102,  62,  12',
        ' 92,  55,   6',
      ],
      purple: [
        '169,   0,  81',
        '243, 158, 162',
        '227, 124, 131',
        '202.  99, 108',
        '174,  70,  83',
        '150,  46,  62',
        '132,  28,  45',
        '118,  15,  34',
        ' 93,   6,  22',
      ],
      red: [
        '254,   0,   0',
        '245, 167, 143',
        '234, 138, 110',
        '224, 116,  88',
        '213,  91,  63',
        '203,  71,  43',
        '196,  54,  25',
        '189,  40,  11',
        '165,  31,   5',
      ],
      violet: [
        '254,   0, 254',
        '227, 146, 247',
        '206, 114, 225',
        '183,  92, 197',
        '158,  66, 167',
        '135,  44, 139',
        '117,  26, 117',
        '107,  16, 104',
        ' 88,   6,  83',
      ],
      yellow: [
        '254, 254,   0',
        '227, 243,  92',
        '220, 233,  49',
        '203, 204,  31',
        '186, 173,  26',
        '174, 150,  22',
        '163, 130,  19',
        '155, 116,  17',
        '150, 106,  15',
      ],
    };
    const result = createPreSetGlobalPalettes();
    expect(result).to.deep.equal(expectedResult);
  });

});