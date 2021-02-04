<template>
  <div class="header">
    <div class="collapse-btn" @click="collapseChange" >
      <i :class="$store.state.isCollapse? 'el-icon-s-unfold' : 'el-icon-s-fold'"/>
    </div>
    <vTag></vTag>
    <div class="nav-right">
      <el-dropdown>
        <span class="drop">
          <img src="../../assets/image/head-ico.png" alt="" class="users-ico">
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>首页</el-dropdown-item>
          <el-dropdown-item>设置</el-dropdown-item>
          <hr>
          <el-dropdown-item @click.native="loginOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </div>
  </div>

</template>
<script>
// import bus from './bus'
import {COLLAPSECHANGE} from '../../store/mutations-types';
import vTag from '../../views/common/tag';
export default{
  components: { vTag },
  data(){
    return{
      // isCollapse:false
      usersBar:true
    }
  },
  methods:{
    collapseChange(){
      // this.isCollapse=!this.isCollapse;
      // bus.$emit('collapse',this.isCollapse);

      //用vuex进行通信
      // this.$store.commit(COLLAPSECHANGE)//(1)直接调用mutations
      //通过actions调用
      this.$store.dispatch(COLLAPSECHANGE);
      // console.log(this.$store.state);
    },
    loginOut(){
      setTimeout(() => {
        this.$router.push('/login')
      },1000)
    }
  }
}
</script>

<style lang='less' scoped>

.header {
  display: flex;
  flex-flow: row nowrap;
  //justify-content: space-between;
  //align-items: center;
  font-size: 25px;
  color: #fff;
  background-color: #9dc4e4;
  height: 60px;
  .collapse-btn {
    line-height: 60px;
    cursor: pointer;
    text-align: center;
    width: 60px;
    &:hover {// 有 & 时解析的是同一个元素或此元素的伪类，没有 & 解析是后代元素
      color: black;
      text-decoration: underline;
    }
  }
  .drop{
    margin-top: 0px;
    .users-ico {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }
  }
  .nav-right{
    display: flex;
    cursor: pointer;
    margin-top: 10px;
    position: absolute;
    right: 35px;
  }
}
</style>
