<style scoped lang="less">
  .index {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    text-align: center;

    h1 {
      height: 150px;

      img {
        height: 100%;
      }
    }

    h2 {
      color: #666;
      margin-bottom: 200px;

      p {
        margin: 0 0 50px;
      }
    }

    .ivu-row-flex {
      height: 100%;
    }
  }
</style>
<template>
  <div class="index">
    <Row type="flex">
      <Col span="3">
        <h1>
          <img src="../images/logo.png">
        </h1>
        <h2>
          <p>Welcome to your iView app!</p>
          <Button @click="handleStart">Start iView</Button>
        </h2>
        <Menu></Menu>
      </Col>
      <Col span="21" style="height: calc(100% - 55px);overflow: auto;">
        <div>
          <div>
            <transition mode="out-in">
              <router-view></router-view>
            </transition>
          </div>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
  export default {
    methods: {
      handleStart() {
        this.$Modal.info({
          title: 'Bravo',
          content: 'Now, enjoy the convenience of iView.'
        });
      }
    }
  }
</script>
