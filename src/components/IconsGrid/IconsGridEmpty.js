import React from 'react';

export default function IconsGrid() {
    return (
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