<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {};
  },
  watch: {},
  created() {
    /*this.$notify.success({
      title: "授权信息",
      dangerouslyUseHTMLString: true,
      message:
        '<p>欢迎使用Archer!</p>' +
        '<p>Archer是独立的全能代码生成系统，</p>' +
        '<p>后续将不断迭代增强代码生成能力，</p>' +
        '<p>若有需，请购买BladeX企业授权。️</p>' +
        '</br>' +
        '<p>BladeX 授权地址：<a target="_blank" href="https://bladex.vip/#/vip">点击授权</a></p>',
      duration: 300000,
      position: 'bottom-right',
      type: "success"
    });*/
  },
  methods: {},
  computed: {}
};
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
