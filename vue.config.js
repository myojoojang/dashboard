module.exports = {

  devServer: {
    disableHostCheck: true,
    overlay: false,
    proxy: 'http://localhost:4000',
  },

  transpileDependencies: [
    'vuetify'
  ]
};
  
