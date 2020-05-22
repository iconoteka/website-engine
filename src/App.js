import React, { Component } from 'react';
import Iconoteka from 'iconoteka.json';

import isPredicate from './utils/isPredicate';

import './App.scss';
import IconsGrid from 'components/IconsGrid';
import Footer from 'components/Footer';
import Hero from 'components/Hero';
import AppContext from './AppContext';

const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:3000';

class App extends Component {
    state = {
      Iconoteka,
      filteredItems: Iconoteka.items,
      style: 'fill',
      thickness: 'regular',
      search: '',
    };

    constructor(props) {
      super(props);
      this.onStyleChange = this.onStyleChange.bind(this);
      this.onThicknessChange = this.onThicknessChange.bind(this);
      this.onSearch = this.onSearch.bind(this);
      this.changeOpenDropdownState = this.changeOpenDropdownState.bind(this);
    }

    componentDidMount() {
      this.filterIcons();
    }

    onSearch(event) {
      this.setState({
        search: event.target.value,
      });

      const { style, thickness } = this.state;
      this.filterIcons(event.target.value, style, thickness);
    }

    onStyleChange(style) {
      this.setState({ style: style.key });

      const { search, thickness } = this.state;
      this.filterIcons(search, style.key, thickness);
    }

    onThicknessChange(thickness) {
      this.setState({ thickness: thickness.key });

      const { search, style } = this.state;
      this.filterIcons(search, style, thickness.key);
    }

    filterIcons(search = '', style = 'fill', thickness = 'regular') {
      const { Iconoteka: iconoteka } = this.state;
      const filteredGroups = iconoteka.items
        .map(
          group => this.filterIconGroup(group, search, style, thickness),
        )
        .filter(group => group.items && group.items.length);

      this.setState({ filteredItems: filteredGroups });
    }

    changeOpenDropdownState(name, isOpen) {
      this.setState({
        openDropdown: isOpen ? name : null,
      });
    }

    /* eslint-disable */
    filterIconGroup(group, search, style, thickness) {
      const items = group.items && group.items
        // Filter by search string
        .filter(iconItem => iconItem.path.includes(search.toLowerCase()))
        // Filter by style
        .filter(iconItem => isPredicate(iconItem, style))
        // Filter by thickness
        .filter(iconItem => isPredicate(iconItem, thickness));

      return Object.assign({}, group, {
        items,
      });
    }
    /* eslint-enable */

    render() {
      const { style, thickness, filteredItems } = this.state;
      return (
        <AppContext.Provider value={{
          openDropdown: this.state.openDropdown,
          changeOpenDropdownState: this.changeOpenDropdownState,
        }}
        >
          <div className="app">
            <Hero
              onSearch={this.onSearch}
              onStyleChange={this.onStyleChange}
              onThicknessChange={this.onThicknessChange}
              style={style}
              thickness={thickness}
            />

            <main className="app__content">
              <IconsGrid items={filteredItems} baseUrl={baseUrl} />
            </main>
            <Footer />
          </div>
        </AppContext.Provider>
      );
    }
}

export default App;
