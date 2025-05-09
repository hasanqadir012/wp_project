import { decodeJwt } from 'jose';

export function isTokenExpired(token) {
  if (!token) return true;
  
  try {
    const decodedToken = decodeJwt(token);
    const currentTime = Math.floor(Date.now() / 1000);
    
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
}

export function getTokenExpirationTime(token) {
  if (!token) return null;
  
  try {
    const decodedToken = decodeJwt(token);
    return decodedToken.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export function setupTokenExpirationCheck(logout) {
  const token = localStorage.getItem('token');
  if (!token) return;
  
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return;
  
  const timeUntilExpiration = expirationTime - Date.now();
  if (timeUntilExpiration <= 0) {
    logout();
    return;
  }
  
  const logoutTime = Math.max(0, timeUntilExpiration - 60000);
  setTimeout(() => {
    logout();
  }, logoutTime);
}