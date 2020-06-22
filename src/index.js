import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/configureStore'
import './index.css'
import App from '../src/components/App'


ReactDOM.render(
  <Provider store={store}>
    <HashRouter basename="/api-console">
            <App />
        </HashRouter>
  </Provider>,
  document.getElementById('root')
)