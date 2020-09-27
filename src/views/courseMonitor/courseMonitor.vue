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
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="primary" size="small" @click='monitorUser'>查看课程
        </el-button>
      </template>
    </avue-crud>

    <el-dialog title="课程监控"
               :visible.sync="showModal"
               :close-on-click-modal="false"
               :destroy-on-close="true"
               width="80%">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>预约课程同学列表</span>
            </div>
            <div v-for="item in useData" :key="item.id" class="text item">
              <span>{{ item.name }}</span>
              <span>{{ item.phone }}</span>
              <span>{{ item.type }}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="14">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>第一课吉他基础原理</span>
              <span>2020年09月05日</span>
              <span style="float: right">类型: 录播</span>
            </div>
            <div v-for="info in infoData" :key='info.id' class="text item">
              <span>{{ info.desc }}</span>
              <span>{{ info.time }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";
import {getList} from "@/api/course/course";

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
        tip: false,
        border: true,
        index: true,
        selection: true,
        menu: false,
        dialogClickModal: false,
        column: [
          // TODO 获取课程类别
          {
            label: "课程名称",
            prop: "courseTitle"
          },
          {
            label: "是否启用",
            prop: "isEnable",
            type: 'radio',
            dicData: [{
              label: '启用',
              value: 2
            }, {
              label: '停用',
              value: 1
            }],
            rules: [{
              required: true,
              trigger: "blur"
            }]
          },
          {
            label: "是否直播",
            prop: "isReal",
            type: 'radio',
            dicData: [{
              label: '录播',
              value: 2
            }, {
              label: '直播',
              value: 1
            }],
            rules: [{
              required: true,
              trigger: "blur"
            }]
          },
          {
            label: '直播间ID',
            prop: 'studioIds',
            display: false
          },
          {
            label: "课程表时间",
            prop: "datetime",
            display: false
          },
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
          type: '在线'
        },
        {
          id: 2,
          name: '张三',
          phone: '138******000',
          type: '在线'
        },
        {
          id: 3,
          name: '张三',
          phone: '138******000',
          type: '在线'
        },
        {
          id: 4,
          name: '张三',
          phone: '138******000',
          type: '在线'
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
        }
      ],
      websock: null,
    };
  },
  created() {
    // this.initWebSocket();
  },
  destroyed() {
    this.websock.close() //离开路由之后断开websocket连接
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.member_add, false),
        viewBtn: this.vaildData(this.permission.member_view, false),
        delBtn: this.vaildData(this.permission.member_delete, false),
        editBtn: this.vaildData(this.permission.member_edit, false)
      };
    },
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
      this.showModal = true;
      console.log(row);
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
  }
};
</script>

<style>
</style>
