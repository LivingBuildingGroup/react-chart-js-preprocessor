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
      
      icons:                       this.props.icons,
      
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
      preSetIds:              [],
      preSetNames:            [],
      preSetFuncs:            [],
      preSetIcons:            [],
      preSetLayers:           [],
      // preSetStyleOptionsJSX:  [[]],

      keyToCompareOnAdvance: this.props.keyToCompareOnAdvance ? this.props.keyToCompareOnAdvance :
      this.props.keyToCompareOnNewData ? this.props.keyToCompareOnNewData : 'xLabel',

      xStart:             0,
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

      // callback functions to access parent
      handleParentBackgroundColor: typeof this.props.handleBackgroundColor === 'function' ? this.props.handleBackgroundColor : ()=>{} ,
      handlePreSetSave:            typeof this.props.handlePreSetSave === 'function' ? this.props.handlePreSetSave : ()=>{} ,
      handleFetchAdvanceRequest:   this.props.handleFetchAdvanceRequest,
    };

    this.toggleLayerGroup       = this.toggleLayerGroup.bind(this);
    this.handleGroupBy          = this.handleGroupBy.bind(this);
    this.handleLayerSelection   = this.handleLayerSelection.bind(this);
    this.toggleSelectorsPopover = this.toggleSelectorsPopover.bind(this);
    this.toggleSelectorsInFocus = this.toggleSelectorsInFocus.bind(this);
    this.handleRangeChange      = this.handleRangeChange.bind(this);
    this.handleTickChange       = this.handleTickChange.bind(this);
    this.toggleLayerGroup       = this.toggleLayerGroup.bind(this);
    this.handleBackgroundChange = this.handleBackgroundChange.bind(this);
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
      this.setState(formatControls(this.state, that)); // formatControls returns an object
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
    this.advanceDataFromProps();
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

  handleBackgroundChange(color){
    // toggle background between white and black, graph font color is opposite
    // hides then shows graph to force a re-render of the canvas
    const cssBackground = 
      typeof color === 'string' ?
        color :
      this.state.cssBackground === 'white' ?
        'gray' : 
        'white' ;
    this.state.handleParentBackgroundColor(cssBackground);
    this.handleGraphChange({cssBackground});
  }

  printGraph(){
    if(this.state.cssBackground=== 'white') { // if already white, print, else, turn white, wait, then print
      window.print();
    } else {
      this.handleBackgroundChange('white');
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
    const updatedPreSet = this.state.handlePreSetSave(hydratedPreSet);
    console.log('updatedPreSet',updatedPreSet);
    if(isObjectLiteral(updatedPreSet)){
      if(updatedPreSet.id){
        return new Promise((resolve, reject)=>{
          resolve(
            this.setState({
              preSetIdActive: updatedPreSet.id,
              preSets: {
                ...this.state.preSets,
                [updatedPreSet.id]: updatedPreSet,
              }
            })
          );
        })
        .then(()=>{
          this.handlePreSetSelect(updatedPreSet.id)
          // this.loadControls();
        })
      } else {
        console.error('there was a problem saving the pre-set (no id):', preSet)
      }
    } else {
      console.error('there was a problem saving the pre-set (no object returned):', preSet)
    }
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
    if(typeof this.state.handleFetchAdvanceRequest === 'function'){
      this.setState({waitingOnDataFromProps: true});
      // the timeout is because the spinner doesn't load instantly
      setTimeout(()=>{
        this.state.handleFetchAdvanceRequest(advanceBy);
      }, 200);
    }
  }
  
  render() {

    // @@@@@@@@@@@@@@@@@@ CONTROLS @@@@@@@@@@@@@@@@
    const s = this.state;

    const controls = <Controls
      controlNames    ={s.controlNames}
      controlIcons    ={s.controlIcons}
      controlFuncs    ={s.controlFuncs}
      controlLabels   ={s.controlLabels}
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
      icons              ={s.icons}
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
      preSetIds               ={s.preSetIds}
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
      cssBackground         ={s.cssBackground}
      groupDotColors        ={s.groupDotColors}
      titleText             ={s.titleText}
      legendDescription     ={s.legendDescription}
      advanceAllow          ={s.advanceAllow}
      retreatAllow          ={s.retreatAllow}
      waitingOnDataFromProps={s.waitingOnDataFromProps}
      icons                 ={s.icons}
      cssDivFooter          ={s.cssDivFooter}
      googleTagManagerClass
      graphAdvance          ={this.graphAdvance}
    /> : null ;

    const googleTagManagerClass = createGoogleTagManagerClass(s);

    return <div className={`gw-outer ${googleTagManagerClass}`}>
      <div className='gw-inner' style={s.cssDivInner}>
        <div className='gw-graph'
          style={s.cssDivGraph}>
          {graph}
        </div>
        <div className='gw-controls'
          style={s.cssDivControls}>
          {controls}
        </div>
      </div>
      {footer}
      {selectors}
      <style>{`
        .gw-outer {
          position: relative;
          z-index: 7777;
          flex-direction: column;
        }
        .gw-inner {
          flex-direction: row;
        }
        .gw-graph {
          position: relative;
        }
        .gw-controls {
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
          .gw-controls {
            display: none;
          }
        }
      `}</style>
    </div>   
  }
}