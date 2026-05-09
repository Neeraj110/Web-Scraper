const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  if (!password || password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters" };
  }
  if (password.length > 128) {
    return { valid: false, message: "Password must not exceed 128 characters" };
  }
  return { valid: true };
};

const isValidName = (name) => {
  if (!name || name.trim().length === 0) {
    return false;
  }
  if (name.trim().length > 100) {
    return false;
  }
  return true;
};

export { isValidEmail, isValidPassword, isValidName };
