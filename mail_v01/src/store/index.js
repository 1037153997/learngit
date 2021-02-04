import vue from 'vue'
import Vuex from 'vuex'

import {COLLAPSECHANGE} from './mutations-types'
import app from './modules/app';
import user from './modules/user';
import permission from './modules/permission';
import mail from './modules/mail';

vue.use(Vuex)

const store = new Vuex.Store({
  state:{
    isCollapse:true
  },

  mutations:{
    // collapseChange(state){ ===['collapseChange'](state)
    //   state.isCollapse=!state.isCollapse;
    // }
    [COLLAPSECHANGE](state){
        state.isCollapse=!state.isCollapse;
      }
  },

  actions:{
    [COLLAPSECHANGE](context){//context联系上下文，转接
      context.commit(COLLAPSECHANGE)
    }
  },//异步提交mutations

  getters:{
    sidebar: state => state.app.sidebar,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    uid: state => state.user.uid,
    email: state => state.user.email,
    introduction: state => state.user.introduction,
    auth_type: state => state.user.auth_type,
    status: state => state.user.status,
    roles: state => state.user.roles,
    setting: state => state.user.setting,
    permission_routers: state => state.permission.routers,
    addRouters: state => state.permission.addRouters,
    // mail
    mailId: state => state.mail.mailId,
    draftId: state => state.mail.draftId,
    pageType: state => state.mail.pageType,
    mailType: state => state.mail.mailType,
    target: state => state.mail.target
  },//相当于计算属性

  modules:{
    app,
    user,
    permission,
    mail
  }
})

export default store

