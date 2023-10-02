import React, 
  { useEffect, useState }       from 'react';
import { Line }                 from 'react-chartjs-2';
import { 
  isPrimitiveNumber,
  parseEvent,
  isObjectLiteral}              from 'conjunction-junction';
import { calcDimensions }       from 'browser-helpers';
import { 
	createPresetGlobalPalettes,
	createNamed,
	selectPalette,
	listBright }                  from 'pretty-colors';
import {
  unpackPreset,
  selectDefaultPreset }         from './helpers-preset-extract';
import {
  createLayersSelectedWithOneLayerFlipped,
  createLayersSelectedByGroup } from './helpers-layers';
import {
  createGraphInfoOnGroupOrMount,
	createGraph }                 from './helpers-graphs';
import { consoleDeveloperWarnings } from './helpers-developer-warnings';
import { formatControls }       from './helpers-controls';
import Controls                 from './2-controls';
import Footer                   from './2-footer';
import Selectors                from './3-selectors';

const indexAbbrev = 0;
const indexLabels = 1;
const indexUnits  = 2;
const indexDef    = 3;

const deepCopy = o => {
	if(Array.isArray(o)){
		return o.map(x=>deepCopy(x));
	}
	if(isObjectLiteral(o)){
		const newO = {};
		for(let k in o){
			newO[k] = deepCopy(o[k]);
		}
		return newO;
	}
	return o;
};

