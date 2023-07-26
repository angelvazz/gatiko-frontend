import { createContext, useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    console.log('User:', user);
  }, [user]);

  const checkUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log('Authenticated user:', user);
      setUser(user);
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, checkUser }}>
      {children}
    </AuthContext.Provider>
  );
};
