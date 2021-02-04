<template>

  <div class="homeContainer">
    <vAside></vAside>
    <div class="headContainer">
      <vHeader></vHeader>
      <div class="Container">
        <div class="mainContainer">
          <div class="main">
            <router-view></router-view>
          </div>
          <vFooter class="footer"></vFooter>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import vHeader from '../views/common/header';
import vAside from '../views/common/aside';
import vFooter from '../views/common/footer';

export default {
  data() {
    return {
      // isCollapse: false
    };
  },
  components: { vHeader, vAside, vFooter}
};
</script>
<style lang="less" scoped>
.homeContainer{
  // border: 1px solid red;
  box-sizing: border-box;

  height: 100vh;
  display: flex;
  flex-flow: row nowrap;
  .headContainer{
    // border: 1px solid red;
    box-sizing: border-box;

    display: flex;
    flex-flow: column nowrap;
    flex: auto;
    .Container{
      //  border: 1px solid blue;
      display: flex;
      flex-flow: column nowrap;
      flex: auto;

      .mainContainer{
        // border: 1px solid blue;
        background-color: #f0f0f0; //灰色背景

        box-sizing: border-box;
        display: flex;
        flex-flow: column nowrap;
        flex: auto;

        overflow: auto;
        height: calc(100vh - 100px);
        //width: auto;

        .main{
          // border:1px solid green;
          //padding: 10px;

          display: flex;
          flex: auto;
          // overflow: auto;

        }
        .footer{
          // border: 1px solid orange;

          flex: 0 0 60px;
        }

      }
    }

  }

}

</style>

