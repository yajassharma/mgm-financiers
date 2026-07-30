export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGO_URI,
  jwt: {
    adminSecret: process.env.ADMIN_JWT_SECRET,
    userSecret: process.env.USER_JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
  cashfreeAppId: process.env.CASHFREE_APP_ID,
  cashfreeSecretKey: process.env.CASHFREE_SECRET_KEY,
  frontendBase: process.env.FRONTEND_BASE,
  apiBase: process.env.API_BASE,
});
