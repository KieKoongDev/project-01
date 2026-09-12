import '@fontsource/itim/thai-400.css';
import '@fontsource/itim/latin-400.css';
import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './styles.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
