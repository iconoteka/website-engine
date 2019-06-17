import React from 'react';
import PropTypes from 'prop-types';

import './IconsGrid.scss';
import IconsGroup from '../IconsGroup';

export default function IconsGrid({ items, baseUrl }) {
  const newItems = items.map(
    group => group.name && <IconsGroup baseUrl={baseUrl} group={group} key={group.name} />,
  );

  return newItems.length
    ? <div className="icons-grid">{newItems}</div>
    : (
      <div className="icons-grid">
        <div className="icons-group">
          <h3 className="icons-group__title icons-group__title_empty">Sorry, we don't have this icon yet. <br />
You can submit an icon and we will add it to the production queue.

</h3>
        <a href="mailto:hello@iconoteka.com" className="icons-group__submit_icon">Submit icon</a>
        </div>
      </div>
    );
}

IconsGrid.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
  baseUrl: PropTypes.string.isRequired,
};
