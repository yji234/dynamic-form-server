const DynamicformsModel = require('./module/dynamicforms.js');
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const cors = require('koa-cors');
const bodyParser = require('koa-bodyparser');


/**
 * 新增：提交的时候没有id 
 * 修改：提交的时候有id
*/
router.post('/addForm', async (ctx, next) => {
  const { _id } = ctx.request.body
  console.log(_id);
  const forms = new DynamicformsModel(ctx.request.body)
  console.log('forms', forms)
  if(_id) {
    console.log('我修改数据了');
    forms.update_time = Date.now();
    console.log(forms)
    await DynamicformsModel.updateOne({_id}, forms, (error) => {
      if(error) {
        console.log(error);
        return;
      }
      console.log('修改成功')
    })
  } else {
    console.log('我新增数据了');
    forms.create_time = Date.now();
    console.log(forms);
    await forms.save().then(() => {
      console.log('增加成功')
    })
  }
  ctx.body = {
      status: 200,
      message: '增加成功',
  };
  await next();
});

// 删除
router.delete('/deleteForm/:id', async (ctx, next) => {
  const { id } = ctx.params;
  await DynamicformsModel.findOneAndRemove({_id: id}, (error) => {
    if(error) {
      console.log(error);
      return;
    }
  })
  ctx.body = {
    status: 200,
    message: '删除成功',
  };
  await next();
})

// 修改状态
router.get('/modifyStatus/:id/:status', async (ctx, next) => {
  const { id, status } = ctx.params;
  await DynamicformsModel.updateOne({_id: id}, {status}, (error) => {
    if(error) {
      console.log(error);
      return;
    }
  })
  ctx.body = {
    status: 200,
    message: '状态修改成功',
  };
  await next();
})

// 查询
router.get('/getDynamicforms', async (ctx, next) => {
  const result = await DynamicformsModel.find({}, (error) => {
    if(error) {
      console.log(error);
      return;
    }
  });
  ctx.body = {
    status: 200,
    message: '查询成功',
    data: result,
    pagination: {
      pageNum: 1,
      pageSize: 10,
      totalCount: result.length,
    }
  };
  await next();
});

app.use(cors());
app.use(bodyParser());
app.use(router.routes());   /*启动路由*/
app.use(router.allowedMethods());
 
app.listen(8888);