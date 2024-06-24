import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';
import { Route } from 'react-router-dom';
import App from './containers/app';
import { LocalizeProvider } from "react-localize-redux";
import "./index.css";
const target = document.querySelector('#root');

const Root = () => {
  return (
    <Provider store={store} >
      <ConnectedRouter history={history} >
        <LocalizeProvider >
          <Route exac path="/" component={App} />
        </LocalizeProvider>
      </ConnectedRouter>
    </Provider>
  )
}

render(<Root />, target);