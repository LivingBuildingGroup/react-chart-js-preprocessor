import React                    from 'react';
import { Line }                 from 'react-chartjs-2';
import { 
  isPrimitiveNumber,
  parseEvent,
  isObjectLiteral}              from 'conjunction-junction';
import { calcDimensions }       from 'browser-helpers';
import { 
    createPreSetGlobalPalettes,
    createNamed,
    selectPalette,
    listBright }                from 'pretty-colors';
// import { 
//   createGraph,
//   formatGraphKeysInput,
//   createGraphInfoOnGroupOrMount, }       from '../rcjspp-graphing-helpers/graphs';
// import { 
//   unpackPreSet,
//   selectDefaultPreSet }                  from '../rcjspp-graphing-helpers/pre-set-extract';
// import {applyPreSetGlobalColorToStyles } from '../rcjspp-graphing-helpers/pre-set-edit';
// import {
//   createLayersSelected,
//   toggleLayerGroup,
//   createGroupByData,
//   parseDefaultLayerSelection }           from '../rcjspp-graphing-helpers/layers';
// import { createGoogleTagManagerClass }   from '../rcjspp-graphing-helpers/tracking';
// import { consoleDeveloperWarnings }      from '../rcjspp-graphing-helpers/developer-warnings';
import { 
  createGraph,
  formatGraphKeysInput,
  createGraphInfoOnGroupOrMount,
  unpackPreSet,
  selectDefaultPreSet,
  applyPreSetGlobalColorToStyles,
  createLayersSelected,
  toggleLayerGroup,
  createGroupByData,
  parseDefaultLayerSelection,
  createGoogleTagManagerClass,
  consoleDeveloperWarnings }    from 'graphing-helpers';
import { formatControls, }      from './control-helpers';
import Selectors                from './3selectors';
import Controls                 from './2controls';
import Footer                   from './2footer';

