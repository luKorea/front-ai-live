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
        <el-button type="primary"
                   size="small"
                   v-if="permission.course_opt"
                   icon="el-icon-document-add"
                   @click="handleCourse">排课管理
        </el-button>
        <el-button type="primary"
                   size="small"
                   v-if="permission.course_speechcraft"
                   icon="el-icon-edit-outline"
                   @click="handleSpeechcraft">话术管理
        </el-button>
        <el-button type="primary"
                   size="small"
                   v-if="permission.course_deblocking"
                   @click="handleDeblocking">解锁
        </el-button>
        <el-button type="primary"
                   size="small"
                   v-if="permission.course_lock"
                   @click="handleLock">锁定
        </el-button>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   v-if="permission.course_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
    <!--  排课管理  -->
    <el-dialog title="排课管理"
               :visible.sync="showCourse"
               :close-on-click-modal="false"
               width="50%">
      <el-form label-width="80px" :model="courseInfo">
        <el-form-item label="课程名称">
          <el-input v-model="courseInfo.courseTitle" disabled/>
        </el-form-item>
        <el-form-item label="课程类别">
          <el-input v-model="courseInfo.courseTypeName" disabled/>
        </el-form-item>
        <el-form-item label="直播ID">
          <el-input v-model="courseInfo.studioIds" disabled/>
        </el-form-item>
        <el-form-item label="课表时间" required>
          <el-date-picker
            class="m-right"
            v-model="courseInfo.day"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"/>
          <el-time-picker
            class="m-right"
            v-model="courseInfo.startTime"
            placeholder="选择时间点"
            format="HH 时 MM 分"
            value-format="HH:MM"
          />
          <el-button type="primary" @click="submitCourse">确 定</el-button>
        </el-form-item>
      </el-form>
      <el-divider/>

      <avue-crud :option="courseOption"
                 :table-loading="loading"
                 :data="tableData"
                 :page.sync="coursePage"
                 @row-del="delCourse"
                 @selection-change="selectionChange1"
                 @current-change="currentChange1"
                 @size-change="sizeChange1"
                 class="course-opt"
                >
      </avue-crud>
    </el-dialog>
    <!--  话术管理  -->
    <el-dialog title="话术管理"
               :visible.sync="showSpeechcraft"
               :close-on-click-modal="false"
               :destroy-on-close="true"
               width="50%">
      <el-form label-width="120px" :model="speechcraftInfo">
        <el-form-item label="课程名称">
          <el-input v-model="speechcraftInfo.courseTitle" disabled/>
        </el-form-item>
        <el-form-item label="课程类别">
          <el-input v-model="speechcraftInfo.courseTypeName" disabled/>
        </el-form-item>
        <el-form-item label="直播ID">
          <el-input v-model="speechcraftInfo.studioIds" disabled/>
        </el-form-item>
        <el-form-item label="话术插入时间" required>
          <el-time-picker
            class="m-right"
            v-model="speechcraftInfo.courseTime"
            placeholder="选择时间点"
            format="HH 时 MM 分"
            value-format="HH:MM:SS"
          />
        </el-form-item>
        <el-form-item label="话术内容" required>
          <el-input type="textarea" v-model="speechcraftInfo.content" />
        </el-form-item>
        <el-button type="primary" class="m-right" @click="submitSpeechcraft">导入</el-button>
        <el-button type="primary" class="m-right" @click="submitSpeechcraft">导出</el-button>
        <el-button type="primary" @click="submitSpeechcraft">确 定</el-button>
      </el-form>
      <el-divider/>
      <avue-crud :option="speechcraftOption"
                 :table-loading="loading"
                 :data="speechcraftData"
                 :page.sync="speechcraftPage"
                 @row-del="speechcraftDelete"
                 @selection-change="speechcraftSelectionChange"
                 @current-change="speechcraftCurrentChange"
                 @size-change="speechcraftSizeChange"
                 class="course-opt"
      >
      </avue-crud>
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
  courseEdit,
  getCourseEdit
} from "@/api/course/course";
import {mapGetters} from "vuex";

