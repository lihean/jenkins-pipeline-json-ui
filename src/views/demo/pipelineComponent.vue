<template>
  <div>
    <Modal v-model="show" @on-ok="ok" @on-cancel="cancel">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>选择任务类型</span>
      </p>
      <div>
        <Select v-model="componentName" style="width: 100%;">
          <Option v-for="item in components" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Divider/>
        <div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "pipelineComponent",
    props: {
      components: {
        type: Array,
        default: []
      },
      showModal: {
        type: Boolean,
        default: false
      }
    },
    data: () => {
      return {
        componentName: null,
        show: false
      }
    },
    created() {
      this.show = this.showModal;
    },
    methods: {
      ok() {
        this.$Message.info('Clicked ok');
        this.show = false;
      },
      cancel() {
        this.$Message.info('Clicked cancel');
        this.show = false;
        this.$emit('cancelAddStage');
      }
    }
  }
</script>

<style scoped>

</style>
