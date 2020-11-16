<template>
  <div>
    <avue-ueditor v-model="text" :options="options"></avue-ueditor>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      text: '',
      options: {
        //普通图片上传
        action: "https://avuejs.com/imgupload",
        customConfig: {},//wangEditor编辑的配置
        props: {
          res: "data",
          url: "url"
        },
        //七牛云oss配置
        qiniu: {
          AK: "",
          SK: "",
          scope: "test",
          url: "http://pm7cc17lu.bkt.clouddn.com/",
          deadline: 1
        },
        //阿里云oss配置
        ali: {
          region: "oss-cn-beijing",
          endpoint: "oss-cn-beijing.aliyuncs.com",
          accessKeyId: "",
          accessKeySecret: "",
          bucket: "avue"
        }
      }
    }
  },
}
</script>

<style scoped>

</style>
