<template>
  <div>
    <el-tabs
      tab-position="left"
      v-model="activeName"
      type='border-card'
      class="tab"
      @tab-click="handleClick">
      <el-tab-pane v-for="item in data" :key="item.id"
                   :label="`(${item.is_real}) ${item.course_title} ${item.daytime}`"
                   :name="item.studioIds">
        <el-row :gutter="20" v-show='showUserMessage'>
          <!--预约课程同学列表-->
          <el-col :span="6">
            <div style="text-align: center">预约课程同学列表</div>
            <el-card style="margin-top: 10px">
              <div v-for="(item, idx) in useData" :key="item.id"
                   style="border: 1px solid #c4c6ca; padding: 0 10px; margin-bottom: 10px">
                <el-link :underline="setLine"
                         @click="checkTim(item.studioId, idx)"
                         :class="idx==index?'hover':''">
                  进入聊天室<i class="el-icon-view el-icon--right"></i></el-link>
                <div v-for="(i, r) in item.userList" :key="r"
                     class="text item item-info" @click="setYi(i.id)">
                  <el-tooltip class="item" effect="dark" content="点击设置用户意向度"
                              placement="right-start">
                    <el-button style="width: 100%">
                      <div class="item-info-1">
                        <span>{{ i.name }}</span>
                        <span>{{ i.phone }}</span>
                        <el-tag type="danger" size="mini" v-if="i.state == 1">在线
                        </el-tag>
                        <el-tag type="primary" size="mini" v-if="i.state == 0">
                          离线
                        </el-tag>
                      </div>
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
            </el-card>
          </el-col>
          <!--聊天记录-->
          <el-col :span="18" v-show="showTim">
            <el-col>
              <el-card class="box-card message-info" shadow="never"
                       style="height: 100%;overflow: auto">
                <div slot="header" class="clearfix">
                  <span>聊天室</span>
                </div>
                <div style="height: 500px; overflow: auto" ref="msgBox"
                     id="chatRecord">
                  <div v-for="info in infoData" :key='info.id'
                       class="text item item-info">
                    <span>{{ info.name }}</span>
                    <span v-if="info.type === 4">
                      <img :src="info.img || info.content" alt="" style="width: 400px; height: 300px; object-fit: contain"/>
                    </span>
                    <span v-else>{{ info.msg || info.content }}</span>
                    <span style="margin-right: 20px">{{ info.sendTime }}</span>
                  </div>
                </div>
              </el-card>
            </el-col>
            <!--管理员聊天-->
            <el-col>
              <el-card class="box-card" shadow="never">
                <el-row :gutter="20">
                  <el-col :span="18">
                    <el-input
                      type="textarea"
                      v-model="messageInfo"
                      placeholder="可以联系我们的老师进行报名哦"
                      :rows="5"
                    />
                  </el-col>
                  <el-col :span="4">
                    <el-button type="primary" style="margin-bottom: 10px"
                               @click="websockSendMessage">强制提醒发送
                    </el-button>
                    <el-button type="primary" @click="websocketsend"
                               style="margin-bottom: 10px">普通发送
                    </el-button>
                    <el-upload
                      class="filter-item"
                      id='upload'
                      style="display: inline-block"
                      :action="'/api/blade-studio/put-file'"
                      :on-error="uploadFalse"
                      :on-success="uploadSuccess"
                      ref="img"
                      :data='{
                        studioId: studioId,
                        phone: adminPhone
                      }'
                      name="file"
                      :limit="1"
                      :show-file-list="false"
                    >
                      <el-button size="small" style="margin-left: 10px;"
                                 type="primary">图片上传
                      </el-button>
                    </el-upload>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <!--意向度-->
    <el-dialog title="设置用户意向度"
               :visible.sync="showYiModal"
               :close-on-click-modal="false"
               width="17%">
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
    </el-dialog>
  </div>
</template>

<script>
import {
  getHistoryMessage,
  getListPage,
  getUserMessage,
  setUserIntention
} from "@/api/studio/studio";
import {getStore} from "@/util/store";
import {deleteObject} from "@/util/util";

