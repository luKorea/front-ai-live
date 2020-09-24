<template>
  <basic-container>
    <el-row>
      <el-col :span="16">
        <el-collapse v-model="activeNames" @change="handleChange">
        
        </el-collapse>
      </el-col>
      
    </el-row>
  </basic-container>
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

