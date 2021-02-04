<template>
  <div class="Login-page">
    <div class="login-box">
      <el-form ref="form" :model="form" :rules="LoginRules">
        <span class="title-spacing title-font">系统登录</span>
        <el-form-item prop="mail">
          <el-input class="input-font" placeholder="邮箱" prefix-icon="el-icon-message" v-model="form.mail"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input class="input-font" placeholder="密码" prefix-icon="el-icon-lock" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login-Btn" type="primary" @click="LoginBtn">登陆</el-button>
        </el-form-item>
<!--        <a class="login-tips-a" href="">忘记密码?(或首次登录)</a>-->
<!--        <span class="login-tips-span">-->
<!--             admin账号为:admin@mail.com 密码随便填-->
<!--          </span>-->
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login_Page",
  data(){
    return{
      form:{
        mail:'admin@gdhaiwu.com',
        password:''
      },
      LoginRules: {
        mail: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        password:[
          { required: true, message: '密码不能小于6位', trigger: 'blur' },
          { min: 6, message: '密码不能小于6位', trigger: 'blur' }
        ]
      },
    }
  },
  created(){

  },
  methods:{
    LoginBtn(){
      setTimeout(() => {
        this.$router.push('/dashboard')
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../common/Page_style.css";
</style>
