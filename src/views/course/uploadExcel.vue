<!--<template>-->
<!--  <div>-->
<!--    <el-upload style="display: inline" action="" :show-file-list="false" :http-request="uploadExcel_repuest">-->
<!--      <el-button size="small" type="primary">{{uploadText}}</el-button>-->
<!--    </el-upload>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import XLSX from 'xlsx'-->
<!--export default {-->
<!--  props:{-->
<!--    uploadText: {-->
<!--      type: String,-->
<!--      require: true,-->
<!--      default: '导入'-->
<!--    },-->
<!--    api: {-->
<!--      type: String,-->
<!--      require: true,-->
<!--      default: '/'-->
<!--    }-->
<!--  },-->
<!--  data(){-->
<!--    return {-->
<!--      importData: '',-->
<!--      wb: ''-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    uploadExcel_repuest(content){-->
<!--      var reader = new FileReader()-->
<!--      reader.readAsBinaryString(content.file)-->
<!--      reader.onload = (e) => {-->
<!--        let data = e.target.result //获取上传的文件内容-->
<!--        this.wb = XLSX.read(data, {-->
<!--          type: 'binary'-->
<!--        })-->
<!--        this.importData = XLSX.utils.sheet_to_json(this.wb.Sheets[this.wb.SheetNames[0]])-->
<!--        console.log("解析到的excel数据为:",this.importData)-->
<!--      }-->
<!--    },-->
<!--    uploadExcel_change(content){-->
<!--      var reader = new FileReader()-->
<!--      reader.readAsBinaryString(content.raw)-->
<!--      reader.onload = (e) => {-->
<!--        let data = e.target.result //获取上传的文件内容-->
<!--        this.wb = XLSX.read(data, {-->
<!--          type: 'binary'-->
<!--        })-->
<!--        this.importData = XLSX.utils.sheet_to_json(this.wb.Sheets[this.wb.SheetNames[0]])-->
<!--        console.log("解析到的excel数据为:",this.importData)-->
<!--      }-->
<!--    },-->
<!--    uploadExcelData(data){-->
<!--      this.imFile.value = ''-->
<!--      this.$post(this.api,data).then(-->
<!--        res => {-->
<!--          if(res.code == 'success'){-->
<!--            this.$notify({title: '成功', message: '导入成功!', type: 'success'})-->
<!--            this.queryData()-->
<!--            this.fullscreenLoading = false-->
<!--          }else(-->
<!--            this.$alert(res.message, '导入失败', {-->
<!--              confirmButtonText: '确定',-->
<!--              callback: action => {-->
<!--                this.fullscreenLoading = false-->
<!--                this.queryData()-->
<!--              }-->
<!--            })-->
<!--          )-->
<!--        }-->
<!--      ).catch(err => {-->
<!--        console.log("err is:",err)-->
<!--        this.$notify.error({ title: '错误', message: '抱歉，导入失败!'})-->
<!--        this.fullscreenLoading = false-->
<!--      })-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->
