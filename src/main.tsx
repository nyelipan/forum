import './index.css'; // Optional, for global styles

// src/main.tsx or src/index.tsx (depending on your project setup)
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App'; // Make sure to import the App component

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);

root.render(
    <React.StrictMode>
        <App /> {/* Render the App component */}
    </React.StrictMode>,
);
