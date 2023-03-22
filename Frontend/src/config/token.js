const TOKEN_KEY = 'SessionToken';

exports.setToken = (token) => {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
  
exports.getToken = () => {
    return sessionStorage.getItem(TOKEN_KEY);
}

exports.logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    window.location = '/';
}