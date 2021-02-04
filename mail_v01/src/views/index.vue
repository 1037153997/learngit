<template>
  <div class="app-container description">
    <div class="message">
      <p class="col-1">Welcome~~这是一个基于Vue2的邮件前端系统</p>
      <p class="col-1 ">
        更多信息:
        <a class="col-link" href="https://github.com/weihomechen/vue-mail-front">https://github.com/weihomechen/vue-mail-front</a>
      </p>
    </div>
    <div class="message-gif">
      <img class="gif-ico" src="../assets/image/follower_girl.gif" alt="">
    </div>
  </div>
<!--  <div>首页</div>-->
</template>
<script>
export default{
  name: "index"
}
</script>
<style lang="less" scoped>
@import "../common/Page_style.css";
.description{
  width: 100%;
  height: 50%;
  text-align: center;
  color: #fff;
  background-color: #FEEBEB;
}
.col-1,.col-link{
  color: #000;
}
.message-gif{

}
.gif-ico{
  width: 50%;
  height: 50%;
}
</style>
