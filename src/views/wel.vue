<template>
    <div class="container">
      <el-card class="wrap">
        <img src="./logo.png" alt="">
      </el-card>
    </div>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "wel",
    data() {
      return {
        activeNames: ['1', '2', '3', '5'],
        logActiveNames: ['1', '2']
      };
    },
    computed: {
      ...mapGetters(["userInfo"]),
    },
    created() {
    },
    methods: {
      handleChange(val) {
        console.log(val);
      }
    }
  };
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
}
.wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
