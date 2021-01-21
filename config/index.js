module.exports = {
  port: process.env.PORT || 3000,
  db: {
    url:
      process.env.DATABASE_URL ||
      'mongodb+srv://admin:123456a@cluster0.um1pl.mongodb.net/iot_application?retryWrites=true&w=majority',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'jwt_secret',
    expiry: '1d',
  },
  mqtt: {
    host: '192.168.137.13',
    port: 1883,
  },
};
