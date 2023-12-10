import { createRoot } from 'react-dom/client';
import App from './App';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import React from 'react';
import './index.scss';
import Test from './pages/Test';
import AccountManager from './pages/AccountManager';


const router = createBrowserRouter([
  {
    path: 'app',
    element: <App />,
    children: [
      {
        path: 'account-manager',
        element: <AccountManager />
      },
      {
        path: 'test',
        element: <Test />
      },
      {
        index: true,
        element: <Navigate to='account-manager' replace={true} />
      }
    ]
  },
  {
    index: true,
    element: <Navigate to='/app' replace={true} />
  },
  {
    path: '*',
    element: <Navigate to='/app' replace={true} />
  }
]);


const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
// root.render(<App />);

root.render(
  <RouterProvider router={router} />
);

// calling IPC exposed from preload script
// window.electron.ipcRenderer.on('test-info', (arg) => {
//   console.log('test-info', arg);
// });
// window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
