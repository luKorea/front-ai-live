<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.studio_delete"
                   @click="handleDelete">删 除
        </el-button>
        <el-button type="primary"
                   size="small"
                   icon="el-icon-user"
                   v-if="permission.studio_open"
                   @click="handleOpenStudio">开通直播
        </el-button>
        <el-button type="primary"
                   size="small"
                   icon="el-icon-user"
                   v-if="permission.studio_student"
                   @click="handleAddStudent">追加学员
        </el-button>
      </template>
    </avue-crud>

    <!-- 开通直播 -->
    <el-dialog title="开通直播"
               :visible.sync="showStudio"
               :close-on-click-modal="false"
               :destroy-on-close="true"
               width="50%">
      <el-form label-width="80px" :model="studioSearch">
        <el-form-item label="筛选">
          <el-input v-model="studioSearch.value" class="m-right"
                    style="width: 250px"/>
          <el-date-picker
            class="m-right"
            v-model="studioSearch.time"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"/>
          <el-button type="primary" @click="searchStudio" icon="el-icon-search">
            查询
          </el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="20">
        <el-col span="10" offset="1">
          <el-tag style="margin-bottom: 10px">课程类别</el-tag>
          <el-tree
            :data="treeData"
            :props="defaultProps"
            ref="tree"
            node-key="id"
            default-expand-all
            @node-click="handleTree"
          />
          <div>
            <el-tag style="margin-bottom: 10px">课程直播时间</el-tag>
          </div>
          <el-cascader :options="selectData" v-model="
          activeName === 'first' ? signStudio.selectCourse : moreStudio.selectCourse"/>
        </el-col>
        <el-col span="12">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <!--TODO 生成个人直播间 -->
            <el-tab-pane label="生成个人直播间" name="first">
              <el-form v-model="signStudio">
                <el-form-item label="手机号码" prop="phone">
                  <el-input v-model="signStudio.phone"/>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitStudio(1)">生成链接</el-button>
                </el-form-item>
                <el-form-item label="上课地址">
                  <el-input v-model="signStudio.url" type="textarea" disabled/>
                </el-form-item>
                <el-form-item>
                  <el-button
                    class="tag-read"
                    :data-clipboard-text="signStudio.url"
                    @click="copySign">复制地址
                  </el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!--TODO 生成多人直播间 -->
            <el-tab-pane label="生成多人直播间" name="second">
              <el-form v-model="moreStudio">
                <el-form-item label="手机号码" prop="phone">
                  <el-input v-model="moreStudio.phone" type="textarea"
                            :rows="6"/>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitStudio(2)">生成链接</el-button>
                </el-form-item>
                <el-form-item label="上课地址">
                  <el-input v-model="moreStudio.url" type="textarea" disabled/>
                </el-form-item>
                <el-form-item>
                  <el-button
                    class="tag-more"
                    :data-clipboard-text="moreStudio.url"
                    @click="copyMore">复制地址
                  </el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="showStudio = false">取消</el-button>
        <el-button type="primary" @click="showStudio = false">确 定</el-button>
      </div>
    </el-dialog>


    <!--  追加学员  -->
    <el-dialog title="添加学员"
               :visible.sync="showAddStudent"
               :close-on-click-modal="false"
               :destroy-on-close="true"
               width="50%">
      <el-form label-width="80px" :model="studentInfo">
        <el-form-item label="课程名称">
          <el-input v-model="studentInfo.courseTitle" disabled/>
        </el-form-item>
        <el-button type="primary" @click="submitStudent">确 定</el-button>
      </el-form>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  getList,
  getDetail,
  add,
  update,
  remove,
  getTree, getTreeChildren
} from "@/api/studio/studio";
import {mapGetters} from "vuex";
import Clipboard from 'clipboard';

