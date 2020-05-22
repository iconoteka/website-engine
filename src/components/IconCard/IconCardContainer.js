import React from 'react';
import IconCard from './IconCard';


export default class IconCardContainer extends React.Component {
  constructor(props) {
    super(props);
    this.linkRef = React.createRef();
    this.cardClick = this.cardClick.bind(this);
  }

  cardClick(event) {
    // eslint-disable-next-line no-undef
    ga('send', 'event', {
      eventCategory: 'Download Icon',
      eventAction: 'click',
      eventLabel: event.target.href,
    });

    if (event.target.tagName.toLocaleLowerCase() === 'a') {
      return;
    }

    this.linkRef.current.click();
  }

  render() {
    return <IconCard {...this.props} ref={this.linkRef} onClick={this.cardClick} />;
  }
}
