import React from 'react';

export default class AdminSave extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      preSetIds: this.props.preSetIds || [] ,
      preSets:   this.props.preSets || {} ,

      id:       this.props.preSetIdActive,
      name:     '',
      icon:     '',
      type:     this.props.preSetGroupEditMode ? 'group' : 'single' ,
      def:      false,
      isNew:    false,
      isPublic: false,
      preSetSaveSettings: this.props.preSetSaveSettings,

      preSetIconComponents: [],
      preSetIconJSXOptions: [],
    };
  }

  componentDidMount(){
    this.readPreSetFromSelected();
    this.listAllPreSetIconsAsOptions();
  }

  readPreSetFromSelected(){
    const thisPreSet = this.state.preSets[this.state.id];
    if(thisPreSet){
      this.setState({
        name:     thisPreSet.name,
        icon:     thisPreSet.icon,
        def:      thisPreSet.def,
        isPublic: Array.isArray(thisPreSet.permissions) && thisPreSet.permissions.includes('public') ? true : false ,
      });
    }
  }

  listAllPreSetIconsAsOptions(){
    // this is a method, vs helper function, ONLY because it uses JSX
    const iconsPreSets = this.props.icons || {};
    const preSetIconNames = [];
    const preSetIconComponents = [];
    for(let name in iconsPreSets){
      preSetIconNames.push(name);
      preSetIconComponents.push(iconsPreSets[name]);
    }
    const preSetIconJSXOptions = preSetIconNames.map((name,i)=>{
      return <option key={i}
        className=''  
        value={preSetIconNames[i]}>
          {name}
      </option>
    });
    this.setState({
      preSetIconNames,
      preSetIconComponents,
      preSetIconJSXOptions,
    });
  }

  toggleSaveType(){
    this.setState({
      isNew: !this.state.isNew,
    });
  }

  toggleIsPublic(){
    this.setState({
      isPublic: !this.state.isPublic,
    });
  }

  toggleIsDef(){
    this.setState({
      def: !this.state.def,
    });
  }

  handlePreSetName(event){
    this.setState({name: event.target.value})
  }

  handlePreSetIcon(event){
    this.setState({icon: event.target.value})
  }

  handlePreSetSave(event){
    event.preventDefault();
    // const stylesDefault = this.props.styles; // used if no styles explicitly sent
    const preSet = {
      id:       this.state.isNew ? null : this.state.id, // system-assigned

      type:     this.state.type, // admin
      def:      this.state.def,
      name:     this.state.name,
      icon:     this.state.icon,
      permissions: this.state.isPublic ? ['grd','public'] : ['grd'],
      preSetSaveSettings: this.state.preSetSaveSettings,
    };
    console.log('preSet to save', preSet);
    this.props.handlePreSetSave(preSet);
  }

  render() {

    const preSetSaveButton = <button type='submit'
      className='gw-pre-set-save-button'
      onClick={e=>this.handlePreSetSave(e)}>
      save
    </button>

    const saveTypeToggle = <div 
      className='gw-pre-set-save-toggle-container'>
      <label className='gw-pre-set-input-label'>
        <input
          name='save-type'
          type='radio'
          className='gw-pre-set-input'
          onChange={()=>this.toggleSaveType()} 
          checked={this.state.isNew}
          value={this.state.isNew} />
        save as a new pre-set
      </label> 
      <label className='gw-pre-set-input-label'>
        <input
          name='save-type'
          type='radio'
          className='gw-pre-set-input'
          onChange={()=>this.toggleSaveType()} 
          checked={!this.state.isNew}
          value={!this.state.isNew} />
        update existing pre-set     
      </label> 
    </div>

    const isPublicToggle = <div 
      className='gw-pre-set-save-toggle-container'>
      <label className='gw-pre-set-input-label'>
        <input
          name='permission'
          type='radio'
          className='gw-pre-set-input'
          onChange={()=>this.toggleIsPublic()} 
          checked={this.state.isPublic}
          value={this.state.isPublic} />
        make publicly visible
      </label> 
      <label className='gw-pre-set-input-label'>
        <input
          name='permission'
          type='radio'
          className='gw-pre-set-input'
          onChange={()=>this.toggleIsPublic()} 
          checked={!this.state.isPublic}
          value={!this.state.isPublic} />
        keep private     
      </label> 
    </div>

    const defToggle = <div 
      className='gw-pre-set-save-toggle-container'>
      <label className='gw-pre-set-input-label'>
        <input
          name='def'
          type='radio'
          className='gw-pre-set-input'
          onChange={()=>this.toggleIsDef()} 
          checked={this.state.def}
          value={this.state.def} />
        make default
      </label> 
      <label className='gw-pre-set-input-label'>
        <input
          name='def'
          type='radio'
          className='gw-pre-set-input'
          onChange={()=>this.toggleIsDef()} 
          checked={!this.state.def}
          value={!this.state.def} />
        not default     
      </label> 
    </div>

    const nameSelector = <label className='gw-pre-set-input-label'>
      <input
        type='text'
        className='gw-pre-set-input'
        onChange={e=>this.handlePreSetName(e)} 
        value={this.state.name || ''} /> 
      {this.state.isNew ? 'name' : 'new name (only if changing)'}
    </label>

    const IconPreview = this.state.icon && typeof this.props.icons[this.state.icon] === 'function' ? this.props.icons[this.state.icon] : null ;
    const iconPreview = IconPreview ? <IconPreview style={{height: 16}}/> : null ;

    const iconSelector = <label className='gw-pre-set-input-label'>
      <select className='gw-pre-set-selector'
        onChange={e=>this.handlePreSetIcon(e)}
        value={this.state.icon || ''} >
        {this.state.preSetIconJSXOptions}
      </select>
      icon
      {iconPreview}
    </label>
      
    return <form className='gw-pre-set-save-container'>
      <div className='gw-pre-set-save-inner-container'>
        {saveTypeToggle}
        {isPublicToggle}
        {defToggle}
        {nameSelector}
        {iconSelector}
        {preSetSaveButton}
      </div>    
      <style>{`
        .gw-pre-set-save-button {
          padding: 5px;
          margin-right: 20px;
        }
        .gw-pre-set-save-toggle-container {
          flex-direction: column;
          margin: 15px;
          width: 200px;
          flex-grow: 0;
          flex-shrink: 0;
        }
        .gw-pre-set-input-label {
          padding-left: 5px;
        }
        .gw-pre-set-input {
          min-width: 150px;
        }
        .gw-pre-set-save-inner-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .gw-pre-set-selector {
          min-width: 100px;
        }
      `}</style>
    </form>
  }
  
}