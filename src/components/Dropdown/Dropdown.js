import React, { Component } from 'react';

class Dropdown extends Component {
  state = {
    selected: null,
  };

  constructor(props) {
    super();
    this.onChange = this.onChange.bind(this);
    this.close = this.close.bind(this);
    this.onItemSelect = this.onItemSelect.bind(this);
    const preselected = props.items.find(item => item.selected);
    // Select the first item if nothing proivded
    const selected = preselected || props.items[0];
    this.ref = React.createRef();

    this.state = {
      selected,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.onChange);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onChange);
  }

  onItemSelect(item) {
    this.setState({
      selected: item,
    });
    this.props.onChange(item);
  }

  onChange(e) {
    if (!this.ref.current.contains(e.target)) {
      this.close()
      return;
    }

    const newOpenState = !(this.props.name === this.props.openDropdown);
    this.props.onChangeOpenDropdownState(this.props.name, newOpenState);
  }

  close() {
    if (this.props.openDropdown === this.props.name) {
      this.props.onChangeOpenDropdownState(this.props.name, false);
    }
  }

  render() {
    const label = this.state.selected.title;
    return (
      <div ref={this.ref} className="icons-filter__control">
        <a className="icons-filter__style-item-name" href="#regular">{label}</a>
        <ul className="icons-filter__dropdown" style={this.props.openDropdown === this.props.name ? { display: 'block' } : {}}>
          { this.props.items.map(item => <li key={item.key} data-key={item.key} onClick={() => this.onItemSelect(item)}>{item.title}</li>) }
        </ul>
      </div>
    );
  }
}

export default Dropdown;
