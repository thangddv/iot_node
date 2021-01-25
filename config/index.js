module.exports = {
  port: process.env.PORT || 8000,
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
    expiry: '10d',
  },
  mqtt: {
    host: '192.168.43.218',
    port: 1883,
  },
};
