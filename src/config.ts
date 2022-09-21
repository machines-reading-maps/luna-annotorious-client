export const API_BASE = '/api';

export const ORIGIN = location.protocol + '//' + location.host;

export const LUNA_BASE_URL = 'https://clone.davidrumsey.com/luna/servlet';
export const LUNA_LOGIN_URL = LUNA_BASE_URL + '/login?origin=' + location.href;
export const LUNA_TOKEN_URL = LUNA_BASE_URL + '/token?messageId=1&origin=' + ORIGIN + '/auth_callback.html';
export const LUNA_LOGOUT_URL = LUNA_BASE_URL + '/logout';