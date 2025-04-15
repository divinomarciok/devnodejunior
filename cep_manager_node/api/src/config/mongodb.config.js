module.exports = {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cep_manager',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,   
    },
  };
