import React from 'react';
import ReactDOM from 'react-dom/client';

import NewTab from './NewTab';
import '../styles/global.css';
import './NewTab.css';

const container = document.getElementById('root');

if (!container) {
    throw new Error("Could not find root container to mount the app");
}

const root = ReactDOM.createRoot(container);
root.render(
    <React.StrictMode>
        <NewTab />
    </React.StrictMode>
);