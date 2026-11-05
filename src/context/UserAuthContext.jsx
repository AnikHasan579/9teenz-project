import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const UserAuthContext = createContext();

export function UserAuthProvider({ children }) {
  const [userAuth, setUserAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      setUserAuth({ ...JSON.parse(userData), token });
    }
    setLoading(false);
  }, []);

  const registerUser = async (name, email, password) => {
    const res = await API.post('/users/register', { name, email, password });
    const userData = {
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
    };
    localStorage.setItem('userToken', res.data.token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUserAuth({ ...userData, token: res.data.token });
    return res.data;
  };

  const loginUser = async (email, password) => {
    const res = await API.post('/users/login', { email, password });
    const userData = {
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
    };
    localStorage.setItem('userToken', res.data.token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUserAuth({ ...userData, token: res.data.token });
    return res.data;
  };

  const logoutUser = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setUserAuth(null);
  };

  return (
    <UserAuthContext.Provider
      value={{ userAuth, registerUser, loginUser, logoutUser, loading }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}