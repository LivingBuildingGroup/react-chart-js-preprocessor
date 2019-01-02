import React from 'react';
import { isObjectLiteral } from 'conjunction-junction';
import { parseSelectorValue } from './helpers/pre-set-selectors';

export default function LayersSave (props){

  const preSetGlobalColorSelector = props.preSetGroupEditMode ?
  <div className ='gw-sel-style-row tooltip'>
      <div className='popover popover-wide-readme'>
        <p>
          You are in 'group pre-set edit mode'. 
          I.e. save this preset for a single test, then use it for multiple overlaied tests.
          Upon overlay each test gets 1 color. Test colors here, but the color is not saved here.
          We do save shades here. In the first column, select shade 1 (bright), 2 (lightest), 9 (darkest), or 0 to always use the same color (e.g. blue for rain).
        </p>
      </div>
    <div className='gw-sel-style-row-label gw-sel-style-row-active'>
      test with this color:
    </div>
    <div className='gw-sel-style-col-header gw-sel-style-select-shade'></div>
    <select 
      className='gw-sel-style-select'
      onChange={e=>props.handlePreSetGlobalColor(e)}
      value={props.preSetGlobalColor} >
      {props.preSetGlobalColorOptionsJSX}
    </select>
    {/* these are to pad the right using the same css*/}
    <div className='gw-sel-style-input'></div>
    <div className='gw-sel-style-input'></div>
    <div className='gw-sel-style-input'></div>
    <div className='gw-sel-style-input'></div>
    <div className='gw-sel-style-input'></div>
    <div className='gw-sel-style-input'></div>
    <div className='gw-sel-style-input'></div>
  </div> : null ;

  const layersForSelectors = 
    props.selectorsInFocus === 'edit-all' ?
    props.layersThatHaveUnits :
    props.layersSelected ;

  const preSetInputs = !Array.isArray(layersForSelectors) ? null :
  layersForSelectors.map((layer,i)=>{
    const layerSplit = layer.split('__');
    let group, subGroup, key;
    if(layerSplit.length === 1){
      key      = layerSplit[0];
    } else if (layerSplit.length === 2) {
      group    = layerSplit[0];
      key      = layerSplit[1];
    } else if (layerSplit.length === 3) {
      group    = layerSplit[0];
      subGroup = layerSplit[1];
      key      = layerSplit[2];
    }
    const groupWithSpace    = group    ? `${group} `    : '' ;
    const subGroupWithSpace = subGroup ? `${subGroup} ` : '' ;
    let header = `${groupWithSpace}${subGroupWithSpace}${props.legendLabels[key]}`;

    const shadeValue = 
      !props.preSetGroupEditMode       ? 0 :
      !props.styles[layer]             ? 0 :
      !props.styles[layer].style       ? 0 :
      !props.styles[layer].style.shade ? 0 :
       props.styles[layer].style.shade ;

    const disabledShadeClass = shadeValue <= 0 ?
      'gw-sel-disabled' :
      '' ;
    const shadeSelector = props.preSetGroupEditMode ?
      <select 
        className={`gw-sel-style-select gw-sel-style-select-shade ${disabledShadeClass}`}
        onChange={e=>props.handlePreSetEdit(e, layer, {type: 'shade'})}
        value={shadeValue} >
        {props.preSetShadeOptionsJSX}
      </select> : 
      <div className='gw-sel-style-select gw-sel-style-select-shade'></div>;

    const selectors = props.preSetColumns.map((col,j)=>{

      const thisLayer = isObjectLiteral(props.styles[layer]) ? props.styles[layer] : {} ;
      const value = parseSelectorValue(thisLayer, col, props.preSetGroupEditMode)
      const disabledColorClass = col.type === 'color' && props.preSetGroupEditMode && shadeValue > 0 ?
        'gw-sel-disabled' :
        '' ;

      const input = col.type === 'number' ?
        <input
          key={`${layer}${col.key}-${j}`}
          type='number'
          step={col.step}
          className={`gw-sel-style-input gw-sel-style-input-${col.key}`}
          onChange={e=>props.handlePreSetEdit(e, layer, col)} 
          value={value} /> :
        <select 
          key={`${layer}${col.key}-${j}`}
          className={`gw-sel-style-select gw-sel-style-input-${col.key} ${disabledColorClass}`}
          onChange={e=>props.handlePreSetEdit(e, layer, col)}
          value={value} >
          {props.preSetStyleOptionsJSX[j]}
        </select>

      return input
    });

    const rowActiveClass = props.layersSelected.includes(layer) ?
      'gw-sel-style-row-active' : '' ;

    const fullRow = <div key={`${layer}${i}`} 
      className ='gw-sel-style-row'>
      <div key={`${header}-header`} 
        className={`gw-sel-style-row-label ${rowActiveClass}`}
        onClick={()=>props.handleLayerSelection(layer)}>
        {header}
      </div>
      {shadeSelector}
      {selectors}
    </div>

    return fullRow
  });
  // end preSetInputs

  return <div className='gw-sel-style-body'>
    {preSetGlobalColorSelector}
    {preSetInputs}
    <style>{`
      .gw-sel-style-body {
        overflow-y: scroll;
      }
      .gw-sel-style-col-header {
        width: 10%;
        padding-left: 7px;
      }
      .gw-sel-style-body {
        display: block;
        padding-top: 45px;
        margin-bottom: 20px;
      }
      .gw-sel-style-row {
        height: 20px;
      }
      .gw-sel-style-row-label {
        display: block;
        width: 20%;
        height: 100%;
        overflow: scroll;
        cursor: pointer;
        color: #aaa;
        padding-left: 10px;
      }
      .gw-sel-style-row-active {
        color: inherit;
      }
      .gw-sel-style-input,
      .gw-sel-style-select {
        width: 10%;
        height: 100%;
      }
      .gw-sel-style-select-shade {
        width: 40px;
      }
      .gw-sel-disabled {
        color: transparent;
      }
    `}</style>
  </div>

}