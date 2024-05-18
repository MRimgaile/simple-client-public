import { useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const { logout } = useAuth();
  const navigateTo = useNavigate();

  useEffect(() => {
    logout()
      .then(() => {
        navigateTo('/login');
      })
      .catch((error) => alert(error.message));
  }, [logout, navigateTo]);

  return null;
}
