import React from 'react';

import 'components/Footer/Footer.scss';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__copy">
        <p>copyright 2018 oleg turbaba <br />all rights reserved</p>
      </div>
      <div className="footer__links">
        <div className="footer__links-box">
          <a href="https://www.instagram.com/iconoteka/">Instagram</a>
          <a href="https://twitter.com/iconoteka">Twitter</a>
        </div>
        <div className="footer__links-box">
          <a href="https://www.facebook.com/iconoteka">Facebook</a>
          <a href="https://iconoteka.tumblr.com/">Tumblr</a>
        </div>
      </div>
    </footer>
  );
}
