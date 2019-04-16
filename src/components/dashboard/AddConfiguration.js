import React from 'react';

class AddConfiguration extends React.Component {
  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
  }

  save(event) {
    event.preventDefault();
    console.log('Saving configuration');
  }
  
  render() {
    return (
      <div className="abasi-add flex columns">
        <h1>Add Configuration Item</h1>

        <form onSubmit={this.save}>

        </form>
      </div>
    );
  }
}

export default AddConfiguration;
