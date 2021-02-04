import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:'/login',
    name:'login',
    component:()=>import('../views/common/login.vue'),
    meta:{
      title:'登录',
    }
  },
  {
    path: '/',
    name: 'home',
    redirect:'/login',
    component: Home,
    meta:{title:'首页'},
    children:[
      {
        path:'/index',
        name:'index',
        component:()=>import('../views/index.vue'),
        meta:{
          title:'简述',
          hideclose: true,
        }
      },
      {
        path:'/dashboard',
        name:'dashboard',
        component:()=>import('../views/dashboard/index'),
        meta:{
          title:'首页',
          hideclose: true,
        }
      },
      {
        path:'/mail_send',
        name:'mail_send',
        component:()=>import('../views/mail_send/index'),
        meta:{
          title:'写信',
        }
      },
      {
        path:'/inbox',
        name:'inbox',
        component:()=>import('../views/inbox/index'),
        meta:{
          title:'收件箱',
        }
      },
      {
        path:'/outbox',
        name:'outbox',
        component:()=>import('../views/outbox/index'),
        meta:{
          title:'发件箱',
        }
      },
      {
        path:'/draftbox',
        name:'draftbox',
        component:()=>import('../views/draftbox/index'),
        meta:{
          title:'草稿箱',
        }
      },
      {
        path:'/mail_list',
        name:'mail_list',
        component:()=>import('../views/mail_list/index'),
        meta:{
          title:'回收站',
        }
      },


      {
        path:'/mail_label',
        name:'mail_label',
        component:()=>import('../views/mail_label/index'),
        meta:{
          title:'标签管理'
        }
      },
      {
        path:'/mail_contacts/group',
        name:'group',
        component:()=>import('../views/mail_contacts/group'),
        meta:{
          title:'分组管理'
        }
      },
      {
        path:'/mail_contacts/index',
        name:'index1',
        component:()=>import('../views/mail_contacts/index'),
        meta:{
          title:'所有联系人'
        }
      },


    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