export default {
  data() {
    return {

      studioId: '',
      studioIds: '',
      //聊天室id

      activeName: '',
      showUserMessage: false,
      showYiModal: false,
      showTim: false,
      selectUserId: '',
      userAccount: '',
      setLine: false,
      index: null,
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
      historyPage: {
        pageSize: 100000,
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
      useData: [],
      infoData: [],
      oldData: [],
      courseInfo: {},
      websock: null,
      // 意向度设置
      selectOptions: [
        {
          value: 1,
          label: 'A'
        },
        {
          value: 2,
          label: 'B'
        },
        {
          value: 3,
          label: 'C'
        },
        {
          value: 4,
          label: 'D'
        }],
      selectValue: '',
      // 管理员聊天
      messageInfo: '',
      wsuri: 'ws://8.129.64.22:2829/webSocket/chat',
      // wsuri: 'ws://192.168.1.11:2829/webSocket/chat',
      code: '',
      userName: '',
      adminPhone: ''
    };
  },
  created() {
    this.onLoad(this.page)
    this.userAccount = getStore({name: 'userInfo'}).account;
    this.adminPhone = getStore({name: 'userInfo'}).account;
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
    if (this.data.websock !== null) {
      // 聊天定位到底部
      let ele = document.getElementById('chatRecord');
      ele.scrollTop = ele.scrollHeight;
    }
  },
  methods: {
    uploadSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.$message({
          message: response.msg,
          type: 'success'
        });
        this.showLoading()
        // 获取历史聊天记录
        getHistoryMessage({
          current: this.historyPage.currentPage,
          size: this.historyPage.pageSize,
          studioId: this.studioId
        }).then(res => {
          if (res.data.code === 200) {
            this.hideLoading()
            const data = res.data.data;
            this.infoData = data.records;
            console.log(this.infoData);
          }
        }).catch(err => {
          this.hideLoading()
          console.log(err)
        })
        this.$refs['img'].forEach((item) => {
          item.clearFiles();
        })
        // this.$refs['img'][0].clearFiles();
      } else {
        this.$message({
          message: response.msg,
          type: 'error'
        });
        this.$refs['img'].forEach((item) => {
          item.clearFiles();
        })
      }
    },
    uploadFalse(response, file, fileList) {
      this.$message({
        message: '文件上传失败！',
        type: 'error'
      });
    },
    showLoading() {
      this.$loading({
        lock: true,
        text: '数据请求中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.3)'
      });
    },
    hideLoading() {
      this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.3)'
      }).close();
    },
    //初始化weosocket
    initWebSocket(wsuri) { //初始化weosocket
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen(e) { //连接建立之后执行send方法发送数据
      // this.websocketonmessage()
    },
    websocketonerror() {//连接建立失败重连
      // this.initWebSocket();
    },
    websocketonmessage(e) { //数据接收
      const redata = JSON.parse(e.data);
      if (redata.msg == "offline") {
        // 获取用户信息
        getUserMessage(this.studioIds)
          .then(res => {
            if (res.data.code === 200) {
              console.log('asd')
              this.useData = res.data.data;
              this.showUserMessage = true;
              this.$forceUpdate();
            }
          }).catch(err => {
          console.log(err);
        })
        this.infoData = [...this.infoData];
      } else if (redata.msg == "logged") {
        // 获取用户信息
        getUserMessage(this.studioIds)
          .then(res => {
            if (res.data.code === 200) {
              console.log('123')
              this.useData = res.data.data;
              this.showUserMessage = true;
              this.$forceUpdate();

            }
          }).catch(err => {
          console.log(err);
        })
        this.infoData = [...this.infoData];
      } else {
        let data = [
          ...this.infoData,
          {
            msg: redata.msg,
            sendTime: redata.sendTime,
            name: redata.username,
            type: redata.type
          }
        ];
        console.log(redata, data);
        this.infoData = deleteObject(data);
        console.log(this.infoData);
      }


    },
    websocketsend() {//数据发送
      if (this.messageInfo === '') {
        this.$message.error('请输入内容')
        return
      } else {
        this.websock.send(`simple:${this.messageInfo}`)
        this.messageInfo = '';
      }
    },
    websockSendMessage() {
      if (this.messageInfo === '') {
        this.$message.error('请输入内容')
        return
      } else {
        this.$notify({
          title: '强提醒消息',
          message: `您发送了一条强提醒消息，消息内容为: ${this.messageInfo}`,
          duration: 2000,
          type: 'success'
        });
        this.websock.send(`complex:${this.messageInfo}`)
        this.messageInfo = '';
      }
    },
    websocketclose(e) {  //关闭
      localStorage.removeItem('info')
    },
    checkTim(id, idx) {
      this.studioId = id
      this.index = idx;
      this.initWebSocket(`${this.wsuri}/${id}/${this.userAccount}`)
      this.showTim = true;
      this.showLoading()
      // 获取历史聊天记录
      getHistoryMessage({
        current: this.historyPage.currentPage,
        size: this.historyPage.pageSize,
        studioId: id
      }).then(res => {
        if (res.data.code === 200) {
          this.hideLoading()
          const data = res.data.data;
          this.infoData = data.records;
          console.log(this.infoData);
        }
      }).catch(err => {
        this.hideLoading()
        console.log(err)
      })
    },
    handleClick(tab) {
      this.data.forEach(item => {
        if (item.studioIds === tab.name) {
          this.studioIds = item.studioIds;
          this.showTim = false;
          this.index = null;
          this.showLoading()
          // 获取用户信息
          getUserMessage(item.studioIds)
            .then(res => {
              if (res.data.code === 200) {
                this.hideLoading();
                this.courseInfo = item;
                this.useData = res.data.data;
                this.code = item.code;
                this.showUserMessage = true;
              }
            }).catch(err => {
            this.hideLoading();
            console.log(err);
          })
        }
        this.infoData = []
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
      getListPage(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data;
        this.loading = false;
      });
    },
    setYi(id) {
      this.showYiModal = true;
      this.selectUserId = id;
    },
    // 设置意向度
    selectOpt(value) {
      let data = {
        id: this.selectUserId,
        intention: value
      }
      this.showLoading();
      setUserIntention(data)
        .then(res => {
          if (res.data.code === 200) {
            this.hideLoading()
            this.$message.success('设置成功')
            this.showYiModal = false;
          } else {
            this.$message.warning(res.data.msg)
          }
        }).catch(err => {
        this.hideLoading()
        console.log(err);
      })
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
  cursor: pointer;
}

.item-info-1 {
  display: flex;
  align-items: center;
  justify-content: space-around;
  cursor: pointer;
  flex-direction: column;

}

.item-info-1 span {
  margin-bottom: 8px;
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
  border: 1px solid !important;
}

.tab {
  height: 100% !important;
}

.hover {
  color: red;
}
</style>