export default class RCJSPP extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      
      // status
      hide:                 false, // use this for a forced refresh
      ready:                false, // so graph doesn't load before data
      paused:               true,
      needRefresh:          false,
      waitingOnPreSetIdFromProps: false,
      waitingOnDataFromProps: false,

      // keys mostly just initialized data types, see componentDidMount() for initialization
      legendObject:          {},
      layersAllPrefixed:     [],
      layerUnitsArray:       [],
      layersGroupedByUnits:  [[]],
      layerGroupByJSXOptions:[],
      layersThatHaveUnits:   [],
      layersSelected:        Array.isArray(this.props.layersSelected) ? this.props.layersSelected : [], // use as many keys as desired

      legendUnits:           this.props.legendUnits       || {},
      legendLabels:          this.props.legendLabels      || {} ,
      legendAbbrevs:         this.props.legendUnits ? this.props.legendAbbrevs : this.props.legendLabels ? this.props.legendLabels : {} ,
      legendDefinitions:     this.props.legendDefinitions || {} ,
      legendDescription:     this.props.legendDescription || '',
      graphData:          {}, // pass as props to graph
      graphOptions:       {   // pass as props to graph
        scales: {
          yAxes: [],
        },
      },
      // data
      dataType:           isPrimitiveNumber(this.props.dataType) ? this.props.dataType : 1,
      dataConvertFrom:    isPrimitiveNumber(this.props.dataConvertFrom) ? this.props.dataConvertFrom : 1, // convert from what to 1
      dataType0Raw:       Array.isArray(this.props.dataType0) ? this.props.dataType0 : [],
      dataType1Raw:       Array.isArray(this.props.dataType1) ? this.props.dataType1 : [],
      dataType1Processed: [],
      dataType2Raw:       Array.isArray(this.props.dataType2) ? this.props.dataType2 : [[]],
      dataType2Processed: [[]],

      allowNewDataAsProps: this.props.allowNewDataAsProps,
      
      indexAbbrev:        0,
      indexLabels:        1,
      indexUnits:         2,
      indexDef:           3,

      graphName:                   this.props.graphName,
      titleText:                   this.props.titleText      || 'data',
      
      styles:                      this.props.styles         || {},
      
      cssStyleColorsNamedArray:    [],
      cssStyleColorsNamed:         this.props.cssStyleColorsNamed           || createNamed('bright'),
      cssRgbArray:                 this.props.cssRgbArray                   || selectPalette(30), // array of styles to loop through//  VVVVVVVVVVV edit location per project VVVVVVVVVVV
    
      cssBackground:               this.props.cssBackground                 || 'gray' ,
      cssLegendPosition:           this.props.cssLegendPosition             || 'bottom',

      cssDivOuter:                 {},
      cssDivGraph:                 {},
      cssDivControls:              {},
      cssDivFooter:                {},
      cssDivSelectors:             {},
      cssWidthOuter:               isPrimitiveNumber(this.props.cssWidthOuter) ? this.props.cssWidthOuter : 200,
      cssHeightOuter:              isPrimitiveNumber(this.props.cssHeightOuter) ? this.props.cssHeightOuter : 150,
      cssWidthControls:            isPrimitiveNumber(this.props.cssWidthControls) ? this.props.cssWidthControls : 40,
      cssHeightFooter:             isPrimitiveNumber(this.props.cssHeightFooter) ? this.props.cssHeightFooter : 160,
      cssHeightSelectors:          isPrimitiveNumber(this.props.cssHeightSelectors) ? this.props.cssHeightSelectors : 'auto',
      cssCanvasHeight:             0,
      cssCanvasWidth:              0,
            
      selectorsPopover:       false,
      selectorsInFocus:       'none', // this updates in componentDidMount
      preSetSaveAllow:        true,
      // configure settings in control bar
      selectorsAllow:         typeof this.props.selectorsAllow  === 'boolean' ? this.props.selectorsAllow  : true,
      selectorsInclude:       typeof this.props.selectorsInclude=== 'boolean' ? this.props.selectorsInclude: true,
      printAllow:             typeof this.props.printAllow      === 'boolean' ? this.props.printAllow      : true,
      backgroundAllow:        typeof this.props.backgroundAllow === 'boolean' ? this.props.backgroundAllow : true,
      advanceAllow:           typeof this.props.advanceAllow    === 'boolean' ? this.props.advanceAllow    : false,
      retreatAllow:           typeof this.props.retreatAllow    === 'boolean' ? this.props.retreatAllow    : false,
      yAxisAllow:             typeof this.props.yAxisAllow      === 'boolean' ? this.props.yAxisAllow      : true,
      footerInclude:          typeof this.props.footerInclude   === 'boolean' ? this.props.footerInclude   : true,
      // configure settings in selectors
      groupAllow:             typeof this.props.groupAllow      === 'boolean' ? this.props.groupAllow      : false,

      groupColors:            this.props.groupColors     || {},
      groupDotColors:         {},
      groupTrue:              typeof this.props.groupTrue  === 'boolean' ? this.props.groupTrue : false,
      groupByOnMount:         this.props.groupByOnMount,
      groupsSub:              this.props.groupsSub,
      groups:                 [],

      preSetGroupEditMode:    typeof this.props.preSetGroupEditMode === 'boolean' ? this.props.preSetGroupEditMode : false ,
      preSetGlobalPalettes:   [],
      preSetGlobalPalette:    '',
      preSetGlobalColorOptions: [],
      
      preSetSaveSettings:     {useOnlyExplicitStylesWhenUngrouped: false, prefixGroups: false, prefixGroupsSub: false, preSetSaveAsType: 'single', ...this.props.preSetSaveSettings } ,
      preSets:                this.props.preSets        || {},
      preSetIdActive:         this.props.preSetIdActive || '' ,
      // preSetIds:              [],
      // preSetStyleOptionsJSX:  [[]],

      keyToCompareOnAdvance: this.props.keyToCompareOnAdvance ? this.props.keyToCompareOnAdvance :
      this.props.keyToCompareOnNewData ? this.props.keyToCompareOnNewData : 'xLabel',

      xStart:             isPrimitiveNumber(this.props.xStart)            ? this.props.xStart            : 0, 
      xEnd:               isPrimitiveNumber(this.props.xEnd)              ? this.props.xEnd              : 1000, 
      xIdealTickSpacing:  isPrimitiveNumber(this.props.xIdealTickSpacing) ? this.props.xIdealTickSpacing : 6,
      xMaxTickSpacing:    isPrimitiveNumber(this.props.xMaxTickSpacing)   ? this.props.xMaxTickSpacing   : 50,
      xLabelStartAt:      this.props.xLabelStartAt     || null, // ignored if not a number
      xLabelKey:          this.props.xLabelKey         || null ,
      xLabel:             this.props.xLabel,
      beginAtZeroX:       typeof this.props.beginAtZeroX === 'boolean' ? this.props.beginAtZeroX : false ,
      stepSizeX:          isPrimitiveNumber(this.props.stepSizeX)         ? this.props.stepSizeX : undefined,
      
      yAxisArray:         [],   // used as history in createGraph()
      yAxisIdArray:       [],   // used as history in createGraph()
      yAxisUnitOptions:   Array.isArray(this.props.yAxisUnitOptions) && this.props.yAxisUnitOptions[0] ? this.props.yAxisUnitOptions[0] : {} ,
      yAxisInFocus:       0,

    };

    this.toggleLayerGroup       = this.toggleLayerGroup.bind(this);
    this.handleGroupBy          = this.handleGroupBy.bind(this);
    this.handleLayerSelection   = this.handleLayerSelection.bind(this);
    this.toggleSelectorsPopover = this.toggleSelectorsPopover.bind(this);
    this.toggleSelectorsInFocus = this.toggleSelectorsInFocus.bind(this);
    this.handleRangeChange      = this.handleRangeChange.bind(this);
    this.handleTickChange       = this.handleTickChange.bind(this);
    this.toggleLayerGroup       = this.toggleLayerGroup.bind(this);
    this.handleBackgroundColor  = this.handleBackgroundColor.bind(this);
    this.printGraph             = this.printGraph.bind(this);
    this.handlePreSetSelect     = this.handlePreSetSelect.bind(this);
    this.handlePreSetSave       = this.handlePreSetSave.bind(this)
    this.receiveNewStyles       = this.receiveNewStyles.bind(this);
    this.graphAdvance           = this.graphAdvance.bind(this);
    this.advanceDataFromProps   = this.advanceDataFromProps.bind(this);
    this.handleYAxisSelector    = this.handleYAxisSelector.bind(this);
  }

  // @@@@@@@@@@@@@@@@@@ LIFE CYCLE @@@@@@@@@@@@@@@@

  componentDidMount(){
    if(typeof this.props.onMount === 'function'){
      this.props.onMount();
    }
    if(this.props.developerWarnings){
      // setTimeout(()=>{
        consoleDeveloperWarnings(this.props);
      // },1000);
    }
    return new Promise((resolve, reject)=>{
      const dimensions = calcDimensions(this.state);
      resolve (
        this.setState(dimensions)
      );
    })
    .then(()=>{
      this.createGroupByOptionsJSX();
    })
    .then(()=>{
      const that = this;
      const controls = formatControls(this.state, that);
      this.setState({controls});
    })
    .then(()=>{
      const selectorsInFocus =
        !this.state.selectorsAllow ? 'none' :
        this.props.selectorsInFocus ? 
        this.props.selectorsInFocus :
        'layers' ;
      const preSetIdActive = 
        this.props.preSets[this.props.preSetIdActive] ?
        this.props.preSetIdActive : 
        selectDefaultPreSet(this.state.preSets, this.state.graphName);
      this.setState({
        selectorsInFocus,
        preSetIdActive
      });
      return;
    })
    .then(()=>{
      // options and pallettes are necessary for tests, even when editing is not allowed
      // all these are necessary for editing
      const preSetGlobalColorOptions = listBright();
      const preSetGlobalPalettes = createPreSetGlobalPalettes();
      const preSetGlobalPalette = preSetGlobalPalettes[preSetGlobalColorOptions[0]];
      this.setState({
        preSetGlobalPalettes,
        preSetGlobalPalette,
        preSetGlobalColorOptions,
      });
      return;
    })
    .then(()=>{
      if(this.state.groupByOnMount){
        const groupByData = createGroupByData(
          this.state.groupByOnMount, 
          this.state.dataType1Raw
        );
        /* createGroupByData() returns these keys:
            dataType2Raw,
            dataConvertFrom,
            groupBy,
            groups,
            groupTrue,
        */
        this.setState(groupByData);
        return;
      } 
      return;
    })
    .then(()=>{
      const graphInfo = createGraphInfoOnGroupOrMount(this.state);
      /* createGraphInfoOnGroupOrMount returns
          layersThatHaveUnits, 
          layersThatHaveNoUnits,
          layersAllPrefixed,
          legendObject,
          layersGroupedByUnits,
          layerUnitsArray,
          dataType: 1,
          dataType1Processed
      */
      this.setState(graphInfo);
      return;
    })
    .then(()=>{
      if(this.state.preSetIdActive){
        this.handlePreSetSelect(this.state.preSetIdActive);
        return;
      } else {
        const {
          layersSelected,
          firstLayerOnList
        } = parseDefaultLayerSelection(this.state);
        // this pops the first layer off the list, then adds it back to force a re-render;
        // ARE WE SURE WE NEED THIS????
        return new Promise((resolve, reject)=>{
          resolve(
            this.setState({layersSelected})
          );
        })
        .then(()=>{
          this.handleLayerSelection(firstLayerOnList);
        })
      }
    })
  };

  componentDidUpdate(){
    if(this.state.waitingOnDataFromProps) {
      this.advanceDataFromProps();
    } else if(this.state.allowNewDataAsProps){
      return new Promise(resolve=>{
        resolve(
          this.setState({dataType1: this.props.dataType1})
        )
      })
      .then(()=>{
        this.handleGraphChange({});
      })
    }
    // this.assignNewPreSetId();
  }

  // @@@@@@@@@@@@@@@@@@ MAJOR RENDERING @@@@@@@@@@@@@@@@

  handleGroupBy(event){
    // handleGroupBy should ONLY run from subcomponents
    // convert data type 1 to type 2
    const theKey = parseEvent(event);
    if(!theKey) return;
    const groupByData = createGroupByData(
      theKey, 
      this.state.dataType1Raw
    );
    return new Promise((resolve, reject)=>{
      resolve(
        this.setState(groupByData)
      );
    })
    .then(()=>{
      const graphInfo = createGraphInfoOnGroupOrMount(this.state);
      this.setState(graphInfo);
      return;
    });
  }

  handleGraphChange(changeInput){
    /* changeInput can include any keys below
      layersSelected    
      xIdealTickSpacing 
      cssBackground     
      xStart            
      xEnd               
      legendPosition    
      xLabel            
      xLabelKey         
      xLabelStartAt     
      yAxisUnitOptions  
      beginAtZeroX
      stepSizeX
    */
    const input = formatGraphKeysInput(changeInput, this.state);
    const graphKeys = createGraph(input);
    /* graphKeys includes: 
       graphData,    
       graphOptions,
       ready,
       needRefresh,  
       cssBackground, 
       layersSelected,  
       yAxisArray,   
       xIdealTickSpacingPrior
     */
    this.setState(graphKeys);
    if(graphKeys.needRefresh){
      this.refreshGraph();
    }
  }

  refreshGraph(){
    // runs when a refresh key is sent from createGraph()
    // refresh keys include axes changes
    // many keys will re-render correctly without a hard refresh
    this.setState({hide: true});
    setTimeout(()=>{
      this.setState({hide: false})
    }, 100);
  }

  // @@@@@@@@@@@@@@@@@@ MAJOR CONTROLS @@@@@@@@@@@@@@@@

  toggleSelectorsPopover(){
    this.setState({
      selectorsPopover: !this.state.selectorsPopover,
    });
  }

  toggleSelectorsInFocus(focus){
    const selectorsInFocus = 
      focus ? focus : 'none' ;
    this.setState({
      selectorsInFocus,
    });
  }

  handleYAxisSelector(){
    const yAxesLength = Array.isArray(this.props.yAxisUnitOptions) ? this.props.yAxisUnitOptions.length : 0 ;
    const yAxisInFocus = 
      isPrimitiveNumber(this.state.yAxisInFocus) && 
      this.state.yAxisInFocus + 1 <= yAxesLength - 1 ?
      this.state.yAxisInFocus + 1 :
      0;
    this.setState({yAxisInFocus});
    const yAxisUnitOptions = 
      Array.isArray(this.props.yAxisUnitOptions) ? 
      this.props.yAxisUnitOptions[yAxisInFocus] :
      {};
    this.handleGraphChange({yAxisUnitOptions});
  }

  // @@@@@@@@@@@@@@@@@ MINOR CONTROLS @@@@@@@@@@@@@@@@

  handleBackgroundColor(color){
    // toggle background between white and black, graph font color is opposite
    // hides then shows graph to force a re-render of the canvas
    if(typeof this.props.handleBackgroundColor === 'function'){
      const cssBackground = 
        typeof color === 'string' ?
          color :
        this.state.cssBackground === 'white' ?
          'gray' : 
          'white' ;
      this.props.handleBackgroundColor(cssBackground);
      this.handleGraphChange({cssBackground});
    } else {
      console.warn('handleBackgroundColor is not a function');
    }
  }

  printGraph(){
    if(this.state.cssBackground=== 'white') { // if already white, print, else, turn white, wait, then print
      window.print();
    } else {
      this.handleBackgroundColor('white');
      setTimeout(()=>{
        window.print();
      }, 2000); // 2000 seems to be long enough to complete canvas animations before printing
    }
  }

  // @@@@@@@@@@@@@@@@@@ LAYERS @@@@@@@@@@@@@@@@

  createGroupByOptionsJSX(){
    // runs only when allowing group but not already grouped
    const layerGroupByJSXOptions = 
      !Array.isArray(this.state.layersThatHaveUnits) ?
      [] : 
      this.state.layersThatHaveUnits.map((layer,i)=> <option key={i} value={layer} >{layer}</option>);
    this.setState({layerGroupByJSXOptions});
  };

  handleLayerSelection(event){
    // handleLayerSelection should only run from subcomponents
    const key = parseEvent(event);
    if(!key) return;
    const layersSelected = createLayersSelected(key, this.state.layersSelected);
    this.handleGraphChange({layersSelected});
  }

  toggleLayerGroup(group){
    if(!isObjectLiteral(this.state.layersGroupedByUnits)) return;
    const theGroup = this.state.layersGroupedByUnits[group];
    if(!Array.isArray(theGroup)) return;
    const layersSelected = toggleLayerGroup(this.state, theGroup);
    this.handleGraphChange({layersSelected});
  }
  
  // @@@@@@@@@@@@@@@@@@ AXES @@@@@@@@@@@@@@@@

  handleRangeChange(event, key){
    const value = parseInt(event.target.value,10) ;
    this.setState({[key]: value});
    setTimeout(()=>{
      this.handleGraphChange({[key]: value})
    }, 100);
  }

  handleTickChange(event){
    const rawValue = parseInt(event.target.value,10) ;
    const value =
      !isPrimitiveNumber(rawValue) ? 6 :
      rawValue < 1 ? 1 :
      rawValue > this.state.xMaxTickSpacing ? this.state.xMaxTickSpacing :
      rawValue;
    this.setState({xIdealTickSpacing: value});
    setTimeout(()=>{
      this.handleGraphChange({xIdealTickSpacing: value});
    }, 50);
  }

  // @@@@@@@@@@@@@@@@@@ PRESETS @@@@@@@@@@@@@@@@

  // assignNewPreSetId(){
  //   // if we saved a preSet, wait for its ID
  //   // when received, re-load controls
  //   if(this.state.waitingOnPreSetIdFromProps){
  //     if(!this.state.preSetIdActive){
  //       let id;
  //       for (let i in this.props.preSets){
  //         if(this.props.preSets[i].name === this.state.preSetNameNew) {
  //           id = i;
  //         }
  //       }
  //       if(id){
  //         const newPreSets = {
  //           ...this.state.preSets,
  //           [id]: this.props.preSets[id],
  //         }
  //         return new Promise((resolve, reject)=>{
  //           resolve(
  //             this.setState({
  //               preSetIdActive: id,
  //               preSets: newPreSets, 
  //               waitingOnPreSetIdFromProps: false,
  //             })
  //           );
  //         })
  //         .then(()=>{
  //           this.loadControls({id: id});
  //         });
  //       }
  //     } 
  //   }
  // }

  advanceDataFromProps() {
    if(this.state.waitingOnDataFromProps) {
      // compare ex. dataType1Raw[0][key] against new data [0][key] to see if new data actually arrived
      if(Array.isArray(this.props.dataType1) && Array.isArray(this.state.dataType1Raw)){
        if(isObjectLiteral(this.props.dataType1[0]) && isObjectLiteral(this.state.dataType1Raw[0])){
          if(this.props.dataType1[0][this.props.keyToCompareOnAdvance] !== this.state.dataType1Raw[0][this.state.keyToCompareOnAdvance] ) {
            return new Promise (resolve => {
              resolve(
                this.setState({
                  dataType1Raw: this.props.dataType1,
                  titleText: this.props.titleText,
                })
              );
            })
            .then(() => {
              // waitingOnDataFromProps update is delayed to give the spinner a little more time
              setTimeout(()=>{
                this.setState({
                  waitingOnDataFromProps: false, // this is after a timeout so the looading icon doesn't disappear too fast
                  advanceAllow: this.props.advanceAllow,
                  retreatAllow: this.props.retreatAllow,
                  legendDescription: this.props.legendDescription,
                });
              }, 800);
              if(this.state.groupByOnMount){
                const groupByData = createGroupByData(
                  this.state.groupByOnMount, 
                  this.state.dataType1Raw
                );
                this.setState(groupByData);
                return;
              }
            })
            .then(()=>{
              const graphInfo = createGraphInfoOnGroupOrMount(this.state);
              this.setState(graphInfo);
              return;
            })
            .then(()=>{
              this.handleGraphChange({})
            })
          }
        }
      }
    }
  }

  handlePreSetSelect(id){
    // onMount, it will try to find a preSet id; if no preSets exist, this catches it, unpauses, and stops
    const pausedState = !id ?
      {
        paused: false,
        preSetSaveAllow: true,
      } 
      : {
        preSetSaveAllow: false, // forces pre-set save component to unmount while selection occurs, then after selection, it remounts (and updates)
      };

    // this will select all keys in a pre-set list
    const thisPreSet = this.state.preSets[id];
    if(!isObjectLiteral(thisPreSet)) return;

    return new Promise((resolve, reject)=>{
      resolve(
        this.setState(pausedState)
      );
    })
    .then(()=>{
      const unpackedPreSet = unpackPreSet(this.state, thisPreSet, id);
      /* unpackPreSet returns:
        groupColors,
        groupDotColors,
        preSetIdActive,
        selector0,
        layersSelected,
        styles,
        prefixesToKeepGroups,
        prefixesToKeepGroupsSub,
      */
      const newState2 = {
        ...this.state,
        ...unpackedPreSet,
      }
      const layersSelected = createLayersSelected(newState2.selector0, newState2.layersSelected);
      this.setState({
        ...unpackedPreSet,
        layersSelected,
      });
    })
    .then(()=>{
      if(this.state.preSetGroupEditMode){
        // this is ONLY used in editing mode for group preSets
        const preSetGlobalPalette = this.state.preSetGlobalPalettes[listBright()[0]];
        const styles = applyPreSetGlobalColorToStyles({
          styles: this.state.styles, 
          preSetGlobalPalette,
        });
        this.receiveNewStyles(styles);
      }
    })
    .then(()=>{
      this.setState({
        paused: false,
        preSetSaveAllow: true,
      }); // defaults to true on load if preset is active, so this reverses that
      return;
    })
    .then(()=>{
      this.handleGraphChange({});
      return;
    })
  }

  handlePreSetSave(preSet){
    if(!isObjectLiteral(preSet)) return;
    const hydratedPreSet = {
      graphName: this.state.graphName, // meta
      ...preSet, // admin
      layersSelected: this.state.layersSelected, // layers
      styles: this.state.styles,
    }
    console.log('hydratedPreSet',hydratedPreSet);
    return;
    // if (typeof this.props.handlePreSetSave === 'function'){
    // const updatedPreSet = this.props.handlePreSetSave(hydratedPreSet);
    // console.log('updatedPreSet',updatedPreSet);
    // if(isObjectLiteral(updatedPreSet)){
    //   if(updatedPreSet.id){
    //     return new Promise((resolve, reject)=>{
    //       resolve(
    //         this.setState({
    //           preSetIdActive: updatedPreSet.id,
    //           preSets: {
    //             ...this.state.preSets,
    //             [updatedPreSet.id]: updatedPreSet,
    //           }
    //         })
    //       );
    //     })
    //     .then(()=>{
    //       this.handlePreSetSelect(updatedPreSet.id)
    //       // this.loadControls();
    //     })
    //   } else {
    //     console.error('there was a problem saving the pre-set (no id):', preSet)
    //   }
    // } else {
    //   console.error('there was a problem saving the pre-set (no object returned):', preSet)
    // }
  }

  receiveNewStyles(styles, psgc){
    const preSetGlobalColor = psgc ? psgc : this.state.preSetGlobalColor ;
    const preSetGlobalPalette = this.state.preSetGlobalPalettes[preSetGlobalColor];

    return new Promise((resolve, reject)=>{
      resolve(
        this.setState({
          styles,
          preSetGlobalColor,
          preSetGlobalPalette,
        })
      );
    })
    .then(()=>{
      this.handleGraphChange({});
    })
    .then(()=>{
      this.refreshGraph();
      return;
    })
  }

  // @@@@@@@@@@@@@@@@@@ NAVIGATION @@@@@@@@@@@@@@@@

  graphAdvance(advanceBy) {
    if(typeof this.props.handleFetchAdvanceRequest === 'function'){
      this.setState({waitingOnDataFromProps: true});
      // the timeout is because the spinner doesn't load instantly
      this.props.handleFetchAdvanceRequest(advanceBy);
    } else {
      console.warn('handleFetchAdvanceRequest is not a function')
    }

  }
  
  render() {

    // @@@@@@@@@@@@@@@@@@ CONTROLS @@@@@@@@@@@@@@@@
    const s = this.state;

    const footerFontColor = s.cssBackground === 'white' ? '#333' : 'white' ;
    const bp = 500; // breakpoint

    const spinnerMargin = 80;
    const spinnerSize = (Math.random()*20)+40;
    const spinnerColorIndex = Math.floor(Math.random()*5);
    const spinnerColors = ['red', 'yellow', 'pink', 'green', 'purple', 'blue'];
    const spinnerColor = spinnerColors[spinnerColorIndex] || 'white' ;
  

    const controls = <Controls
      controls        ={s.controls}
      preSets         ={s.preSets}
      preSetIdActive  ={s.preSetIdActive}
      selectorsPopover={s.selectorsPopover}
      cssBackground   ={s.cssBackground}
      waitingOnPreSetIdFromProps={s.waitingOnPreSetIdFromProps}
      toggleSelectorsInFocus={this.toggleSelectorsInFocus} />
    
    const graph = s.ready && !s.hide && !s.paused ?
      <Line 
        data   ={s.graphData   } 
        options={s.graphOptions}
        height ={s.cssCanvasHeight}
        width  ={s.cssCanvasWidth } /> : null ;

    
    const selectors = this.state.selectorsInclude ? <Selectors
      graphName          ={s.graphName}
      selectorsInFocus   ={s.selectorsInFocus}
      cssDivSelectors    ={s.cssDivSelectors}
      cssStyleColorsNamed={s.cssStyleColorsNamed}
      preSetSaveAllow    ={s.preSetSaveAllow}
      groupTrue          ={s.groupTrue}
      groupAllow         ={s.groupAllow}
      xStart             ={s.xStart}
      xEnd               ={s.xEnd}
      preSets            ={s.preSets}
      xIdealTickSpacing  ={s.xIdealTickSpacing}
      layerGroupByJSXOptions  ={s.layerGroupByJSXOptions}
      preSetGlobalPalettes    ={s.preSetGlobalPalettes}
      preSetGlobalPalette     ={s.preSetGlobalPalette}
      preSetGlobalColorOptions={s.preSetGlobalColorOptions}
      // preSetIds               ={s.preSetIds}
      preSetIdActive          ={s.preSetIdActive}
      layersThatHaveUnits     ={s.layersThatHaveUnits}
      layersSelected          ={s.layersSelected}
      legendLabels            ={s.legendLabels}
      legendDefinitions       ={s.legendDefinitions}
      preSetGroupEditMode     ={s.preSetGroupEditMode}
      preSetSaveSettings      ={s.preSetSaveSettings}
      styles                  ={s.styles}

      layerUnitsArray     ={s.layerUnitsArray}
      layersGroupedByUnits={s.layersGroupedByUnits}
      legendObject        ={s.legendObject}
      indexAbbrev         ={s.indexAbbrev}
      indexDef            ={s.indexDef}

      toggleLayerGroup    ={this.toggleLayerGroup}
      handleRangeChange   ={this.handleRangeChange}
      handleTickChange    ={this.handleTickChange}
      handleGroupBy       ={this.handleGroupBy}
      handlePreSetSave    ={this.handlePreSetSave}
      receiveNewStyles    ={this.receiveNewStyles}
      handleLayerSelection={this.handleLayerSelection}
    /> : null ;


    const footer = this.state.footerInclude ? <Footer
      // cssBackground         ={s.cssBackground}
      groupDotColors        ={s.groupDotColors}
      titleText             ={s.titleText}
      legendDescription     ={s.legendDescription}
      advanceAllow          ={s.advanceAllow}
      retreatAllow          ={s.retreatAllow}
      waitingOnDataFromProps={s.waitingOnDataFromProps}
      cssDivFooter          ={s.cssDivFooter}
      bp                    ={bp}
      googleTagManagerClass
      graphAdvance          ={this.graphAdvance}
    /> : null ;

    const googleTagManagerClass = createGoogleTagManagerClass(s);

    return <div className={`rcjspp-outer ${googleTagManagerClass}`}>
      <div className='rcjspp-inner' style={s.cssDivInner}>
        <div className='rcjspp-graph'
          style={s.cssDivGraph}>
          {graph}
        </div>
        <div className='rcjspp-controls'
          style={s.cssDivControls}>
          {controls}
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
}