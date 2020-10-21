<template>
  <div style="height: 100%">
    <el-tabs
      tab-position="left"
      style="height: 100%;"
      v-model="activeName"
      type='border-card'
      class="tab"
      @tab-click="handleClick">
      <el-tab-pane v-for="item in data" :key="item.id" :label="item.courseTitle"
                   :name="item.code">
        <el-row :gutter="20" style="position: fixed">
          <!--预约课程同学列表-->
          <el-col :span="6">
            <el-card class="box-card user-item" shadow="never"
                     style="height: 100%">
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
              <el-card class="box-card message-info" shadow="never"
                       style="height: 100%;overflow: auto">
                <div slot="header" class="clearfix">
                <span
                  style="font-size: 16px; font-weight: bold; margin-right: 20px">{{
                    courseInfo.courseTitle
                  }}</span>
                  <span>{{ courseInfo.daytime }}</span>
                  <span style="float: right">类型: {{
                      courseInfo.studioTypeName
                    }}</span>
                </div>
                <div style="height: 216px; overflow: auto" ref="msg-box">
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
                    <el-button type="primary" @click="websocketsend">普通发送
                    </el-button>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {getList} from "@/api/studio/studio";
import {getStore} from "@/util/store";

export default {
  data() {
    return {
      activeName: 'one',
      // ws
      messageId: "", //推送消息的id
      userId: "1", //当前该设备用户id(消息推送接收者)
      title: "", //消息标题
      message: "", //消息
      stompClient: null, //stomp
      loading: true,
      page: {
        pageSize: 1000,
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
        align: 'center',
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
      infoData: [],
      oldData: [],
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
      wsuri: 'ws://msg.liuyucn.com/api/websocket/',
      code: '',
      userName: '',
    };
  },
  created() {
    this.onLoad(this.page)
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
  updated() {
    this.scrollBottom();
  },
  methods: {
    //初始化weosocket
    initWebSocket(wsuri) { //初始化weosocket
      this.websock = new WebSocket(wsuri);
      console.log(this.websock);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen(e) { //连接建立之后执行send方法发送数据
      this.websocketonmessage()
      console.log(this.websock);
    },
    websocketonerror() {//连接建立失败重连
      this.initWebSocket();
    },
    websocketonmessage(e) { //数据接收
      console.log(e);
      const redata = JSON.parse(e.data);
      this.infoData = [
        ...this.infoData,
        {
          desc: redata.message,
          time: new Date().toLocaleTimeString()
        }
      ]
    },
    websocketsend() {//数据发送
      const data = getStore({name: 'userInfo'})
      const userName = data.account;
      this.websock.send(JSON.stringify({
        userName,
        code: this.code,
        message: this.messageInfo,
        time: new Date().toLocaleTimeString()
      }));
      this.messageInfo = '';
    },
    websocketclose(e) {  //关闭
      localStorage.removeItem('info')
      console.log('断开连接', e);
    },
    //滚动条到底部
    scrollBottom() {
      let el = this.$refs["msg-box"];
      el.scrollTop = el.scrollHeight;
    },
    handleClick(tab) {
      this.data.forEach(item => {
        if (item.code === tab.name) {
          this.courseInfo = item;
          this.code = item.code;
          this.initWebSocket(this.wsuri + item.code);
        }
        this.infoData = [];
        this.websocketclose()
      })
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
      this.connect();
      this.courseInfo = this.selectionList[0] || {};
      console.log(row);
      console.log(this.courseInfo);
    },
    onLoad(page, params = {}) {
      this.loading = true;
      getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.activeName = this.data[0].code || '';
        this.courseInfo = this.data[0];
        this.code = this.data[0].code;
        this.initWebSocket(this.wsuri + this.data[0].code);
        this.loading = false;
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
}
;
</script>

<style scoped>
.item-info {
  display: flex;
  text-align: center;
  justify-content: space-between;
  margin: 20px 0;
}

.user-item {
  height: 100%;
  overflow: auto;
}

.message-info {
  height: 274px;
}

.el-card .is-always-shadow {
  height: 100% !important;
}

.el-card__body {
  height: 100% !important;
}

.tab {
  height: 100% !important;
}
</style>
