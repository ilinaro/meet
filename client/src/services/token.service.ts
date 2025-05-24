

export const getToken = () => ({
  token: localStorage.getItem("token"),
});

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const removeToken = (): void => {
    try {
      localStorage.removeItem('token');
    } catch (error) {
      console.warn('Failed to remove token from localStorage:', error);
    }
  };


export const isTokenValid = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime + 30;
    } catch (error) {
      console.warn('Invalid token format:', error);
      return false;
    }
  };
  
  export const getTokenExpiration = (token: string): number | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000;
    } catch (error) {
      console.warn('Failed to get token expiration:', error);
      return null;
    }
  };
  
  export const setTokenSafe = (token: string): boolean => {
    if (!isTokenValid(token)) {
      console.error('Attempting to save invalid token');
      return false;
    }
    
    try {
      setToken(token);
      return true;
    } catch (error) {
      console.error('Failed to save token:', error);
      return false; 
    }
  };