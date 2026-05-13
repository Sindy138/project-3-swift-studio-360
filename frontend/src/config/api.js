const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Error en la petición')
  }

  return data
}

export default API_URL
