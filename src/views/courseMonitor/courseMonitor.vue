<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               ref="crud"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               class="table"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="primary" size="small" @click='monitorUser'>查看课程监控</el-button>
      </template>
    </avue-crud>

    <el-dialog title="课程监控"
               :visible.sync="showModal"
               :close-on-click-modal="false"
               @close="closeModal"
               width="80%">
      <el-row :gutter="20">
        <!--预约课程同学列表-->
        <el-col :span="6">
          <el-card class="box-card user-item" shadow="never">
            <div slot="header" class="clearfix" style="text-align: center">
              <span>预约课程同学列表</span>
            </div>
            <div v-for="item in useData" :key="item.id"
                 class="text item item-info">
              <span>{{ item.name }}</span>
              <span>{{ item.phone }}</span>
              <el-tag type="danger" size="mini" v-if="item.type === 0">在线
              </el-tag>
              <el-tag type="primary" size="mini" v-if="item.type === 1">离线
              </el-tag>
            </div>
          </el-card>
        </el-col>
        <!--聊天记录-->
        <el-col :span="18">
          <el-col>
            <el-card class="box-card message-info" shadow="never">
              <div slot="header" class="clearfix">
                <span
                  style="font-size: 16px; font-weight: bold; margin-right: 20px">{{
                    courseInfo.courseTitle
                  }}</span>
                <span>{{ courseInfo.datetime }}</span>
                <span style="float: right">类型: {{ courseInfo.playType }}</span>
              </div>
              <div style="height: 216px; overflow: auto">
                <div v-for="info in infoData" :key='info.id'
                     class="text item item-info">
                  <span>{{ info.desc }}</span>
                  <span style="margin-right: 3px">{{ info.time }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <!--意向度-->
          <el-col>
            <el-card class="box-card" shadow="never">
              <el-tag class="m-right">意向度</el-tag>
              <el-select v-model="selectValue" placeholder="请选择"
                         @change="selectOpt">
                <el-option
                  v-for="item in selectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-card>
          </el-col>
          <!--管理员聊天-->
          <el-col>
            <el-card class="box-card" shadow="never">
              <el-row :gutter="20">
                <el-col :span="20">
                  <el-input
                    type="textarea"
                    v-model="messageInfo"
                    placeholder="可以联系我们的老师进行报名哦"
                    :rows="5"
                  />
                </el-col>
                <el-col :span="4">
                  <el-button type="primary" style="margin-bottom: 35px">强制提醒发送
                  </el-button>
                  <el-button type="primary">普通发送</el-button>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-col>
      </el-row>
    </el-dialog>
  </basic-container>
</template>

<script>
import {getList} from "@/api/studio/studio";

export default {
  data() {
    return {
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      option: {
        addBtn: false,
        tip: false,
        border: true,
        index: true,
        selection: true,
        menu: false,
        dialogClickModal: false,
        column: [
          {
            label: "直播间ID",
            prop: "id",
            search: true,
            rules: [{
              required: true,
              message: "请输入课程id",
              trigger: "blur"
            }]
          },
          {
            label: "视频地址",
            prop: "classAddress"
          },
          {
            label: "课程名称",
            prop: "courseTitle",
            rules: [{
              required: true,
              message: "请输入直播间地址",
              trigger: "blur"
            }]
          },
          {
            label: "课程类别",
            prop: "courseTypeName",
            rules: [{
              required: true,
              message: "请输入直播间地址",
              trigger: "blur"
            }]
          },
          {
            label: "创建时间",
            prop: "createTime",
            display: false
          }
        ]
      },
      data: [],
      selectionList: [],
      showModal: false,
      useData: [
        {
          id: 1,
          name: '张三',
          phone: '138******000',
          type: 0
        },
        {
          id: 2,
          name: '张三',
          phone: '138******000',
          type: 1
        },
        {
          id: 3,
          name: '张三',
          phone: '138******000',
          type: 0
        },
        {
          id: 4,
          name: '张三',
          phone: '138******000',
          type: 1
        }
      ],
      infoData: [
        {
          desc: '这个老师我好喜欢哦，讲的真好',
          time: new Date().toLocaleTimeString()
        },
        {
          desc: '这个老师我好喜欢哦，讲的真好',
          time: new Date().toLocaleTimeString()
        },
        {
          desc: '这个老师我好喜欢哦，讲的真好',
          time: new Date().toLocaleTimeString()
        },
        {
          desc: '这个老师我好喜欢哦，讲的真好',
          time: new Date().toLocaleTimeString()
        },
        {
          desc: '这个老师我好喜欢哦，讲的真好',
          time: new Date().toLocaleTimeString()
        },
        {
          desc: '这个老师我好喜欢哦，讲的真好',
          time: new Date().toLocaleTimeString()
        },
        {
          desc: '这个老师我好喜欢哦，讲的真好',
          time: new Date().toLocaleTimeString()
        }
      ],
      courseInfo: {},
      websock: null,
      // 意向度设置
      selectOptions: [
        {
          value: 'A',
          label: 'A'
        },
        {
          value: 'B',
          label: 'B'
        },
        {
          value: 'C',
          label: 'C'
        },
        {
          value: 'D',
          label: 'D'
        }],
      selectValue: '',
      // 管理员聊天
      messageInfo: '',
    };
  },
  created() {
    // this.initWebSocket();
  },
  destroyed() {
    this.websock.close() //离开路由之后断开websocket连接
  },
  computed: {
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  methods: {
    //初始化weosocket
    initWebSocket() {
      const wsuri = "ws://127.0.0.1:8080";
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() { //连接建立之后执行send方法发送数据
      let actions = {"test": "12345"};
      this.websocketsend(JSON.stringify(actions));
    },
    websocketonerror() {//连接建立失败重连
      this.initWebSocket();
    },
    websocketonmessage(e) { //数据接收
      const redata = JSON.parse(e.data);
      console.log(redata);
    },
    websocketsend(Data) {//数据发送
      this.websock.send(Data);
    },
    websocketclose(e) {  //关闭
      console.log('断开连接', e);
    },
    monitorUser(row) {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      } else if (this.selectionList.length > 1) {
        this.$message.warning("最多只能同时选择一条");
        return;
      }
      this.showModal = true;
      this.courseInfo = this.selectionList[0] || {};
      console.log(row);
      console.log(this.courseInfo);
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      this.loading = true;
      getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },
    // 设置意向度
    selectOpt(value) {
      console.log(value);
    },
    // 关闭窗口
    closeModal() {
      this.selectionClear()
    }
  }
};
</script>

<style scoped>
.item-info {
  display: flex;
  text-align: center;
  justify-content: space-between;
  margin: 20px 0;
}

.user-item {
  height: 540px;
  overflow: auto;
}

.message-info {
  height: 274px;
}

</style>
