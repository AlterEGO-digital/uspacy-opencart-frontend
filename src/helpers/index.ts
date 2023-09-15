export const isDev = process.env.NODE_ENV === 'development';

export const isStage = window.location.host.includes('staging.uspacy.tech');

export const DOMAIN = isDev || isStage ? 'https://appopencart-uspacy.alterego.biz.ua' : 'https://appopencart-uspacy.alterego.digital';
