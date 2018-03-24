import React from 'react';
/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import { Switch, Route } from 'react-router-dom';
import DocumentList from 'components/DocumentList/Loadable';
import DocumentStamper from 'components/DocumentStamper/index';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import BurgerMenu from 'components/BurgerMenu/index';

export default function App() {
  return (
    <div>
      <BurgerMenu />
      <Switch>
        <Route exact path="/" component={DocumentList} />
        <Route exact path="/stamp" component={DocumentStamper} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}