export default {
  data() {
    return {
      form: {},
      query: {},
      loading: true,
      data: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      option: {
        tip: false,
        border: true,
        index: true,
        viewBtn: true,
        selection: true,
        dialogClickModal: false,
        column: [
          // TODO 获取课程类别
          {
            label: "课程类别",
            prop: "courseTypeName",
            type: 'tree',
            dicUrl: "/api/blade-courseType/tree",
            rules: [{
              required: true,
              message: "请输入课程类别id",
              trigger: "blur"
            }],
            span: 24
          },
          {
            label: "课程名称",
            prop: "courseTitle",
            search: true,
            rules: [{
              required: true,
              message: "请输入课程名称",
              trigger: "blur"
            }],
            span: 24
          },
          {
            label: '课程视频',
            type: 'upload',
            accept: "video/mp4",
            limit: 1,
            menu: false,
            loadText: '附件上传中，请稍等',
            drag: true,
            propsHttp: {
              res: 'data'
            },
            action: '/api/blade-course/fileUpload',
            span: 24,
            row: true,
            prop: 'vid'
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
            label:"课程表时间",
            prop:"datetime",
            display: false
          },
        ]
      },
      selectionList: [],
      // 话术管理
      showSpeechcraft: false,
      speechcraftInfo: {},
      speechcraftPage: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      speechcraftOption: {
        column: [
          {
            label: '序号',
            prop: 'id',
            display: false
          },
          {
            label:"日期",
            prop:"day",
            display: false
          },
          {
            label:"话术内容",
            prop:"startTime",
            display: false
          },
        ]
      },
      speechcraftData: [],
      // 排课管理
      showCourse: false,
      courseInfo: {},
      courseOption: {
        column: [
          {
            label: '序号',
            prop: 'id',
            display: false
          },
          {
            label:"日期",
            prop:"day",
            display: false
          },
          {
            label:"开播时间",
            prop:"startTime",
            display: false
          },
        ]
      },
      coursePage: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      tableData: [],
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.course_add, false),
        viewBtn: this.vaildData(this.permission.course_view, false),
        delBtn: this.vaildData(this.permission.course_delete, false),
        editBtn: this.vaildData(this.permission.course_edit, false),
        optBtn: this.vaildData(this.permission.course_opt, false),
        speechcraftBtn: this.vaildData(this.permission.course_speechcraft, false),
        deblockingBtn: this.vaildData(this.permission.course_deblocking, false),
        lockBtn: this.vaildData(this.permission.course_lock, false)
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
    rowSave(row, done, loading) {
      let {courseTypeName, vid, courseTitle, isEnable, isReal} = row;
      let courseTypeId = courseTypeName,
        video = null;
      vid.forEach(item => video = item.value)
      console.log(courseTypeId);
      add({
        courseTitle, courseTypeId, vid: video, isEnable, isReal
      }).then(() => {
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

    // 课程列表
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
    //  TODO 排课管理
    currentChange1(currentPage) {
      this.coursePage.currentPage = currentPage;
    },
    sizeChange1(pageSize) {
      this.coursePage.pageSize = pageSize;
    },
    selectionChange1(list) {
      this.selectionList = list;
    },
    onLoadCourse(courseId) {
      this.loading = true;
      getCourseEdit(courseId).then(res => {
        const data = res.data.data;
        this.coursePage.total = data.total;
        this.tableData = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },
    delCourse(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          // this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    handleCourse() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      } else if (this.selectionList.length > 1) {
        this.$message.warning("最多只能同时选择一条");
        return;
      }
      this.showCourse = true;
      this.courseInfo = this.selectionList[0] || {};
      console.log(this.courseInfo);
      this.onLoadCourse(this.courseInfo.id);
    },
    submitCourse() {
      const data = {
        startTime: this.courseInfo.startTime,
        courseId: this.courseInfo.id,
        day: this.courseInfo.day
      }
      courseEdit(data)
      .then(res => {
        if (res.data.code === 200) {
          this.$message.success('操作成功')
          this.onLoadCourse(this.courseInfo.id)
        }
      }).catch(err => {
        console.log(err);
      })
    },
    courseDelete(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log(row);
        })
    },
    // TODO 话术管理
    speechcraftCurrentChange(currentPage) {
      this.speechcraftPage.currentPage = currentPage;
    },
    speechcraftSizeChange(pageSize) {
      this.speechcraftPage.pageSize = pageSize;
    },
    speechcraftSelectionChange(list) {
      this.selectionList = list;
    },
    onLoadSpeechcraft(courseId) {
      this.loading = true;
      getCourseEdit(courseId).then(res => {
        const data = res.data.data;
        this.speechcraftPage.total = data.total;
        this.speechcraftData = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },
    speechcraftDelete(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          // this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },

    handleSpeechcraft() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      } else if (this.selectionList.length > 1) {
        this.$message.warning("最多只能同时选择一条");
        return;
      }
      this.showSpeechcraft = true;
      this.speechcraftInfo = this.selectionList[0] || {};
      this.onLoadSpeechcraft(this.speechcraftInfo.id);
    },
    submitSpeechcraft() {
      console.log(this.speechcraftInfo);
    },
    // TODO 解锁，锁定
    handleDeblocking() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      } else if (this.selectionList.length > 1) {
        this.$message.warning("最多只能同时选择一条");
        return;
      }
      this.$confirm(" 您即将为选中课程进行解锁, 解锁后课程可进行正常播放", {
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
    handleLock() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      } else if (this.selectionList.length > 1) {
        this.$message.warning("最多只能同时选择一条");
        return;
      }
      this.$confirm("您选中的课程即将被锁定!锁定后课程无法进行播放", {
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
    }
  }
};
</script>

<style>
.course-opt .avue-crud__menu {
  display: none;
}
</style>