export default {
  data() {
    return {
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        viewBtn: true,
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: "直播间ID",
            prop: "courseId",
            search: true,
            rules: [{
              required: true,
              message: "请输入课程id",
              trigger: "blur"
            }]
          },
          {
            label: "视频地址",
            prop: "scheduleId",
            rules: [{
              required: true,
              message: "请输入直播时间",
              trigger: "blur"
            }]
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
      showAddStudent: false,
      studentInfo: {},
      showStudio: false,
      studioSearch: {
        value: '',
        time: '',
      },
      activeName: 'first',
      signStudio: {
        phone: null,
        selectCourse: '',
        url: 'https://share.plvideo.cn/front/video/preview?vid=27379d4a88949fbda3c153a44411f1f4_2'
      },
      moreStudio: {
        phone: null,
        selectCourse: '',
        url: 'https://share.plvideo.cn/front/video/preview?vid=27379d4a88949fbda3c153a44411f1f4_2'
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dynamicTags: [],
      selectData: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.studio_add, false),
        viewBtn: this.vaildData(this.permission.studio_view, false),
        delBtn: this.vaildData(this.permission.studio_delete, false),
        editBtn: this.vaildData(this.permission.studio_edit, false),
        openStudioBtn: this.vaildData(this.permission.studio_open, false),
        addStudentBtn: this.vaildData(this.permission.studio_student, false)
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
  mounted() {
    this.getTreeData()
  },
  methods: {
    getTreeData() {
      getTree()
        .then(res => {
          if (res.data.code === 200) {
            this.treeData = res.data.data;
          }
        }).catch(err => console.log(err))
    },
    rowSave(row, done, loading) {
      add(row).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        done();
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowUpdate(row, index, done, loading) {
      update(row).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        done();
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getDetail(this.form.id).then(res => {
          this.form = res.data.data;
        });
      }
      done();
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
    // TODO 开通直播间
    handleOpenStudio() {
      this.formatTree(this.treeData)
      this.showStudio = true;
    },
    formatTree(data) {
      data.map((item) => {
        if(!item.children || item.children.length === 0) {
          this.dynamicTags.push(item.label)
        } else {
          this.formatTree(item.children)
        }
        console.log(this.dynamicTags);
      })
    },
    copySign() {
      const clipboard = new Clipboard('.tag-read')
      clipboard.on('success', _ => {
        this.$message({
          type: "success",
          message: '复制成功'
        })
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        this.$message({
          type: "error",
          message: '该浏览器不支持自动复制'
        })
        // 释放内存
        clipboard.destroy()
      })
    },
    copyMore() {
      const clipboard = new Clipboard('.tag-more')
      clipboard.on('success', _ => {
        this.$message({
          type: "success",
          message: '复制成功'
        })
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        this.$message({
          type: "error",
          message: '该浏览器不支持自动复制'
        })
        // 释放内存
        clipboard.destroy()
      })
    },
    searchStudio() {
      console.log(this.studioSearch);
    },
    handleTree(data) {
      this.dynamicTags.forEach(item => {
        if (data.label === item) {
          getTreeChildren(data.id)
          .then(res => {
            if (res.data.code === 200) {
              this.selectData = res.data.data;
            }
          }).catch(err => console.log(err))
        }
      })
    },

    submitStudio(type) {
      if (type === 1) {
        let {phone} = this.signStudio;
        let newPhone = [phone];
        this.signStudio = {
          ...this.signStudio,
          phone: newPhone
        }
        console.log(this.signStudio);
      } else {
        let {phone} = this.moreStudio;
        if (phone === null) {
          this.$message.error('请输入手机号码')
          return
        }
        let newPhone = phone.split(/[\s\n]/);
        this.moreStudio = {
          ...this.moreStudio,
          phone: newPhone
        }
        console.log(newPhone);
        console.log(this.moreStudio);
      }
    },
    // TODO 追加学员
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleAddStudent() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      } else if (this.selectionList.length > 1) {
        this.$message.warning("最多只能同时选择一条");
        return;
      }
      this.showAddStudent = true;
      this.studentInfo = this.selectionList[0] || {};
    },
    submitStudent() {
      console.log(this.studentInfo);
    },
  }
};
</script>

<style>
</style>
