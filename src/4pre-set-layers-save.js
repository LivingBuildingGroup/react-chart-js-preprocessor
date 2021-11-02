import React                  from 'react';
import { isObjectLiteral }    from 'conjunction-junction';
import { parseSelectorValue } from 'graphing-helpers';

export default function LayersSave (props){

  const preSetGlobalColorSelector = props.preSetGroupEditMode ?
  <div className ='rcjspp-sel-style-row tooltip'>
      <div className='popover popover-wide-readme'>
        <p>
          You are in 'group pre-set edit mode'. 
          I.e. save this preset for a single test, then use it for multiple overlaied tests.
          Upon overlay each test gets 1 color. Test colors here, but the color is not saved here.
          We do save shades here. In the first column, select shade 1 (bright), 2 (lightest), 9 (darkest), or 0 to always use the same color (e.g. blue for rain).
        </p>
      </div>
    <div className='rcjspp-sel-style-row-label rcjspp-sel-style-row-active'>
      test with this color:
    </div>
    <div className='rcjspp-sel-style-col-header rcjspp-sel-style-select-shade'></div>
    <select 
      className='rcjspp-sel-style-select'
      onChange={e=>props.handlePreSetGlobalColor(e)}
      value={props.preSetGlobalColor} >
      {props.preSetGlobalColorOptionsJSX}
    </select>
    {/* these are to pad the right using the same css*/}
    <div className='rcjspp-sel-style-input'></div>
    <div className='rcjspp-sel-style-input'></div>
    <div className='rcjspp-sel-style-input'></div>
    <div className='rcjspp-sel-style-input'></div>
    <div className='rcjspp-sel-style-input'></div>
    <div className='rcjspp-sel-style-input'></div>
    <div className='rcjspp-sel-style-input'></div>
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
      'rcjspp-sel-disabled' :
      '' ;
    const shadeSelector = props.preSetGroupEditMode ?
      <select 
        className={`rcjspp-sel-style-select rcjspp-sel-style-select-shade ${disabledShadeClass}`}
        onChange={e=>props.handlePreSetEdit(e, layer, {type: 'shade'})}
        value={shadeValue} >
        {props.preSetShadeOptionsJSX}
      </select> : 
      <div className='rcjspp-sel-style-select rcjspp-sel-style-select-shade'></div>;

    const selectors = props.preSetColumns.map((col,j)=>{

      const thisLayer = isObjectLiteral(props.styles[layer]) ? props.styles[layer] : {} ;
      const value = parseSelectorValue(thisLayer, col, props.preSetGroupEditMode)
      const disabledColorClass = col.type === 'color' && props.preSetGroupEditMode && shadeValue > 0 ?
        'rcjspp-sel-disabled' :
        '' ;

      const input = col.type === 'number' ?
        <input
          key={`${layer}${col.key}-${j}`}
          type='number'
          step={col.step}
          className={`rcjspp-sel-style-input rcjspp-sel-style-input-${col.key}`}
          onChange={e=>props.handlePreSetEdit(e, layer, col)} 
          value={value} /> :
        <select 
          key={`${layer}${col.key}-${j}`}
          className={`rcjspp-sel-style-select rcjspp-sel-style-input-${col.key} ${disabledColorClass}`}
          onChange={e=>props.handlePreSetEdit(e, layer, col)}
          value={value} >
          {props.preSetStyleOptionsJSX[j]}
        </select>

      return input
    });

    const rowActiveClass = props.layersSelected.includes(layer) ?
      'rcjspp-sel-style-row-active' : '' ;

    const fullRow = <div key={`${layer}${i}`} 
      className ='rcjspp-sel-style-row'>
      <div key={`${header}-header`} 
        className={`rcjspp-sel-style-row-label ${rowActiveClass}`}
        onClick={()=>props.handleLayerSelection(layer)}>
        {header}
      </div>
      {shadeSelector}
      {selectors}
    </div>

    return fullRow
  });
  // end preSetInputs

  return <div className='rcjspp-sel-style-body'>
    {preSetGlobalColorSelector}
    {preSetInputs}
  </div>

}