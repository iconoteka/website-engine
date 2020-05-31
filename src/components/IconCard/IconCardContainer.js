import React from 'react';
import IconCard from './IconCard';


export default class IconCardContainer extends React.Component {
  constructor(props) {
    super(props);
    this.linkRef = React.createRef();
    this.cardClick = this.cardClick.bind(this);
  }

  cardClick(event) {
    const isClickOnLink = event.target.tagName.toLocaleLowerCase() === 'a';

    if(isClickOnLink && process.env.REACT_APP_GA) {
      console.log(this.props.path, this.props.groupName, this.props.name);
      // Track icon download as page view
      // eslint-disable-next-line no-undef
      gtag('config', process.env.REACT_APP_GA, {
        'page_path': `/${this.props.path}`
      });

      // eslint-disable-next-line no-undef
      gtag('event', 'Icon Download', {
        'event_category': this.props.groupName,
        'event_label': this.props.name,
      });

    }

    if (isClickOnLink) {
      return;
    }

    this.linkRef.current.click();
  }

  render() {
    return <IconCard {...this.props} ref={this.linkRef} onClick={this.cardClick} />;
  }
}
