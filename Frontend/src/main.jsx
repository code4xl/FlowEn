import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from "react-redux";
import Store from "./App/store.js";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <React.StrictMode>
      <Provider store={Store}>
        <Toaster position='top-center' reverseOrder={true}/>
        <App />
      </Provider>
    </React.StrictMode>
  </BrowserRouter>
)
