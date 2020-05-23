import React from 'react';
import PropTypes from 'prop-types';
import './IconCard.scss';


const IconCard = (props) => {
  const {
    isHidden, baseUrl, name, path, forwardedRef, onClick, isVisible,
  } = props;
    // eslint-disable-next-line
    const iconAddress = require(`iconoteka-files/${path}`);

  return !isHidden && (
  <div className="icon-card" onClick={onClick} ref={props.innerRef}>

    <div className="icon-card__content">
      {
        isVisible && <img className="icon-card__icon" src={iconAddress} alt="icon" />
      }
      <span className="icon-card__title">{name}</span>
      <a className="icon-card__download" ref={forwardedRef} download={path} href={iconAddress}>Download</a>
    </div>
  </div>
  );
};

IconCard.propTypes = {
  isHidden: PropTypes.bool,
  isVisible: PropTypes.bool,
  baseUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

IconCard.defaultProps = {
  isHidden: false,
  isVisible: false,
};

export default React.forwardRef((props, ref) => <IconCard {...props} forwardedRef={ref} />);
