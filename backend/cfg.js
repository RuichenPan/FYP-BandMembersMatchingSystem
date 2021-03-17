module.exports = {
  development: {
    dbConn: 'mongodb+srv://admin:dRyHwY67qWhkmwDF@cluster0.3trxw.mongodb.net/Hurricane?retryWrites=true&w=majority&ssl=true',
    jwtKey: 'ruichenpan221@gmail.com',
    webSite: 'http://127.0.0.1:3000',
  },
  production: {
    dbConn: 'mongodb+srv://admin:dRyHwY67qWhkmwDF@cluster0.3trxw.mongodb.net/Hurricane?retryWrites=true&w=majority',
    jwtKey: 'ruichenpan221@gmail.com',
    webSite: 'http://127.0.0.1:3000',
  },
}[process.env.NODE_ENV || 'development'];
