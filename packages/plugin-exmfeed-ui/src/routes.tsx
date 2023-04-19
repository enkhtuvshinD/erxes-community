import React from 'react';
import { Route } from 'react-router-dom';
import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import queryString from 'query-string';

const Home = asyncComponent(() =>
  import(/* webpackChunkName: "Plugin exm feed" */ './containers/Home')
);

const home = ({ location, history }) => {
  return (
    <Home queryParams={queryString.parse(location.search)} history={history} />
  );
};

const ExmRoutes = () => (
  <Route path="/erxes-plugin-exm-feed/home" component={home} />
);

export default ExmRoutes;
