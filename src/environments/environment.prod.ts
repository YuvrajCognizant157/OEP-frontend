export const environment = {
  production: true,
  // This tells Angular to use the variable 'NG_APP_API_URL'
  // from the build environment (which you set on Netlify)
  apiUrl: process.env['NG_APP_API_URL'] 
};
