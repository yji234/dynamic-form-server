const FormbaseModel = require('./module/formbase.js');
const DragDropSchemaModel = require('./module/dragdrop.js');
const FormattrSchemaModel = require('./module/formattr');
const UserSchemaModel = require('./module/user');
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
  const forms = new FormbaseModel(ctx.request.body)
  if(_id) {
    forms.update_time = Date.now();
    await FormbaseModel.updateOne({_id}, forms, (error) => {
      if(error) {
        console.log(error);
        return;
      }
    })
  } else {
    forms.create_time = Date.now();
    await forms.save().then(() => {
      console.log('Form Base-增加成功')
    })
  }
  ctx.body = {
      status: 200,
      message: '增加成功',
      data: {
        parentId: forms._id,
      },
  };
  await next();
});

// 删除
router.delete('/deleteForm/:id', async (ctx, next) => {
  const { id } = ctx.params;
  await FormbaseModel.findOneAndRemove({_id: id}, (error) => {
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
  await FormbaseModel.updateOne({_id: id}, {status}, (error) => {
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
  const result = await FormbaseModel.find({}, (error) => {
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


/**
 * 拖拽元素
*/
// 增加
router.post('/addDragSource', async (ctx, next) => {
  const dragSource = new DragDropSchemaModel(ctx.request.body)
  await dragSource.save().then(() => {
    console.log('增加成功')
  })
  ctx.body = {
      status: 200,
      message: '增加成功',
  };
  await next();
});

// 查询
router.get('/getDragSource', async (ctx, next) => {
  const result = await DragDropSchemaModel.find({}, (error) => {
    if(error) {
      console.log(error);
      return;
    }
  });
  ctx.body = {
    status: 200,
    message: '查询成功',
    data: result,
  };
  await next();
});

/**
 * Form Attr
*/
// 增加
router.post('/addFormList', async(ctx, next) => {
  const parentId = ctx.request.body.parentId;
  const forms = JSON.parse(ctx.request.body.forms);
  forms.forEach(async(item) => {
    const formListItem = new FormattrSchemaModel(item)
    formListItem.parentId = parentId;
    await formListItem.save().then(() => {
      console.log('Form Attr-增加成功')
    })
  })
  ctx.body = {
    status: 200,
    message: '增加成功',
  };
  await next();
});

// 修改
router.post('/modifyFormList', async(ctx, next) => {
  const parentId = ctx.request.body.parentId;
  const forms = JSON.parse(ctx.request.body.forms);
  forms.forEach(async(item) => {
    const formListItem = new FormattrSchemaModel(item)
    console.log('formListItem', formListItem)
    // 查询下当前数据是否已经在数据库中存在
    const result = await FormattrSchemaModel.find({_id: formListItem._id}, (error) => {
      if(error) {
        console.log(error);
        return;
      }
    })
    console.log('result', result);
    // 若存在，则修改
    if(result.length > 0) {
      await FormattrSchemaModel.updateOne({_id: formListItem._id}, formListItem, (error) => {
        if(error) {
          console.log(error);
          return;
        }
        console.log('Form Attr-修改成功')
      })
    } else {
      // 若不存在，则添加
      formListItem.parentId = parentId;
      await formListItem.save().then(() => {
        console.log('Form Attr-增加成功')
      })
    }
  })
  ctx.body = {
    status: 200,
    message: '增加成功',
  };
  await next();
});

// 查询
router.get('/getFormList/:parentId', async (ctx, next) => {
  const { parentId } = ctx.params;
  const result = await FormattrSchemaModel.find({parentId}, (error) => {
    if(error) {
      console.log(error);
      return;
    }
  })
  ctx.body = {
    status: 200,
    message: '查询成功',
    data: result,
  };
  await next();
})

// 删除某个表单item
router.delete('/deleteFormList/:_id', async (ctx, next) => {
  const { _id } = ctx.params;
  console.log('id', _id);
  await FormattrSchemaModel.findOneAndRemove({_id}, (error) => {
    if(error) {
      console.log(error);
      return;
    }
    console.log('Form Attr删除成功');
  })
  ctx.body = {
    status: 200,
    message: '删除成功',
  };
  await next();
})


/**
 * Menu
*/
// 增加
router.post('/addMenu', async(ctx, next) => {
  const menu = new UserSchemaModel(ctx.request.body);
  await menu.save().then(() => {
    console.log('增加成功')
  })
  ctx.body = {
    status: 200,
    message: '增加成功',
  };
  await next();
});
// 修改
router.post('/updateMenu', async (ctx, next) => {
  const { _id } = ctx.request.body
  const menu = new UserSchemaModel(ctx.request.body)
  menu.update_time = Date.now();
  await UserSchemaModel.updateOne({_id}, menu, (error) => {
    if(error) {
      console.log(error);
      return;
    }
    console.log('修改成功')
  })
  ctx.body = {
    status: 200,
    message: '修改成功',
  };
  await next();
});
// 查询
router.get('/getMenu', async (ctx, next) => {
  const result = await UserSchemaModel.find({}, (error) => {
    if(error) {
      console.log(error);
      return;
    }
  })
  ctx.body = {
    status: 200,
    message: '查询成功',
    data: result,
  };
  await next();
})
// 删除
router.delete('/deleteMenu/:_id', async (ctx, next) => {
  const { _id } = ctx.params;
  await UserSchemaModel.findOneAndRemove({_id}, (error) => {
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

app.use(cors());
app.use(bodyParser());
app.use(router.routes());   /*启动路由*/
app.use(router.allowedMethods());
 
app.listen(8888);
