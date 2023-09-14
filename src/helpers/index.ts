export const isDev = process.env.NODE_ENV === 'development';

export const isStage = window.location.host.includes('staging.uspacy.tech');
