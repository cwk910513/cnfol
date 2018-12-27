# vue-chuwk

> vue-chuwk

## 构建

``` bash
# 安装依赖的JS文件
npm install

# 本地开发运行：127.0.0.1:8080
npm run dev

# 发布测试环境代码（测试环境配置）
npm run test

# 发布生产环境代码（生产环境配置）
npm run build
```

## 集成内容

``` bash
# Ant-Design of Vue
1：引用vue版Ant-Design样式

# axios
1：引用axios，代替vue-resoureurl
2：设置请求拦截，响应拦截
3：封装统一的接口方法（GET，POST，PUT，DELTE）
4：全局引用

# NProgress
1：设置全局的导航滚动条

# vuex
1：引用vuex

# mock
1：实现前端引用mock来模拟数据
2：实现mock数据刷新，自动重启express服务器