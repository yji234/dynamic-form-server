const mongoose = require('./db.js');

// 操作表(集合collections) 定义一个Schema Schema里面的对象需要和数据库表的字段一一对应
const DragDropSchema = mongoose.Schema({
  name: String,
  bgColor: String,
  create_time: {
    type: Date,
    default: Date.now,
  },
  update_time: {
    type: Date,
    default: null,
  },
})

// 定义数据库模型 操作数据
// Model里面的第一个参数1、首字母大写；2、要和数据库表名称对应
const DragDropSchemaModel = mongoose.model('Dragdrop', DragDropSchema, 'dragdrop');

module.exports = DragDropSchemaModel;