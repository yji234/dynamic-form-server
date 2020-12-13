// 链接数据库

// 引入
const mongoose = require('mongoose');

const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true ,
}

// 建立连接
mongoose.connect('mongodb://127.0.0.1:27017/dynamicforms', config, (error) => {
  if(error) {
    console.log(error);
    return;
  }
  console.log('成功连接数据库');
});

module.exports = mongoose;
