import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Waypoint } from 'react-waypoint';

import IconCard from 'components/IconCard';
import 'components/IconsGroup/IconsGroup.scss';

const IconCardWithRef = React.forwardRef((props, ref) => {
  return <IconCard innerRef={ref} {...props} />;
});

export default function IconsGroup({ group, baseUrl }) {
  const [isVisible, setIsVisible] = useState(false);

  const images = group.items
    .map(iconItem => (
      <Waypoint
        onEnter={() => setIsVisible(true)}
      >
        <IconCardWithRef
          key={iconItem.fileName}
          path={iconItem.path}
          name={iconItem.name}
          fileName={iconItem.fileName}
          isHidden={iconItem.isHidden}
          baseUrl={baseUrl}
          isVisible={isVisible}
        />
      </Waypoint>
    ));

  return (
    <div className="icons-group">
      <h3 className="icons-group__title">{group.name}</h3>
      <div className="icons-group__content">
        {images}
      </div>
    </div>
  );
}

IconsGroup.propTypes = {
  group: PropTypes.shape({
    items: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  baseUrl: PropTypes.string.isRequired,
};
