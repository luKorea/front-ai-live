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
          <!--聊天记录-->
          <el-col :span="24" v-show="showTim">
            <el-col>
              <el-card class="box-card message-info" shadow="never"
                       style="height: 100%;overflow: auto">
                <div slot="header" class="clearfix">
                  <span>聊天记录</span>
                </div>
                <div style="height: 600px; overflow: auto" ref="msgBox" id="chatRecord">
                  <div v-for="info in infoData" :key='info.id'
                       class="text item item-info">
                    <span>{{ info.username }}</span>
                    <span>{{ info.message }}</span>
                    <span style="margin-right: 20px">{{ info.time }}</span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  getHistoryMessage, getLiveHistoryMessage,
  getLivePage,
  getUserMessage,
  setUserIntention
} from "@/api/studio/studio";
import {getStore} from "@/util/store";
import {deleteObject} from "@/util/util";

export default {
  data() {
    return {

      studioId:'',
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
      selectValue: '',
      code: '',
      userName: '',
      adminPhone: '',
      inter: null,
    };
  },
  created() {
    this.onLoad(this.page)
    this.userAccount = getStore({name: 'userInfo'}).account;
    console.log(this.userAccount)
  },
  destroyed() {
    this.inter = clearInterval(this.inter);
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
  updated(){
    // if (this.data.websock !== null) {
    //   // 聊天定位到底部
    //   let ele = document.getElementById('chatRecord');
    //   ele.scrollTop = ele.scrollHeight;
    // }
  },
  methods: {
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
    handleClick(tab) {
      this.inter = clearInterval(this.inter);
      this.data.forEach(item => {
        if (item.studioIds === tab.name) {
          this.index = null;
          this.showTim = true;
          this.showUserMessage = true;
          this.getHistoryData(item.studioIds);
          this.inter = setInterval(() => {
            this.getHistoryData(item.studioIds);
          }, 2000)
        }
        this.infoData = []
      })
    },
    // 获取直播历史聊天记录
    getHistoryData(studioIds) {
      getLiveHistoryMessage(studioIds).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data;
          this.infoData = data;
        }
      }).catch(err => {
        console.log(err)
      })
    },
    onLoad(page, params = {}) {
      this.loading = true;
      getLivePage(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data;
        this.loading = false;
      });
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
  flex-direction:column;

}
.item-info-1 span{
  margin-bottom:8px;
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
