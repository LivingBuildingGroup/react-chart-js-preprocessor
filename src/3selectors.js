import React               from 'react';
import { parseEvent }      from 'conjunction-junction'; 
// import { 
//   formatPreSetSelectorColumns, } from '../rcjspp-graphing-helpers/pre-set-selectors';
// import {  
//   applyPreSetGlobalColorToStyles,
//   editOneStyle }                 from '../rcjspp-graphing-helpers/pre-set-edit';
   
import { 
  formatPreSetSelectorColumns, 
  applyPreSetGlobalColorToStyles,
  editOneStyle }           from 'graphing-helpers';
import LayersOnFly         from './4layers-on-fly';
import LayersSave          from './4pre-set-layers-save';
import AdminSave           from './4pre-set-admin-save';
import RangeFinder         from './4-range-finder';

export default class Selectors extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      preSetHeaderRowJSX:     '',
      preSetGlobalColorOptionsJSX: '',
      preSetShadeOptionsJSX:  '',
      preSetShadeColumn:      {},
      preSetColumns:          [],
      ready: false,
    };
    this.handlePreSetGlobalColor=this.handlePreSetGlobalColor.bind(this);
    this.handlePreSetEdit       =this.handlePreSetEdit.bind(this);
  }

  componentDidMount(){
    return new Promise((resolve, reject)=>{
      resolve(
        this.loadPreSetSelectors()
      );
    })
    .then(()=>{
      this.setState({ready: true});
    })
  }

  formatPreSetStyleSelectors(columns){
    const preSetStyleOptionsJSX = columns.map((style,j)=>{
      const options = Array.isArray(style.optionLabels) ?
        style.optionLabels.map((label,i)=>{
          return <option key={`o${i}`} value={style.optionValues[i]} >{label}</option>
        }) : [] ;
      return options;
    });
    return {preSetStyleOptionsJSX};
  }
  
  formatPreSetShadeSelectors(){
    const preSetShadeColumn = { 
      layer: 'shade',
      label: 'shade',
      type:  'shade',
      optionLabels: [0,1,2,3,4,5,6,7,8,9],
      optionValues: [0,1,2,3,4,5,6,7,8,9],
      defaultValue: 0,
    };
    const preSetShadeOptionsJSX = preSetShadeColumn.optionValues.map(v=>{
      return <option key={`shade${v}`} value={v} >{v}</option>
    });
    // this will not be an array when not in group edit mode
    const psgco = Array.isArray(this.props.preSetGlobalColorOptions) ? this.props.preSetGlobalColorOptions : [] ;
    const preSetGlobalColorOptionsJSX = psgco.map(o=>{
      return <option key={o} value={o} >{o}</option>
    })
    return {
      preSetGlobalColorOptionsJSX,
      preSetShadeColumn,
      preSetShadeOptionsJSX,
    };
  }

  loadPreSetSelectors(){
    const columns        = formatPreSetSelectorColumns(this.props.cssStyleColorsNamed);
    const header         = this.formatPreSetHeader(columns.preSetColumns);
    const styleSelectors = this.formatPreSetStyleSelectors(columns.preSetColumns);
    const shadeSelectors = this.formatPreSetShadeSelectors();
    this.setState({
      ...columns,
      ...header,
      ...styleSelectors,
      ...shadeSelectors,
    });
  }

  formatPreSetHeader(columns){
    const columnsJSX = Array.isArray(columns) ?
      columns.map((style,i)=>{
        return <div key={`${style.key}${i}`}
          className='rcjspp-sel-style-col-header'>
          {style.label}
        </div>
      }) : null ;
    if(Array.isArray(columnsJSX)){
      columnsJSX.unshift(<div key='shade' className='rcjspp-sel-style-col-header rcjspp-sel-style-select-shade'></div>);  
      columnsJSX.unshift(<div key='blank' className='rcjspp-sel-style-row-label rcjspp-sel-style-row-active'></div>)    
    }
    const preSetHeaderRowJSX = <div className='rcjspp-sel-style-header-row'>
      {columnsJSX}
    </div>
  
    this.setState({preSetHeaderRowJSX});
  }

  handlePreSetGlobalColor(event){
    // this is ONLY used in editing mode for group preSets
    const preSetGlobalColor   = event.target.value;
    const preSetGlobalPalette = this.props.preSetGlobalPalettes[preSetGlobalColor]
    const styles = applyPreSetGlobalColorToStyles({
      styles: this.props.styles, 
      preSetGlobalPalette,
    });
    this.props.receiveNewStyles(styles, preSetGlobalColor);
  }

  handlePreSetEdit(event, layer, property){
    let value = parseEvent(event);
    const styles = editOneStyle({
      styles: this.props.styles, 
      value, 
      layer, 
      property, 
      preSetGlobalPalette: this.props.preSetGlobalPalette,
      cssStyleColorsNamed: this.props.cssStyleColorsNamed,
    });
    this.props.receiveNewStyles(styles);
  }

  render(){

    const p = this.props;

    const preSetSave = p.preSetSaveAllow && this.state.ready ?
      <AdminSave
        // preSetIds          ={p.preSetIds}
        preSets            ={p.preSets}
        preSetIdActive     ={p.preSetIdActive}
        preSetGroupEditMode={p.preSetGroupEditMode}
        preSetSaveSettings ={p.preSetSaveSettings}

        handlePreSetSave   ={p.handlePreSetSave}
      /> : null ;

    const rangeFinder = <RangeFinder
      groupTrue             ={p.groupTrue}
      groupAllow            ={p.groupAllow}
      handleGroupBy         ={p.handleGroupBy}
      xStart                ={p.xStart}
      xEnd                  ={p.xEnd}
      xIdealTickSpacing     ={p.xIdealTickSpacing}
      layerGroupByJSXOptions={p.layerGroupByJSXOptions}
      handleRangeChange     ={p.handleRangeChange}
      handleTickChange      ={p.handleTickChange} />

    const selectors = 
      p.selectorsInFocus === 'layers' ?
        <div className='rcjspp-selectors'
          style={p.cssDivSelectors}>
          <LayersOnFly
            layerUnitsArray       ={p.layerUnitsArray}
            layersGroupedByUnits  ={p.layersGroupedByUnits}
            layersSelected        ={p.layersSelected}
            legendObject          ={p.legendObject}
            indexAbbrev           ={p.indexAbbrev}
            indexDef              ={p.indexDef}

            handleLayerSelection={p.handleLayerSelection}
            toggleLayerGroup    ={p.toggleLayerGroup}
            styles={p.styles}
          />
        </div> :
      p.selectorsInFocus.includes('edit') ?
        <div className='rcjspp-selectors'
          style={p.cssDivSelectors}>
          {this.state.preSetHeaderRowJSX}
          <LayersSave
            preSetGroupEditMode ={p.preSetGroupEditMode}
            selectorsInFocus    ={p.selectorsInFocus}
            legendLabels        ={p.legendLabels}
            styles              ={p.styles}
            layersSelected      ={p.layersSelected}
            layersThatHaveUnits ={p.layersThatHaveUnits}
            handleLayerSelection={p.handleLayerSelection}
            preSetGlobalColor   ={p.preSetGlobalColor}

            preSetShadeColumn          ={this.state.preSetShadeColumn}
            preSetShadeOptionsJSX      ={this.state.preSetShadeOptionsJSX}
            preSetGlobalColorOptionsJSX={this.state.preSetGlobalColorOptionsJSX}
            preSetStyleOptionsJSX      ={this.state.preSetStyleOptionsJSX}
            preSetColumns              ={this.state.preSetColumns}

            handlePreSetGlobalColor={this.handlePreSetGlobalColor}
            handlePreSetEdit       ={this.handlePreSetEdit}
          />
          {preSetSave}
        </div> :
      null ;

    return <div className='rcjspp-selectors-outermost'>
      {rangeFinder}
      {selectors}
    </div>;
  }
}