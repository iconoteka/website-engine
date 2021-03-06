import React, { Component } from 'react';
import _debounce from 'lodash.debounce';
import * as JsSearch from 'js-search';
import { stemmer } from 'porter-stemmer';

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
      style: 'stroke',
      thickness: 'bold',
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

    sendSearchToGA(search) {
      if (search === '') {
        return; 
      }
      // eslint-disable-next-line no-undef
      gtag('config', process.env.REACT_APP_GA, {'page_path': `/search?q=${search}`});

    }

    sendSearchToGADebounced = _debounce(this.sendSearchToGA, 3000)

    onSearch(event) {
      this.setState({
        search: event.target.value,
      });
      if(process.env.REACT_APP_GA) {

        this.sendSearchToGADebounced(event.target.value);
      }

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

    filterIcons(search = '', style = 'stroke', thickness = 'bold') {
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
        // Filter by style
        .filter(iconItem => isPredicate(iconItem, style))
        // Filter by thickness
        .filter(iconItem => isPredicate(iconItem, thickness))
        // Add group name to allow searching
        .map(item => {
          item.groupName = group.name;
          return item;
        });
        ;

      let results = items;
      if (search.trim() !== '') {
        const searchEngine = new JsSearch.Search('name');
        searchEngine.tokenizer =
	        new JsSearch.StemmingTokenizer(
            stemmer,
            new JsSearch.SimpleTokenizer()
          );

        searchEngine.addIndex('name');
        searchEngine.addIndex('groupName');
        searchEngine.addIndex('keywords');
        searchEngine.addDocuments(items); 
        results = searchEngine.search(search);
        
      }
    
      return Object.assign({}, group, {
        items: results,
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
