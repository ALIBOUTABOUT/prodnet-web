/**
 * Entry point — mounts the React tree into `#root`.
 *
 * README ref: "lib/main.dart"
 * void main() => runApp(const ProdNet());
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
