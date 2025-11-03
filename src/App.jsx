// src/App.jsx
import { AuthProvider } from './features/auth/context/AuthContext';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;