import React from 'react';
import PropTypes from 'prop-types';
import 'components/IconsFilter/IconsFilter.scss';
import Dropdown from 'components/Dropdown';
import AppContext from '../../AppContext';

export default class IconsFilter extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }

  render() {
    const {
      onChange,
      onStyleChange,
      onThicknessChange,
      style,
      thickness,
    } = this.props;

    return (

      <AppContext.Consumer>
        {({ openDropdown, changeOpenDropdownState }) => (
          <div className="icons-filter">

            <div className="icons-filter__search-wrap">
              <input
                className="icons-filter__search"
                placeholder="search icon"
                ref={this.inputRef}
                onChange={onChange}
                onKeyUp={onChange}
              />
            </div>

            <ul className="icons-filter__style">
              <li>
                <Dropdown
                  onChange={item => onThicknessChange(item)}
                  name="thickness"
                  openDropdown={openDropdown}
                  onChangeOpenDropdownState={changeOpenDropdownState}
                  items={[
                    {
                      key: 'bold',
                      title: 'Bold',
                      selected: thickness === 'bold',
                    },
                    {
                      key: 'medium',
                      title: 'Medium',
                      selected: thickness === 'medium',
                    },
                    {
                      key: 'regular',
                      title: 'Regular',
                      selected: thickness === 'regular',
                    },
                    {
                      key: 'light',
                      title: 'Light',
                      selected: thickness === 'light',
                    },
                  ]}
                />
              </li>
              <li>
                <Dropdown
                  key="test"
                  onChange={item => onStyleChange(item)}
                  openDropdown={openDropdown}
                  onChangeOpenDropdownState={changeOpenDropdownState}
                  name="style"
                  items={[
                    {
                      key: 'stroke',
                      title: 'Stroke',
                      selected: style === 'stroke',
                    },
                    {
                      key: 'fill',
                      title: 'Fill',
                      selected: style === 'fill',
                    },
                  ]}
                />
              </li>
            </ul>

          </div>
        )}
      </AppContext.Consumer>
    );
  }
}

IconsFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
  onStyleChange: PropTypes.func.isRequired,
  onThicknessChange: PropTypes.func.isRequired,
  style: PropTypes.oneOf(['fill', 'stroke']).isRequired,
  thickness: PropTypes.oneOf(['bold', 'medium', 'regular', 'light']).isRequired,
};
