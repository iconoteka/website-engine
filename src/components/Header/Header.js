import React from 'react';
import './Header.scss';
import logo from './logo.svg';

export default function Header() {
  return (
    <header className="header">
      <img src={logo} className="header__logo" alt="iconoteka" />
      <ul className="header__menu">
        <li><a href="https://readymag.com/turbaba/1296248/">about</a></li>
        <li><a href="https://www.patreon.com/iconoteka">support project</a></li>
      </ul>
    </header>

  );
}
