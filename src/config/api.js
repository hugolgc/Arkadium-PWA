const { VITE_APP_API, VITE_APP_TOKEN } = import.meta.env

const apiConfig = {
  getUrl(path) {
    return VITE_APP_API + path
  },
  getSettings(method, body) {
    return {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + VITE_APP_TOKEN
      },
      body: body ? JSON.stringify(body) : null
    }
  }
}

export default apiConfig