import React from 'react';
import PropTypes from 'prop-types';

import 'components/IconsGrid/IconsGrid.scss';
import IconsGroup from 'components/IconsGroup';
import IconsGridEmpty from 'components/IconsGrid/IconsGridEmpty';

export default function IconsGrid({ items, baseUrl }) {
  const newItems = items.map(
    group => group.name && <IconsGroup baseUrl={baseUrl} group={group} key={group.name} />,
  );

  return newItems.length
    ? <div className="icons-grid">{newItems}</div>
    : <IconsGridEmpty />;
}

IconsGrid.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
  baseUrl: PropTypes.string.isRequired,
};
