const env = import.meta.env

const config = {
    appName: env.VITE_APP_NAME,
    apiBaseUrl: env.VITE_APP_API_BASE_URL,
    apiBasePath: env.VITE_APP_API_BASE_PATH,
    apiUrl:env.VITE_APP_API_BASE_URL + env.VITE_APP_API_BASE_PATH,
  }
  
  export default config