export default function RCJSPP(props) {
  
	// @@@@@@@@@@@@@@ STATE CONSTANTS @@@@@@@@@@@@@@@@
	const verbose = !!props.verbose;
    const legendUnits = props.legendUnits||{};
	const [legendHash, setLegendHash] = useState(props.legendHash || {});
	const [legendDescription, setLegendDescription] = useState(props.legendDescription || '');

	const [allowed] = useState({
		selectorsAllow:         typeof props.selectorsAllow  === 'boolean' ? props.selectorsAllow  : true,
		printAllow:             typeof props.printAllow      === 'boolean' ? props.printAllow      : true,
		backgroundAllow:        typeof props.backgroundAllow === 'boolean' ? props.backgroundAllow : true,
		advanceAllow:           typeof props.advanceAllow    === 'boolean' ? props.advanceAllow    : false,
		retreatAllow:           typeof props.retreatAllow    === 'boolean' ? props.retreatAllow    : false,
		yAxisAllow:             typeof props.yAxisAllow      === 'boolean' ? props.yAxisAllow      : true,
		groupAllow:             typeof props.groupAllow      === 'boolean' ? props.groupAllow      : false,
		allowNewDataAsProps:    props.allowNewDataAsProps,

		footerInclude:          typeof props.footerInclude   === 'boolean' ? props.footerInclude   : true,
		selectorsInclude:       typeof props.selectorsInclude=== 'boolean' ? props.selectorsInclude: true,
	});


	// @@@@@@@@@@@ STATE STATUS @@@@@@@@@@@@@@@@

	const [waitingOnDataFromProps, setWaitingOnDataFromProps] = useState(false);
	const [hasMounted, setHasMounted] = useState(false);
	const [isHidden  , setIsHidden]   = useState(false);
	const [isReady   , setIsReady]    = useState(false);
	
	// @@@@@@@@@@@ STATE / NON-GRAPH @@@@@@@@@@@@@@@@

	const [selectorsPopover, setSelectorsPopover] = useState(false);
  const [selectorsInFocus, setSelectorsInFocus] = useState('none');

	const [css, setCss] = useState({
		cssStyleColorsNamedArray:    [],
		cssStyleColorsNamed:         props.cssStyleColorsNamed           || createNamed('bright'),
		cssRgbArray:                 props.cssRgbArray                   || selectPalette(30), // array of styles to loop through//  VVVVVVVVVVV edit location per project VVVVVVVVVVV
	
		cssDivOuter:                 {},
		cssDivGraph:                 {},
		cssDivControls:              {},
		cssDivFooter:                {},
		cssDivSelectors:             {},
		cssWidthOuter:               isPrimitiveNumber(props.cssWidthOuter) ? props.cssWidthOuter : 200,
		cssHeightOuter:              isPrimitiveNumber(props.cssHeightOuter) ? props.cssHeightOuter : 150,
		cssWidthControls:            isPrimitiveNumber(props.cssWidthControls) ? props.cssWidthControls : 40,
		cssHeightFooter:             isPrimitiveNumber(props.cssHeightFooter) ? props.cssHeightFooter : 160,
		cssHeightSelectors:          isPrimitiveNumber(props.cssHeightSelectors) ? props.cssHeightSelectors : 'auto',
		cssCanvasHeight:             0,
		cssCanvasWidth:              0,
	});

	// @@@@@@@@@@@@@@ STATE: GRAPH @@@@@@@@@@@@@@@@

	const [presets] = useState(props.presets || {});

	const [cssBackground, setCssBackground] = useState(props.cssBackground || 'gray');

	// keys mostly just initialized data types, see componentDidMount() for initialization
	const [layersAllPrefixed, setLayersAllPrefixed] = useState([]);
	const [layerUnitsArray, setLayerUnitsArray] = useState([]);
	const [layersGroupedByUnits, setLayersGroupedByUnits] = useState([[]]);
	const [layersThatHaveUnits, setLayersThatHaveUnits] = useState([]);
	const [layersSelected, setLayersSelected] = useState(
		Array.isArray(props.layersSelected) ? 
		props.layersSelected : []); // use as many keys as desired

	const [graphData, setGraphData] = useState( {}); // pass as props to graph
	const [graphOptions,  setGraphOptions] = useState( {   // pass as props to graph
		scales: {
			yAxes: [],
		},
	});
	// data
	const [dataType, setDataType] = useState(
		isPrimitiveNumber(props.dataType) ? props.dataType : 1);
	const [dataConvertFrom, setDataConvertFrom] = useState( isPrimitiveNumber(props.dataConvertFrom) ? 
	props.dataConvertFrom : 1); // convert from what to 1
	const [dataType1Raw, setDataType1Raw] = useState(
		Array.isArray(props.dataType1) ? 
		props.dataType1 : []);
	const [dataType1, setDataType1] = useState(
		Array.isArray(props.dataType1) ? 
		props.dataType1.map(d=>Object.assign({},d)) : []);
	const [dataType2Raw, setDataType2Raw] = useState(
		Array.isArray(props.dataType2) ? 
		props.dataType2 : [[]]);

	const [titleText, setTitleText] = useState(props.titleText || 'data');
	const [styles, setStyles] = useState({}); // populated on presetSelect
				
	const [groupColors, setGroupColors] = useState(props.groupColors || {});
	const [groupDotColors, setGroupDotColors] = useState({});
	const [isGrouped, setIsGrouped] = useState(
		typeof props.isGrouped  === 'boolean' ? 
		props.isGrouped : false);
	const [groupByOnMount] = useState(props.groupByOnMount);
	const [groupsSub, setGroupsSub] = useState(props.groupsSub);
	const [groups, setGroups] = useState([]);

	const [presetGlobalPalettes, setPresetGlobalPalettes] = useState([]);
	const [presetGlobalPalette, setPresetGlobalPalette] = useState('');
	const [presetGlobalColorOptions, setPresetGlobalColorOptions] = useState([]);
	
	const [presetIdActive, setPresetIdActive] = useState(props.presetIdActive || '' );

	const [xStart, setXStart] = useState((props.xStart) ? props.xStart : 0); 
	const handleXStartChange = (e) => {
		const newValue = parseInt(e.target.value) < xEnd ? parseInt(e.target.value): xEnd-1;
		setXStart(newValue); // Update the local state
		props.handleChange('xStart', newValue); // Send the changes to parent
		var graphState = packGraphState(_defineProperty({}, 'xStart', newValue));
		var skipPacking = true;
		handleGraphChange(graphState, skipPacking);
	  };
	  
	const [xEnd, setXEnd] = useState((props.xEnd) ? props.xEnd : 1000); 
	const handleXEndChange = (e) => {
		const newValue = parseInt(e.target.value)  > xStart ? parseInt(e.target.value) : xStart+1;
		setXEnd(newValue); // Update the local state
		props.handleChange('xEnd', newValue); // Send the changes to parent
		var graphState = packGraphState(_defineProperty({}, 'xEnd', newValue));
		var skipPacking = true;
		handleGraphChange(graphState, skipPacking);
	  };
	const [incrementSize, setIncrementSize] = useState((props.incrementSize) ? props.incrementSize : 6);
	const [xIdealTickSpacing, setXIdealTickSpacing] = useState((props.xIdealTickSpacing) ? props.xIdealTickSpacing : 6);
	const handleIncrementSizeChange = (e) => {
		const newValue = e.target.value;
		setXMaxTickSpacing(newValue); // Update the local state
		setXIdealTickSpacing(newValue);
		props.handleChange('incrementSize', newValue); // Send the changes to parent
		var graphState = packGraphState(_defineProperty({}, 'xIdealTickSpacing', newValue));
		var skipPacking = true;
		handleGraphChange(graphState, skipPacking);
	  
	  };
	const [xMaxTickSpacing, setXMaxTickSpacing] = useState((props.xMaxTickSpacing)   ? props.xMaxTickSpacing   : 50);
	const [xLabelKey, setXLabelKey] = useState(props.xLabelKey         || null );
	const [xLabel, setXLabel] = useState(props.xLabel);
	
	const [yAxisArray, setYAxisArray] = useState([]);   // used as history in createGraph()
	const [yAxisUnitOptions, setYAxisUnitOptions] = useState(Array.isArray(props.yAxisUnitOptions) && props.yAxisUnitOptions[0] ? props.yAxisUnitOptions[0] : {} );
	const [yAxisInFocus, setYAxisInFocus] = useState(0);

	const packGraphState = (gs, full) => {
		const graphState = {       // modified via          used by
			layersAllPrefixed,       // handleGroupBy         unpackPreset
			                         // createGraphInfoOnGroupOrMount
			layerUnitsArray,         // handleGroupBy         
			                         // createGraphInfoOnGroupOrMount
			layersGroupedByUnits,    // handleGroupBy         
			                         // createGraphInfoOnGroupOrMount
			layersThatHaveUnits,     // handleGroupBy         
						                   // createGraphInfoOnGroupOrMount
			layersSelected,          // handlePresetSelect,   createLayersSelectedByGroup, createGraph
			                         // toggleLayerGroup,     createLayersSelectedWithOneLayerFlipped
															 // handleLayerSelection  

			dataType,                // handleGroupBy
			                         // createGraphInfoOnGroupOrMount
			dataConvertFrom,         // handleGroupBy
			dataType1Raw,            // updateDataFromProps   createGraphInfoOnGroupOrMount
			dataType1,               // updateDataFromProps   createGraph
												       // handleGroupBy,        
															 // updateDataFromProps
												  		 // createGraphInfoOnGroupOrMount
			dataType2Raw,            // handleGroupBy
															 // createGraphInfoOnGroupOrMount
			groupColors,             // handlePresetSelect    unpackPreset, 
			groupDotColors,          // handlePresetSelect                  
			isGrouped,               // handleGroupBy         unpackPreset
			groupByOnMount,          // NONE                  createGraphInfoOnGroupOrMount
			// groupByNow:           // handleGroupBy         createGraphInfoOnGroupOrMount
			groupsSub,               // NONE                  unpackPreset
			groups,                  // handleGroupBy         unpackPreset
			presetGlobalPalettes,    // NONE                  unpackPreset
			presetGlobalPalette,     // NONE
			presetGlobalColorOptions,// NONE                  unpackPreset
			presetIdActive,          // handlePresetSelect    
			styles,                  // handlePresetSelect    createGraph
			// prefixesToKeepGroups,    // handlePresetSelect    
			// prefixesToKeepGroupsSub, // handlePresetSelect    
			xStart,                  // handleRangeChange     createGraph
			xEnd,                    // handleRangeChange     createGraph
			xIdealTickSpacing,       // handleTickChange      createGraph
			xLabelKey,               // NONE									createGraph
			xLabel,                  // NONE									createGraph
			yAxisArray,              // handleGraphChange
			yAxisUnitOptions,        // handleYAxisSelector   createGraph
			yAxisInFocus,            // handleYAxisSelector
			legendHash,              // handleGroupBy         createGraph
			legendUnits,
			                         // createGraphInfoOnGroupOrMount
			cssBackground,           // handleBackgroundColor createGraph
			cssStyleColorsNamed: css.cssStyleColorsNamed,
															 // NONE                  createGraph
			cssRgbArray: css.cssRgbArray,
															 // NONE                  createGraph
		};

		if(full){
			graphState.allowed           = allowed;
			graphState.waitingOnDataFromProps = waitingOnDataFromProps;
			graphState.hasMounted        = hasMounted;
			graphState.isHidden          = isHidden;
			graphState.isReady           = isReady;
			graphState.selectorsPopover  = selectorsPopover;
			graphState.selectorsInFocus  = selectorsInFocus;
			graphState.titleText         = titleText;
			graphState.css               = css;
			graphState.graphData         = graphData;
			graphState.graphOptions      = graphOptions;
		}

		if(isObjectLiteral(gs)){
			for(let k in gs){
				graphState[k] = gs[k];
			}
		}

		return graphState;
	};

  // @@@@@@@@@@@@@@@@@@ END STATE @@@@@@@@@@@@@@@@

  useEffect(()=>{
		if(!hasMounted){
			if(typeof props.onMount === 'function'){
				props.onMount();
			}
			if(props.developerWarnings){
				consoleDeveloperWarnings(props);
			}

			// CSS ok to populate like this b/c
			// on mount gets only primitives
			// updating here gets objects & arrays
			const dimensions = calcDimensions(css);
			const newCss = {
				...css,
				...dimensions,
			};
			setCss(newCss); // end CSS populate

			setSelectorsInFocus(
        !allowed.selectorsAllow ? 
				'none' : // set on mount, does not change
        props.selectorsInFocus ? 
        props.selectorsInFocus :
        'layers');
				
			const graphState = packGraphState();

			graphState.presetIdActive = 
        presets && 
        presets[props.presetIdActive] ?
        props.presetIdActive : 
        selectDefaultPreset(presets);
			setPresetIdActive(graphState.presetIdActive);
			
			// options and pallettes are necessary for tests, even when editing is not allowed
      // all these are necessary for editing
      graphState.presetGlobalColorOptions = listBright();
      graphState.presetGlobalPalettes = createPresetGlobalPalettes();
      graphState.presetGlobalPalette = graphState.presetGlobalPalettes[graphState.presetGlobalColorOptions[0]];
			setPresetGlobalColorOptions(graphState.presetGlobalColorOptions);
			setPresetGlobalPalettes(graphState.presetGlobalPalettes);
			setPresetGlobalPalette(graphState.presetGlobalPalette);

			const graphInfo = createGraphInfoOnGroupOrMount(graphState, legendHash, indexUnits);
			graphState.verbose              = verbose;
			graphState.layersThatHaveUnits  = graphInfo.layersThatHaveUnits;
			graphState.layersAllPrefixed    = graphInfo.layersAllPrefixed;
			graphState.layersGroupedByUnits = graphInfo.layersGroupedByUnits;
			graphState.layerUnitsArray      = graphInfo.layerUnitsArray;
			graphState.dataType             = graphInfo.dataType;
			graphState.dataType1            = graphInfo.dataType1;
			setLayersThatHaveUnits(           graphInfo.layersThatHaveUnits);
			setLayersAllPrefixed(             graphInfo.layersAllPrefixed);
			setLayersGroupedByUnits(          graphInfo.layersGroupedByUnits);
			setLayerUnitsArray(               graphInfo.layerUnitsArray);
			setDataType(                      graphInfo.dataType);
			setDataType1(                     graphInfo.dataType1);
			setLegendHash(                    graphInfo.legendHash);
			const skipPacking = true;
			handlePresetSelect(graphState.presetIdActive, graphState, skipPacking);
			setHasMounted(true);
			setIsReady(true);
		}

	}, [hasMounted]);


	// @@@@@@@@@@@@@@@@@@ MAJOR RENDERING @@@@@@@@@@@@@@@@

  const handleGraphChange = (gs, skipPacking) => {
		// graphState is OK to mutate
		// graphState NEVER affects state (in hooks)
		// graphState is ONLY sent to functional helpers to create objects
		// those objects or keys from those objects are then sent to state
		// if you want to change state to match graphState, you MUST set each individual key before sending here
		// sending here only affects the graph output, but does not update user input, which can lead to bugginess if you do not set state BEFORE sending here!
		const graphState = skipPacking ? gs : packGraphState(gs);
	  // createGraph consumes newGs (partial state, what changes only)
		// and graphState (what already exists)
		// then merges those into a new graphState
    const theGraph = createGraph(graphState);
		setGraphData(theGraph.graphData);
		setGraphOptions(theGraph.graphOptions);
		setYAxisArray(theGraph.yAxisArray);
		setIsReady(true);
    if(theGraph.needsRefresh){
      setTimeout(()=>{
				setIsHidden(true);
			}, 300);
			setTimeout(()=>{
				setIsHidden(false);
			}, 400);
    }
  };

	const handlePresetSelect = (presetId, gs, _skipPacking) => {

		const graphState = 
		  !isObjectLiteral(gs) ? packGraphState() :
			_skipPacking ? gs : 
			packGraphState(gs);
		const thisPreset = presets ? presets[presetId] : null ;
		if(!isObjectLiteral(thisPreset)) {
			return;
		}
		const unpackedPreset = unpackPreset(graphState, thisPreset, presetId);
		graphState.groupColors    = unpackedPreset.groupColors;
		graphState.groupDotColors = unpackedPreset.groupDotColors;
		graphState.presetIdActive = unpackedPreset.presetIdActive;
		graphState.styles         = unpackedPreset.styles;
		graphState.layersSelected = unpackedPreset.layersSelected;
		setGroupColors(             unpackedPreset.groupColors);
		setGroupDotColors(          unpackedPreset.groupDotColors);
		setPresetIdActive(          unpackedPreset.presetIdActive);
		setStyles(                  unpackedPreset.styles);
    setLayersSelected(          unpackedPreset.layersSelected);
		// graphState.prefixesToKeepGroups    = unpackedPreset.prefixesToKeepGroups;
		// graphState.prefixesToKeepGroupsSub = unpackedPreset.prefixesToKeepGroupsSub;
		// setPrefixesToKeepGroups(unpackedPreset.prefixesToKeepGroups);
		// setPrefixesToKeepGroupsSub(unpackedPreset.prefixesToKeepGroupsSub);
		const skipPacking = true; // always b/c packed above
		handleGraphChange(graphState, skipPacking);
  };

  // @@@@@@@@@@@@ CHANGE GRAPH: LAYERS @@@@@@@@@@@@@@

  const handleLayerSelection = (event, gs, _skipPacking) => {
		const graphState = 
			!isObjectLiteral(gs) ? packGraphState() :
			_skipPacking ? gs : 
			packGraphState(gs);
		const layerSelected = parseEvent(event);
    if(!layerSelected) {
			return;
		}
		console.log({layerSelected})
		// createLayersSelectedWithOneLayerFlipped returns layersSelected with the first argument flipped
		// i.e. if first argument already selected, removes,
		// if first argument not selected, adds
    const _layersSelected = createLayersSelectedWithOneLayerFlipped(layerSelected, layersSelected);
		graphState.layersSelected = _layersSelected;
		setLayersSelected(_layersSelected);
		const skipPacking = true; // always b/c packed above
		handleGraphChange(graphState, skipPacking);
  };

  const toggleLayerGroup = group => {
    if(!isObjectLiteral(layersGroupedByUnits)) {
			return;
		}
    const theGroup = layersGroupedByUnits[group];
    if(!Array.isArray(theGroup)) {
			return;
		}
    const _layersSelected = createLayersSelectedByGroup(layersSelected, theGroup);
		setLayersSelected(_layersSelected);
		const graphState = packGraphState({layersSelected: _layersSelected});
		const skipPacking = true;
    handleGraphChange(graphState, skipPacking);
  };
  
  // @@@@@@@@@@@@@@@@@@ CHANGE GRAPH: AXES @@@@@@@@@@@@@@@@

  const handleRangeChange = (event, key) => {
		const value = parseInt(event.target.value,10) ;
		if(key === 'xStart' || key === 'xEnd'){
			const graphState = packGraphState({[key]: value});
			if(key==='xStart'){
				setXStart(value);
			} else {
				setXEnd(value);
			}
			const skipPacking = true;
			handleGraphChange(graphState, skipPacking);
		}
  };

  const handleTickChange = event => {
    const rawValue = parseInt(event.target.value,10) ;
    const value =
      !isPrimitiveNumber(rawValue) ? 6 :
      rawValue < 1 ? 1 :
      rawValue > xMaxTickSpacing ? xMaxTickSpacing :
      rawValue;
		const graphState = packGraphState({xIdealTickSpacing: value});
		setXIdealTickSpacing(value);
		const skipPacking = true;
    handleGraphChange(graphState, skipPacking);
  };

	const handleYAxisSelector = () => {
		const yAxesLength = Array.isArray(props.yAxisUnitOptions) ? props.yAxisUnitOptions.length : 0 ;
		const _yAxisInFocus = 
			isPrimitiveNumber(yAxisInFocus) && 
			yAxisInFocus + 1 <= yAxesLength - 1 ?
			yAxisInFocus + 1 :
			0;
		setYAxisInFocus(_yAxisInFocus);

		const _yAxisUnitOptions = 
			Array.isArray(props.yAxisUnitOptions) ? 
			props.yAxisUnitOptions[yAxisInFocus] :
			{};
		setYAxisUnitOptions(_yAxisUnitOptions);

		const graphState = packGraphState({
			yAxisInFocus: _yAxisInFocus,
			yAxisUnitOptions: _yAxisUnitOptions,
		});
		handleGraphChange(graphState, true);
	};

	// @@@@@@@@@@@@@ CHANGE GRAPH: GROUPING @@@@@@@@@@@@@@@@

	const handleGroupBy = event => {
    // handleGroupBy should ONLY run from subcomponents
    // convert data type 1 to type 2
    const _groupByNow = parseEvent(event);
    if(!_groupByNow) {
			return;
		}

		const graphState = packGraphState();

		graphState.groupByNow = _groupByNow;
    const graphInfo = createGraphInfoOnGroupOrMount(graphState, legendHash);
    
		graphState.dataType              = graphInfo.dataType;
		graphState.dataType1             = graphInfo.dataType1;
		graphState.layersThatHaveUnits   = graphInfo.layersThatHaveUnits;
		graphState.layersAllPrefixed     = graphInfo.layersAllPrefixed;
		graphState.layersGroupedByUnits  = graphInfo.layersGroupedByUnits;
		graphState.layerUnitsArray       = graphInfo.layerUnitsArray;
		setDataType(                       graphInfo.dataType);
		setDataType1(                      graphInfo.dataType1);
		setLayersThatHaveUnits(            graphInfo.layersThatHaveUnits);
		setLayersAllPrefixed(              graphInfo.layersAllPrefixed);
		setLayersGroupedByUnits(           graphInfo.layersGroupedByUnits);
		setLayerUnitsArray(                graphInfo.layerUnitsArray);
		setLegendHash(                     graphInfo.legendHash);
  };

  // @@@@@@@@@@@ FUNCTIONS THAT DEAL WITH NEW PROPS @@@@@@@@@@@

	const updateDataFromProps = () => {

    const dataType1Old = Array.isArray(dataType1Raw) ? dataType1Raw : [];
    let dataType1New = Array.isArray(props.dataType1) ? props.dataType1 : [];

    const extendedLength = dataType1New.length - dataType1Old.length;
    if(extendedLength > 0){

      const dataToAdd = dataType1New.slice(dataType1New.length-newIsLonger,dataType1New.length);
      dataType1New = [...dataType1New, ...dataToAdd];
			const dataType1Raw = dataType1New.map(d=>Object.assign({},d));

			const graphState = packGraphState({
				dataType1 : dataType1New,
				dataType1Raw,
			});
			setDataType1(         dataType1New);
			setDataType1Raw(      dataType1Raw);
			const skipPacking = true;
      handleGraphChange(graphState, skipPacking);
    }
  };

  const advanceDataFromProps = () => {
    if(waitingOnDataFromProps &&
			props.keyToCompareOnAdvance && 
      Array.isArray(props.dataType1) && 
			Array.isArray(dataType1Raw) &&
      isObjectLiteral(props.dataType1[0]) &&
			isObjectLiteral(dataType1Raw[0]) &&
			props.dataType1[0][props.keyToCompareOnAdvance] !== dataType1Raw[0][props.keyToCompareOnAdvance] ) {
				
			const graphState = packGraphState({
				legendHash        : props.legendHash,
				titleText         : props.titleText,
				dataType1Raw      : props.dataType1,
			});
			setTitleText(        props.titleText);
			setDataType1Raw(     props.dataType1);

			if(graphState.groupByOnMount){
				const graphInfo = createGraphInfoOnGroupOrMount(graphState, legendHash);
				graphState.layersThatHaveUnits  = graphInfo.layersThatHaveUnits;
				graphState.layersAllPrefixed    = graphInfo.layersAllPrefixed;
				graphState.layersGroupedByUnits = graphInfo.layersGroupedByUnits;
				graphState.layerUnitsArray      = graphInfo.layerUnitsArray;
				graphState.dataType1            = graphInfo.dataType1;  
				setLayersThatHaveUnits(           graphInfo.layersThatHaveUnits);
				setLayersAllPrefixed(             graphInfo.layersAllPrefixed);
				setLayersGroupedByUnits(          graphInfo.layersGroupedByUnits);
				setLayerUnitsArray(               graphInfo.layerUnitsArray);
				setDataType1(                     graphInfo.dataType1);        
				setLegendHash(                    graphInfo.legendHash);
			}
			setWaitingOnDataFromProps(false);
			const skipPacking = true;
			handleGraphChange(graphState, skipPacking);
    }
  };

  const graphAdvance = advanceBy => {
    if(typeof props.handleFetchAdvanceRequest === 'function'){
      setWaitingOnDataFromProps(true);
      // the timeout is because the spinner doesn't load instantly
      props.handleFetchAdvanceRequest(advanceBy);
    } else {
      console.warn('handleFetchAdvanceRequest is not a function')
    }
  };

	useEffect(()=>{
    if(waitingOnDataFromProps) {
      advanceDataFromProps();
    } else if(allowed.allowNewDataAsProps){
      if(dataType1Raw !== props.dataType1){
        updateDataFromProps();
      }
    }
  });
  
	// @@@@@@@@@@@@@@@@@@ SELECTORS @@@@@@@@@@@@@@@@

	const toggleSelectorsPopover = () => {
		setSelectorsPopover(!selectorsPopover);
	};

	const toggleSelectorsInFocus = focus => {
		setSelectorsInFocus(focus || 'none');
	};

	// @@@@@@@@@@@@@@@@@ MINOR CONTROLS @@@@@@@@@@@@@@@@

	const handleBackgroundColor = color => {
		// toggle background between white and black, graph font color is opposite
		// hides then shows graph to force a re-render of the canvas
		const _cssBackground = 
			color === 'white' ? 'white' :
			color === 'gray' ? 'gray' :
			cssBackground === 'white' ?
				'gray' : 
				'white' ;
		setCssBackground(_cssBackground);
		if(typeof props.handleBackgroundColor === 'function'){
			props.handleBackgroundColor(_cssBackground);
		} else {
			console.warn('handleBackgroundColor is not a function');
		}
	};

	const printGraph = () => {
		if(css.cssBackground=== 'white') { // if already white, print, else, turn white, wait, then print
			window.print();
		} else {
			handleBackgroundColor('white');
			setTimeout(()=>{
				window.print();
			}, 2000); // 2000 seems to be long enough to complete canvas animations before printing
		}
	};

	const [controls, setControls] = useState(
		formatControls(
			{
				printAllow:      allowed.printAllow, // all below are set on mount, not changed after
				backgroundAllow: allowed.backgroundAllow,
				yAxisAllow:      allowed.yAxisAllow,
				selectorsAllow:  allowed.selectorsAllow,
				presets: props.presets,
			}, {
				printGraph,
				handleBackgroundColor,
				handleYAxisSelector,
				toggleSelectorsPopover,
				handlePresetSelect,
			}
		)
	);

	// @@@@@@@@@@@@@@@@@@ RENDER @@@@@@@@@@@@@@@@

	const footerFontColor = cssBackground === 'white' ? '#333' : 'white' ;
	const bp = 500; // breakpoint

	const spinnerMargin = 80;
	const spinnerSize = (Math.random()*20)+40;
	const spinnerColorIndex = Math.floor(Math.random()*5);
	const spinnerColors = ['red', 'yellow', 'pink', 'green', 'purple', 'blue'];
	const spinnerColor = spinnerColors[spinnerColorIndex] || 'white' ;

	const controlsElement = <Controls
		controls        ={controls}
		cssBackground   ={cssBackground}
		presets         ={presets}
		presetIdActive  ={presetIdActive}
		selectorsPopover={selectorsPopover}
		toggleSelectorsInFocus={toggleSelectorsInFocus} />
	
	const graph = isReady && !isHidden ?
		<Line 
			data   ={graphData   } 
			options={graphOptions}
			height ={css.cssCanvasHeight}
			width  ={css.cssCanvasWidth } /> : null ;
	
	const selectors = allowed.selectorsInclude ? <Selectors
		cssDivSelectors     ={css.cssDivSelectors}
		cssStyleColorsNamed ={css.cssStyleColorsNamed}

		legendHash          ={legendHash}

		indexDef            ={indexDef}
		selectorsInFocus    ={selectorsInFocus}

		groupAllow          ={allowed.groupAllow}

		isGrouped           ={isGrouped}
		xStart              ={xStart}
		handleXStartChange  ={handleXStartChange}
		xEnd                ={xEnd}
		handleXEndChange    ={handleXEndChange}
		xIdealTickSpacing   ={xIdealTickSpacing}
		handleXIdealTickSpacingChange ={handleIncrementSizeChange}
		layersThatHaveUnits ={layersThatHaveUnits}
		layersSelected      ={layersSelected}

		layerUnitsArray     ={layerUnitsArray}
		layersGroupedByUnits={layersGroupedByUnits}
		indexAbbrev         ={indexAbbrev}

		toggleLayerGroup    ={toggleLayerGroup}
		handleRangeChange   ={handleRangeChange}
		handleTickChange    ={handleTickChange}
		handleGroupBy       ={handleGroupBy}
		handleLayerSelection={handleLayerSelection} /> : null ;


	const footer = allowed.footerInclude ? <Footer
		cssDivFooter          ={css.cssDivFooter}
		waitingOnDataFromProps={waitingOnDataFromProps}
		bp                    ={bp}
		advanceAllow          ={allowed.advanceAllow}
		retreatAllow          ={allowed.retreatAllow}

		groupDotColors        ={groupDotColors}
		titleText             ={titleText}
		legendDescription     ={legendDescription}
		graphAdvance          ={graphAdvance}
	/> : null ;

	return <div className='rcjspp-outer'>
		<div className='rcjspp-inner' style={css.cssDivInner}>
			<div className='rcjspp-graph'
				style={css.cssDivGraph}>
				{graph}
			</div>
			<div className='rcjspp-controls'
				style={css.cssDivControls}>
				{controlsElement}
			</div>
		</div>
		{footer}
		{selectors}
		<style>{`
			.rcjspp-outer {
				position: relative;
				z-index: 7777;
				flex-direction: column;
			}
			.rcjspp-inner {
				flex-direction: row;
			}
			.rcjspp-graph {
				position: relative;
			}
			.rcjspp-controls {
				top: 0px;
				height: 100%;
				width: 30px;
				padding-right: 0;
				margin-right: 20px;
				flex-direction: column;
				justify-content: space-around;
				z-index: 9999;
			}
			@media print {
				.rcjspp-controls {
					display: none;
				}
			}


			.rcjspp-controls-outermost {
				top: 0px;
				height: 100%;
				width: 30px;
				padding-right: 0;
				margin-right: 20px;
				flex-direction: column;
				justify-content: space-around;
				z-index: 9999;
			}
			.tooltip .popover p.rcjspp-sel-popover:hover {
				color: rgb(103, 175, 103) !important;
			}
			.rcjspp-control {
				cursor: pointer;
				min-height: 25px;
			}
			.rcjspp-control.rcjspp-control-over-white{
				color: #333;
			}
			.rcjspp-control.rcjspp-control-over-gray {
				color: white;
			}
			.rcjspp-control.rcjspp-pre-set-control-active {
				color: orange;
			}
			@media print {
				.rcjspp-control {
					display: none !important;
				}
			}
			.rcjspp-control.rcjspp-control-print {
				display: none;
			}
			@media (min-width: 800px) {
				.rcjspp-control.rcjspp-control-print {
					display: flex;
				}
			}


			.rcjspp-title-inner-container {
				justify-content: center;
				align-items: center;
				margin-right: 25px;
				margin-left: 25px;
			}
			.rcjspp-title-color-dot {
				border-radius: 50%;
				height: 15px;
				width: 15px;
				background-color: white;
			}
			.rcjspp-title {
				color: ${footerFontColor};
				text-align: center;
				margin-top: 10px;
				margin-bottom: 10px;
				flex-grow: 1;
			}
			.rcjspp-title.rcjspp-subtitle {
				display: none;
			}
			@media print{
				.rcjspp-title.rcjspp-subtitle {
					display: block;
				}
			}
			.rcjspp-title-wrap-container {
				flex-wrap: wrap;
				justify-content: center;
				align-items: center;
				flex-grow: 1;
			}
			.rcjspp-title-major {
				margin-left: 3px;
			}
			.rcjspp-title-minor {
				font-weight: 100;
				font-size: 67%;
				opacity: 0.75;
				margin-left: 3px;
			}
			.rcjspp-title-inner-container {
				justify-content: center;
				align-items: center;
				margin-right: 25px;
				margin-left: 25px;
			}
			.rcjspp-title-color-dot {
				border-radius: 50%;
				height: 15px;
				width: 15px;
				background-color: white;
			}

			.rcjspp-footer {
				flex-direction: column;
			}
			@media print {
				.rcjspp-footer {
					display: none;
				}
			}
			.rcjspp-title {
				color: ${footerFontColor};
				text-align: center;
				margin-top: 10px;
				margin-bottom: 10px;
				flex-grow: 1;
			}
			.rcjspp-advance-spinner-container {
				height: 36px;
				overflow: hidden;
			}
			.rcjspp-advance-spinner-container .line-scale-pulse-out-rapid > div {
				background-color: white ;
			}
			.rcjspp-advance-button {
				position: absolute;
				width: 45px;
				justify-content: center;
				align-items: center;
			}
			.rcjspp-advance-button:hover {
				opacity: 0.7;
			}
			.rcjspp-advance-button-left {
				left: 0;
				bottom: 110px;
			}
			.rcjspp-advance-button-right {
				left: 0;
				bottom: 50px;
			}
			@media(min-width: ${bp}px){
				.rcjspp-advance-button-left {
					left: 0;
					bottom: 0;
				}
				.rcjspp-advance-button-right {
					left: auto;
					right: 0;
					bottom: 0;
				}
			}
			.rcjspp-control {
				cursor: pointer;
				color: ${footerFontColor};
			}
			@media print {
				.rcjspp-control {
					display: none !important;
				}
			}
			.rcjspp-footer-top {
				width: 100%;
				position: relative;
				justify-content: space-between;
				min-height: 36px;
			}
			.rcjspp-footer-bottom {
				width: 100%;
			}
			.rcjspp-footer-description {
				font-size: 12px;
				line-height: 14px;
				font-weight: 100;
				opacity: 0.85;
				text-align: left;
				color: ${footerFontColor};
				padding: 20px;
				width: 100%;
			}
	
			.rcjspp-advance-waiting {
				position: absolute;
				top: 50%;
				margin-top: -${spinnerSize/2}px;
			}
			.rcjspp-advance-waiting-left {
				left: ${spinnerMargin}px;
				margin-left: -${spinnerSize/2}px;
			}
			.rcjspp-advance-waiting-right {
				right: ${spinnerMargin}px;
				margin-right: -${spinnerSize/2}px;
			}
			.rcjspp-advance-waiting > div {
				width: ${spinnerSize}px;
				height: ${spinnerSize}px;
				background-color: ${spinnerColor};
				border-radius: 100%;
				-webkit-animation: blinking 1.0s infinite ease-in-out;
				animation: blinking 1.0s infinite ease-in-out;
			}
	
			@-webkit-keyframes blinking {
				0% { -webkit-transform: scale(0.0) }
				100% {
					-webkit-transform: scale(1.0);
					opacity: 0;
				}
			}
			
			@keyframes blinking {
				0% {
					transform: scale(0.0);
					-webkit-transform: scale(0.0);
				} 100% {
					transform: scale(1.0);
					-webkit-transform: scale(1.0);
					opacity: 0;
				}
			}


			.rcjspp-selectors-outermost {
				flex-direction: column;
			}
			@media print {
				.rcjspp-selectors-outermost {
					display: none;
				}
			}
			.rcjspp-sel-style-col-header {
				width: 10%;
				padding-left: 7px;
			}     
			.rcjspp-sel-style-select-shade {
				width: 40px;
			} 
			.rcjspp-sel-style-row-label {
				display: block;
				width: 20%;
				height: 100%;
				overflow: scroll;
				cursor: pointer;
				color: #aaa;
				padding-left: 10px;
			}
			.rcjspp-sel-style-row-active {
				color: inherit;
			}
			.rcjspp-sel-style-header-row {
				background-color: white;
				opacity: 0.85;
				justify-content: flex-end;
				width: 100%;
				height: 45px;
				padding-top: 5px;
			}
			.rcjspp-selectors {
				top: 100%;
				flex-direction: column;
				background-color: white;
				width: 100%;
				width: 100vw;
				z-index: 9999;
			}
			@media(min-width: 800px){
				.rcjspp-selectors {
					overflow-y: scroll;
				}
			}
			.rcjspp-pre-set-save-container {
				background-color: white;
				display: block;
				height: 75px;
			}


			.rcjspp-sel-row-form {
				width: 100%;
				justify-content: space-between;
				padding: 5px;
			}
			.rcjspp-sel-row-form-label {
				display: flex;
				margin-right: 20px;
				align-items: baseline;
			}
			.rcjspp-sel-row-form .rcjspp-sel-input {
				font-size: 16px;
				display: flex;
				min-height: 14px;
				padding: 3px;
				width: 4em;
			}
			.rcjspp-sel-row.rcjspp-sel-input-radio {
				width: 5%;
			}

			.rcjspp-sel-inner-container {
				padding: 5px;
				flex-direction: column;
			}
			.rcjspp-sel-checkbox-container {
				flex-direction: row;
				flex-wrap: wrap;
				margin-top: 15px;
				justify-content: space-around;
			}
			@media(min-width: 800px){
				.rcjspp-sel-checkbox-container {
					overflow-y: scroll;
				}
			}
			.rcjspp-sel-checkbox-group-container {
				flex-direction: column; 
				margin-bottom: 10px;
				margin-right: 20px;
			}
			.rcjspp-sel-checkbox-group-container .rcjspp-sel-checkbox-group-header {
				margin-top: 10px;
				margin-bottom: 5px;
			}
			.rcjspp-sel-checkbox-group .rcjspp-sel-label-radio {
				display: flex;
			}
			.rcjspp-sel-label-radio {
				cursor: pointer;
			}
			.rcjspp-sel-label-radio:hover {
				background-color: rgba(125, 157, 165, 0.1);
			}
			.rcjspp-sel-predicted-selector {
				color: red;
			}


			.rcjspp-pre-set-save-button {
				padding: 5px;
				margin-right: 20px;
			}
			.rcjspp-pre-set-save-toggle-container {
				flex-direction: column;
				margin: 15px;
				width: 200px;
				flex-grow: 0;
				flex-shrink: 0;
			}
			.rcjspp-pre-set-input-label {
				padding-left: 5px;
			}
			.rcjspp-pre-set-input {
				min-width: 150px;
			}
			.rcjspp-pre-set-save-inner-container {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				width: 100%;
			}
			.rcjspp-pre-set-selector {
				min-width: 100px;
			}

			.rcjspp-sel-style-body {
				overflow-y: scroll;
			}
			.rcjspp-sel-style-col-header {
				width: 10%;
				padding-left: 7px;
			}
			.rcjspp-sel-style-body {
				display: block;
				padding-top: 45px;
				margin-bottom: 20px;
			}
			.rcjspp-sel-style-row {
				height: 20px;
			}
			.rcjspp-sel-style-row-label {
				display: block;
				width: 20%;
				height: 100%;
				overflow: scroll;
				cursor: pointer;
				color: #aaa;
				padding-left: 10px;
			}
			.rcjspp-sel-style-row-active {
				color: inherit;
			}
			.rcjspp-sel-style-input,
			.rcjspp-sel-style-select {
				width: 10%;
				height: 100%;
			}
			.rcjspp-sel-style-select-shade {
				width: 40px;
			}
			.rcjspp-sel-disabled {
				color: transparent;
			}
		`}</style>
	</div>   
}