import { createStore, applyMiddleware } from '@reduxjs/toolkit'
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from './reducers'
import thunk from "redux-thunk";

const middleware = [thunk];

export default createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);