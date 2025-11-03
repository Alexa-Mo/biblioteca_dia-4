// src/router.jsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './features/auth/pages/Login';
import { Register } from './features/auth/pages/Register';
import { Profile } from './features/profile/pages/Profile';
import { Posts } from './features/blog/pages/Posts';
import { PostDetail } from './features/blog/pages/PostDetail';
import { Contact } from './features/contact/pages/Contact';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/blog" replace />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/blog',
    element: (
      <ProtectedRoute>
        <Posts />
      </ProtectedRoute>
    )
  },
  {
    path: '/blog/book/:id',
    element: (
      <ProtectedRoute>
        <PostDetail />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: '/contact',
    element: (
      <ProtectedRoute>
        <Contact />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <Navigate to="/blog" replace />
  }
]);