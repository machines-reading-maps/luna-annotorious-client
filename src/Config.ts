export const API_BASE = '/api';

export const ORIGIN = location.protocol + '//' + location.host;

export const LUNA_BASE_URL = 'https://clone.davidrumsey.com/luna/servlet';
export const LUNA_LOGIN_URL = LUNA_BASE_URL + '/login?origin=' + ORIGIN + '/auth_callback.htm';
export const LUNA_TOKEN_URL = LUNA_BASE_URL + '/token?messageId=1&origin=' + ORIGIN + '/auth_callback.html';