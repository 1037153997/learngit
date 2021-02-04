<template>
  <div class="sidebar">
    <!--  <div class="sidebar">-->
    <el-menu
      background-color="#324157"
      :collapse="$store.state.isCollapse"
      :default-active="$route.path"
      class="el-menu-vertical-demo menu"
      active-text-color="#10B9D3"
      text-color="#B1BDCB"
      unique-opened
      router
    >
      <el-menu-item index="/index">
        <i class="el-icon-chat-dot-round"></i>
        <span slot="title">简述</span>
      </el-menu-item>
      <el-menu-item index="/dashboard">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/mail_send">
        <i class="el-icon-edit-outline"></i>
        <span slot="title">写信</span>
      </el-menu-item>
      <el-menu-item index="/inbox">
        <i class="el-icon-message"></i>
        <span slot="title">收件箱</span>
      </el-menu-item>
      <el-menu-item index="/outbox">
        <i class="el-icon-s-promotion"></i>
        <span slot="title">发件箱</span>
      </el-menu-item>
      <el-menu-item index="/draftbox">
        <i class="el-icon-document"></i>
        <span slot="title">草稿箱</span>
      </el-menu-item>
      <el-menu-item index="/mail_list">
        <i class="el-icon-refresh"></i>
        <span slot="title">回收站</span>
      </el-menu-item>


      <template v-for="(menu_one,i) in menuData" >
        <el-submenu :key="i" :index="menu_one.path">
          <template slot="title">
            <i :class="menu_one.icon"></i>
            <span>{{menu_one.title}}</span>
          </template>
          <el-menu-item
            v-for="(menu_two,i) in menu_one.subs"
            :key="i"
            :index="menu_two.path"
          >
            <span>{{menu_two.title}}</span>
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>
<script>
// import bus from './bus';
export default {
  data() {
    return {
      // isCollapse: false,
      menuData: [
        {
          icon: "el-icon-s-management",
          title: "邮件标签",
          path: "mailLabel",
          subs: [
            {
              path: "/mail_label",
              title: "标签管理",
            }
          ]
        },
        {
          icon: "el-icon-notebook-1",
          title: "通讯录",
          path: "mailContacts",
          subs: [
            {
              path: "/mail_contacts/group",
              title: "分组管理",
            },
            {
              path: "/mail_contacts/index",
              title: "所有联系人",
            }
          ]
        }
      ]
    };
  },
  methods:{

  },
  created() {
    // bus.$on('collapse', msg => {
    //   this.isCollapse = msg;
    // });
  }
}
</script>
<style lang='less' scoped>
.sidebar {
  display: flex;
  flex-flow: column nowrap;
  height: 100vh;

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    background-color: #324157;
  }
  .menu{
    height: 100%;
    border-right: 0;
    background-color: #324157;
  }
}
</style>
