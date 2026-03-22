export default [
  {
    path: '/home',

    name: '主页',
    component: './Index' ,
    icon:"home",

  },
  {
    path: '/interface_info/:id',

    name: '查看接口',
    component: './InterfaceInfo' ,
    icon:"home",

  },
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './user/login' }],
  },
  // { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { name: '接口管理', icon: 'table', path: '/admin/interface_info', component: './Admin/InterfaceInfo' },
      { name: '接口分析', icon: 'analysis', path: '/admin/interface_analysis', component: './Admin/InterfaceInfoAnalysis' },
    ],
  },

  { path: '/', redirect: '/admin' },
  { path: '*', layout: false, component: './404' },
];
