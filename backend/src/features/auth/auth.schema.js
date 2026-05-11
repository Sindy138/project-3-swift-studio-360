const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateRegister(data) {
  if (!data.email || !EMAIL_REGEX.test(data.email)) {
    return 'A valid email is required'
  }
  if (!data.password || data.password.length < 8) {
    return 'Password must be at least 8 characters'
  }
  return null
}

function validateLogin(data) {
  if (!data.email) return 'Email is required'
  if (!data.password) return 'Password is required'
  return null
}

module.exports = { validateRegister, validateLogin }
