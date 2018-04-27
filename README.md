## 简易版模拟BOSS直聘

[后台介绍](project_server/README.md)

### 前台介绍（project_client）

#### 1.项目描述
1. 此项目为一个前后台分离的招聘的SPA, 包括前端应用和后端应用
2. 包括用户注册/登陆, 大神/老板列表, 实时聊天等模块
3. 前端: 使用`React全家桶`+`ES6`+`Webpack`等技术
4. 采用模块化、组件化、工程化的模式开发

#### 2.技术选型
1. 前台数据展现/交互/组件化
    - `react`
    - `react-router-dom`
    - `redux`
        - `react-redux`
        - `redux-thunk`
    - `antd-mobile`
2. 项目构建/工程化
    - `webpack`
    - `create-react-app`
    - `eslint`

#### 3.前端路由
1. 注册，`src/containers/register`
2. 登陆，`src/containers/login`
3. 主页面，`src/containers/main`

#### 4.其他配置文件
1. `config-overrides.js`为了实现组件的按需打包，并且在其中更改了`antd`的一些默认样式
