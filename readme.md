Preprocessor for react-chart-js. More info to come.

For graphing we are using the react chart js library. This is a pre-processor for that library to handle all of the prop requirements.

dataType2 is a compound array of objects
dataType1 is a simple array of objects
dataType0 is what reactchart.js receives so this library will convert those data types to the correct type.

`dataType1 = [
  { a: 3, b: 7 }, 
  { a: 5, b: 2 }
]`

`dataType0 = [
  [3, 7],
  [5, 2]
]
`

There are helpers-developer-warnings to prevent incorrect data types from being accepted.
