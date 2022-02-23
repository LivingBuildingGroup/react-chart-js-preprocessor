import React                    from 'react';
import { 
  formatPresetSelectorColumns } from 'graphing-helpers';
import LayersOnFly              from './4layers-on-fly';
import RangeFinder              from './4-range-finder';

export default class Selectors extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      presetHeaderRowJSX:     '',
      presetGlobalColorOptionsJSX: '',
      presetShadeOptionsJSX:  '',
      presetShadeColumn:      {},
      presetColumns:          [],
      ready: false,
    };
  }

  componentDidMount(){
    return new Promise((resolve, reject)=>{
      resolve(
        this.loadPresetSelectors()
      );
    })
    .then(()=>{
      this.setState({ready: true});
    })
  }

  formatPresetStyleSelectors(columns){
    const presetStyleOptionsJSX = columns.map((style,j)=>{
      const options = Array.isArray(style.optionLabels) ?
        style.optionLabels.map((label,i)=>{
          return <option key={`o${i}`} value={style.optionValues[i]} >{label}</option>
        }) : [] ;
      return options;
    });
    return {presetStyleOptionsJSX};
  }

  loadPresetSelectors(){
    const columns        = formatPresetSelectorColumns(this.props.cssStyleColorsNamed);
    const header         = this.formatPresetHeader(columns.presetColumns);
    this.setState({
      ...columns,
      ...header,
    });
  }

  formatPresetHeader(columns){
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
    const presetHeaderRowJSX = <div className='rcjspp-sel-style-header-row'>
      {columnsJSX}
    </div>
  
    this.setState({presetHeaderRowJSX});
  }

  render(){

    const p = this.props;

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

            handleLayerSelection  ={p.handleLayerSelection}
            toggleLayerGroup      ={p.toggleLayerGroup}
            styles                ={p.styles} />
        </div> :
      null ;

    return <div className='rcjspp-selectors-outermost'>
      {rangeFinder}
      {selectors}
    </div>;
  }
}