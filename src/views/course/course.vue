<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               @current-change="currentChange"
               @size-change="sizeChange"
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
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="primary"
                   size="small"
                   v-if="permission.course_add"
                   icon="el-icon-document-add"
                   @click="handleAddCourse">新增
        </el-button>
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
                   @click="handleLocking(0)">解锁
        </el-button>
        <el-button type="primary"
                   size="small"
                   v-if="permission.course_lock"
                   @click="handleLocking(1)">锁定
        </el-button>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   v-if="permission.course_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
    <!--  新增课程  -->
    <el-dialog title="新增课程"
               :visible="addCourse"
               :before-close="handelBeforeClose"
               :close-on-click-modal="false"
               @close="closeAddCourse"
               width="50%">
      <el-form label-width="80px" :model="addCourseInfo">
        <el-form-item label="上级课程" required>
          <el-tree
            :data="treeData"
            :props="treeOption"
            :highlight-current="true"
            @node-click="nodeClick"/>
        </el-form-item>
        <el-form-item label="课程名称" required>
          <el-input v-model="addCourseInfo.courseTitle"/>
        </el-form-item>
        <el-form-item label="视频上传" v-if="addCourseInfo.isReal === 2">
          <el-upload action="" :http-request="changeData" ref="uploadCourse">
            <el-button class="btn upload-btn">上传附件</el-button>
          </el-upload>
          <el-progress :percentage="progressPercent" v-show="showProcess"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课程状态" required>
              <el-radio v-model="addCourseInfo.isLocking" :label="0">解锁
              </el-radio>
              <el-radio v-model="addCourseInfo.isLocking" :label="1">锁定
              </el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否直播" required>
              <el-radio v-model="addCourseInfo.isReal" :label="1">直播</el-radio>
              <el-radio v-model="addCourseInfo.isReal" :label="2">录播</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button type="primary" @click="addCourseSubmit" :disabled="btnEdit && addCourseInfo.isReal === 2">确
          定
        </el-button>
      </el-form>
    </el-dialog>
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
        <el-form-item label="视频时长">
          <el-input v-model="courseDuration" disabled/>
        </el-form-item>
        <el-form-item label="课表时间" required>
          <el-date-picker
            class="m-right"
            v-model="courseInfo.day"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"/>
          <el-time-picker
            class="m-right"
            v-model="courseInfo.startTime"
            placeholder="选择时间点"
            value-format="HH:mm"
          />
          <el-button type="primary" @click="submitCourse">确 定</el-button>
        </el-form-item>
      </el-form>
      <el-divider/>

      <avue-crud :option="courseOption"
                 :table-loading="loading"
                 :data="tableData"
                 @row-del="courseDelete"
                 class="course-opt"
                 style="height: 300px; overflow: auto"
      >
      </avue-crud>
    </el-dialog>
    <!--  话术管理  -->
    <el-dialog title="话术管理"
               :visible.sync="showSpeechcraft"
               :close-on-click-modal="false"
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
            v-model="speechcraftInfo.time"
            placeholder="选择时间点"
            value-format="HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="话术内容" required>
          <el-row :gutter="6">
            <el-col :span="16">
              <el-input type="textarea"
                        v-model="speechcraftInfo.verbalContent"/>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="submitSpeechcraft">确 定
              </el-button>
            </el-col>
          </el-row>

        </el-form-item>
      </el-form>
      <el-divider/>
      <avue-crud :option="speechcraftOption"
                 :table-loading="loading"
                 :data="speechcraftData"
                 @row-del="speechcraftDelete"
                 @selection-change="selectionChangeSpeech"
                 :page.sync="speechcraftPage"
                 @current-change="speechcraftCurrentChange"
                 @size-change="speechcraftSizeChange"
      >
        <template slot="menuLeft">
          <el-upload
            class="filter-item"
            style="display: inline-block"
            :action="'/api/blade-words/import'"
            :on-error="uploadFalse"
            :on-success="uploadSuccess"
            ref="upload"
            :data='{
              courseId: this.speechcraftInfo.id
            }'
            name="filename"
            :limit="1"
            :show-file-list="false"
            >
            <el-button  size="small" style="margin-left: 10px;" icon="el-icon-edit" type="primary">导入</el-button>
          </el-upload>
          <el-button type="primary" size="small" icon="el-icon-upload2"
                     @click="downFile">下载模板
          </el-button>
          <el-button type="danger" size="small" icon="el-icon-delete"
                     @click="handleDeleteSpeech(speechcraftInfo.id)">一键删除
          </el-button>
<!--          <el-button type="danger" size="small" icon="el-icon-delete"-->
<!--                     @click="handleDeleteSpeech">批量删除-->
<!--          </el-button>-->
          <!--          <upload-excel></upload-excel>-->
        </template>
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
  getCourseEdit,
  removeCourse,
  lockCourse,
  speechcraftData,
  speechcraftEdit,
  removeSpeechcraft, getTreeData, sendExcel, removeMore
} from "@/api/course/course";
import {mapGetters} from "vuex";
import {formatSeconds} from "@/util/date";
import PlvVideoUpload from '@polyv/vod-upload-js-sdk';
import md5 from 'md5';
import {downloadFile, throttle} from "@/util/util";

export default {
  data() {
    return {
      addCourse: false,
      addCourseInfo: {
        isReal: 2,
      },
      courseTypeId: '',
      showProcess: false,
      progressPercent: 0,
      videoUpload: null,
      btnEdit: true,
      treeData: [],
      treeOption: {
        nodeKey: 'id',
        props: {
          labelText: '标题',
          label: 'label',
          value: 'value',
          children: 'children'
        }
      },
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
        addBtn: false,
        viewBtn: true,
        selection: true,
        editBtn: false,
        dialogClickModal: false,
        dialogHeight: 500,
        align: 'center',
        column: [
          // TODO 获取课程类别
          {
            label: 'ID',
            prop: 'id',
            display: false
          },
          {
            label: '频道号',
            prop: 'channelId',
            display: false
          },
          {
            label: "课程类别",
            prop: "courseTypeName",
            type: 'tree',
            dicUrl: "/api/blade-courseType/tree",
            rules: [{
              required: true,
              message: "请输入课程类别",
              trigger: "blur"
            }],
            span: 24,
            tip: '如果只有一级，请选择一级类别，如果一级下有对应的二级课程，选择对应的一级课程新增课程无效！'
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
            drag: true,
            hide: true,

            rules: [{
              required: true,
              message: "请上传课程视频",
              trigger: "blur"
            }],
            propsHttp: {
              res: 'data'
            },
            action: '/api/blade-course/fileUpload',
            span: 24,
            row: true,
            prop: 'vid'
          },
          {
            label: "课程状态",
            prop: "isLocking",
            type: 'radio',
            hide: true,
            dicData: [{
              label: '解锁',
              value: 0
            }, {
              label: '锁定',
              value: 1
            }],
            rules: [{
              required: true,
              trigger: "blur",
              message: "请选择课程状态",
            }]
          },
          {
            label: "是否直播",
            prop: "isReal",
            type: 'radio',
            valueDefault: 2,
            dicData: [
              {
                label: '录播',
                value: 2

              }, {
                label: '直播',
                value: 1
              }],
            rules: [{
              required: true,
              trigger: "blur",
              message: '请选中课程类型'
            }]
          },
          {
            label: '课程状态',
            prop: 'isLockingName',
            display: false,
            type: 'select',
            search: true,
            dicData: [
              {
                label: '正常',
                value: 0
              }, {
                label: '已锁定',
                value: 1
              }
            ]
          },
          {
            label: '直播间ID',
            prop: 'studioIds',
            display: false,
            hide: true
          },
          {
            label: "直播时间",
            prop: "datetime",
            display: false
          },
        ]
      },
      selectionList: [],
      // 话术管理
      showSpeechcraft: false,
      speechcraftInfo: {},
      speechcraftPage: {
        pageSizes: [10, 100, 200, 300, 400, 500],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      speechcraftOption: {
        editBtn: false,
        addBtn: false,
        align: 'center',
        excelBtn: true,
        selection: false,
        column: [
          {
            label: '序号',
            prop: 'id'
          },
          {
            label: "时间",
            prop: "time"
          },
          {
            label: "话术内容",
            prop: "verbalContent"
          },
        ]
      },
      speechcraftData: [],
      // 排课管理
      showCourse: false,
      courseInfo: {},
      courseOption: {
        menu: false,
        align: 'center',
        column: [
          {
            label: '序号',
            prop: 'id'
          },
          {
            label: "日期",
            prop: "day"
          },
          {
            label: "开播时间",
            prop: "startTime"
          },
        ]
      },
      coursePage: {
        pageSize: 1000,
        currentPage: 1,
        total: 0
      },
      tableData: [],
      courseDuration: ''
    };
  },
  created() {
    this.videoUpload = new PlvVideoUpload({
      events: {
        Error: (err) => {
          console.info(err);  // 错误事件回调
          if (err.code) {
            // 110：文件重复，111：拦截文件类型不在acceptedMimeType中的文件，102：用户剩余空间不足
            let errMag = `（错误代码：${err.code}）${err.message}`;
            if (err.code === 110 || err.code === 111) {
              errMag += ` ${err.data.filename}`;
            }
            this.$message.error(errMag)
            this.showProcess = false;
          } else {
            console.info(err);
          }
        },
        UploadComplete: (e) => {
          console.log(e);
        }  // 全部上传任务完成回调
      }
    });
    let pTime = new Date().getTime(),
      secretkey = '0Q9vOv8o8R',
      writeToken = '35bb3fde-f366-4dda-b2cc-4d2d5d011acf';
    this.videoUpload.updateUserData({
      userid: 'e896da440d', // Polyv云点播账号的ID
      ptime: pTime,
      sign: md5(`${secretkey}${pTime}`),
      hash: md5(`${pTime}${writeToken}`)
    })
    console.log(this.videoUpload);
    setInterval(() => {
      console.log('获取新的值');
      let pTime = new Date().getTime();
        this.videoUpload.updateUserData({
        userid: 'e896da440d', // Polyv云点播账号的ID
        ptime: pTime,
        sign: md5(`${secretkey}${pTime}`),
        hash: md5(`${pTime}${writeToken}`)
      })
      console.log(this.videoUpload);
    }, 3 * 60 * 1000);
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
    handelBeforeClose() {
      this.addCourse = false;
      this.addCourseInfo = {};
    },
    downFile() {
      downloadFile();
    },
    uploadSuccess(response, file, fileList) {
      if (response.code===200) {
        this.$message({
          message: response.msg,
          type: 'success'
        });
        this.$refs.upload.clearFiles(); //上传成功之后清除历史记录
        this.onLoadSpeechcraft(this.speechcraftInfo.id, this.speechcraftPage.currentPage, this.speechcraftPage.pageSize);
      } else {
        this.$message({
          message: response.msg,
          type: 'error'
        });
        this.$refs.upload.clearFiles(); //上传成功之后清除历史记录
        this.onLoadSpeechcraft(this.speechcraftInfo.id, this.speechcraftPage.currentPage, this.speechcraftPage.pageSize);
      }
    },
    uploadFalse(response, file, fileList) {
      this.$message({
        message: '文件上传失败！',
        type: 'error'
      });
    },
    //上传文件
    uploadExcel(file, fileList){
      console.log(this.courseTypeId);
      console.log(file);
      sendExcel({
        file,
        courseId: this.speechcraftInfo.courseTypeId
      }).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
    },
    handleAddCourse() {
      this.addCourse = true;
      getTreeData()
        .then(res => {
          this.treeData = res.data.data;
        }).catch(err => console.log(err))
    },
    FileStarted({ uploaderid, fileData }) { // 文件开始上传回调
      console.log(uploaderid, fileData);
      this.$message({
        type: "info"  ,
        message: '上传课程时，需要待【确定】按钮亮起时，点击保存才能成功，请耐心等待【确定】按钮高亮',
        duration: 6000
      })
      this.showProcess = true;
    },
    FileProgress (uploadInfo) { // 文件上传过程返回上传进度信息回调
      this.progressPercent = Math.floor((uploadInfo.progress * 100).toFixed(2))
    },
    FileStopped (uploadInfo) { // 文件暂停上传回调
      console.log("文件上传停止: " + uploadInfo.fileData.title);
    },
    FileSucceed (uploadInfo) { // 文件上传成功回调
      console.log(uploadInfo);
      this.addCourseInfo.vid = uploadInfo.fileData.vid;
      this.addCourseInfo.videoTitle = uploadInfo.fileData.filename;
      // _that.showProcess = false;
      this.btnEdit = false;
    },
    FileFailed (uploadInfo) { // 文件上传失败回调
      console.log(uploadInfo);
      this.showProcess = false;
    },
    // 文件上传
    changeData(file, fileList) {
      console.log(1);
      console.log(file);
      const _that = this;
      const uploader = this.videoUpload.addFile(
        file.file, // file 为待上传的文件对象
        {
          FileStarted: this.FileStarted,
          FileProgress: this.FileProgress,
          FileStopped: this.FileStopped,
          FileSucceed: this.FileSucceed,
          FileFailed: this.FileFailed
        },
        {
          desc: 'demo中设置的描述',
          cataid: 1,
          tag: 'demo中设置的标签',
          luping: 0,
          keepsource: 0,
          title: _that.addCourseInfo.courseTitle
        }
      );
      if (!uploader) return;
      const uploaderid = uploader.id;
      console.log(uploaderid);
      if (uploaderid) {
        this.videoUpload.resumeFile(uploaderid);
      }
    },
    closeAddCourse() {
      this.btnEdit = true;
      this.showProcess = false;
      this.$refs.uploadCourse.clearFiles();
      this.addCourseInfo = {};
      this.addCourseInfo.isReal = 2;
      this.progressPercent = 0;
      this.videoUpload.clearAll();
    },
    nodeClick(e) {
      this.addCourseInfo.courseTypeId = e.id;
    },
    addCourseSubmit() {
      this.showLoading();
      add({
        ...this.addCourseInfo
      }).then(() => {
        this.hideLoading();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.loading = false;
        this.addCourse = false;
      }, error => {
        this.hideLoading();
        window.console.log(error);
      });
    },
    rowSave(row, done, loading) {
      console.log(row);
      let {courseTypeName, vid, courseTitle, isEnable, isReal} = row;
      console.log(vid);
      let courseTypeId = courseTypeName,
        video = null,
        duration = null;
      vid.forEach(item => {
        video = item.label;
        duration = item.value;
      })
      console.log(courseTypeId);
      add({
        courseTitle, courseTypeId, vid: video, isEnable, isReal, duration
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
      console.log(row);
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
      console.log(params);
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },

    // TODO 话术批量删除
    selectionChangeSpeech(list) {
      console.log(list);
      this.selectionList = list;
    },

    handleDeleteSpeech(courseId) {
      console.log(courseId);
      this.$confirm("确定一键删除所有话术内容吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          removeMore(courseId)
          .then(res => {
            if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "操作成功!"
                  });
              this.onLoadSpeechcraft(this.speechcraftInfo.id, this.speechcraftPage.currentPage, this.speechcraftPage.pageSize);
            }
          }).catch(err => {
            this.$message.error(err)
          })
        });
      // if (this.selectionList.length === 0) {
      //   this.$message.warning("请选择至少一条数据");
      //   return;
      // }
      // this.$confirm("确定将选择数据删除?", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      //   .then(() => {
      //     return remove(this.ids);
      //   })
      //   .then(() => {
      //     this.onLoad(this.page);
      //     this.$message({
      //       type: "success",
      //       message: "操作成功!"
      //     });
      //     this.$refs.crud.toggleSelection();
      //   });
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
      console.log(formatSeconds(90));
      this.loading = true;
      getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
        console.log(this.data);
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
        // this.selectionClear();
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

      this.courseDuration = formatSeconds(this.courseInfo.duration)
      console.log(this.courseInfo);
      this.onLoadCourse(this.courseInfo.channelId);
    },
    submitCourse() {
      console.log(this.courseInfo.day);
      console.log(this.courseInfo.startTime);
      if (this.courseInfo.day === undefined || !this.courseInfo.day) {
        this.$message.error('请录入日期')
        return;
      }
      if (this.courseInfo.startTime === undefined || !this.courseInfo.startTime) {
        this.$message.error('请录入时间')
        return;
      }
      const data = {
        startTime: this.courseInfo.startTime,
        courseId: this.courseInfo.id,
        channelId: this.courseInfo.channelId,
        day: this.courseInfo.day,
        dayTime: `${this.courseInfo.day} ${this.courseInfo.startTime}`,
        vid: this.courseInfo.vid
      }
      this.showLoading();
      courseEdit(data)
        .then(res => {
          this.hideLoading();
          if (res.data.code === 200) {
            this.courseInfo.day = '';
            this.courseInfo.startTime = '';
            this.$message.success('操作成功')
            this.onLoadCourse(this.courseInfo.channelId)
          }
        }).catch(err => {
        this.hideLoading();
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
          return removeCourse(row.id)
        }).then(() => {
        this.onLoadCourse(this.courseInfo.channelId);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      });
    },
    // TODO 话术管理
    speechcraftCurrentChange(currentPage) {
      this.speechcraftPage.currentPage = currentPage;
      this.onLoadSpeechcraft(this.speechcraftInfo.id, this.speechcraftPage.currentPage, this.speechcraftPage.pageSize);
    },
    speechcraftSizeChange(pageSize) {
      this.speechcraftPage.pageSize = pageSize;
      this.onLoadSpeechcraft(this.speechcraftInfo.id, this.speechcraftPage.currentPage, this.speechcraftPage.pageSize);
    },
    speechcraftSelectionChange(list) {
      this.selectionList = list;
    },
    onLoadSpeechcraft(courseId, current, size) {
      this.loading = true;
      speechcraftData(courseId, current, size).then(res => {
        const data = res.data.data;
        this.speechcraftPage.total = data.total;
        this.speechcraftData = data.records;
        this.loading = false;
        // this.selectionClear();
      });
    },
    speechcraftDelete(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return removeSpeechcraft(row.id)
        }).then(() => {
        this.onLoadSpeechcraft(this.speechcraftInfo.id, this.speechcraftPage.currentPage, this.speechcraftPage.pageSize);
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
      this.courseTypeId  = this.speechcraftInfo.courseTypeId;
      console.log(this.speechcraftInfo);
      this.onLoadSpeechcraft(this.speechcraftInfo.id, this.speechcraftPage.currentPage, this.speechcraftPage.pageSize);
    },
    submitSpeechcraft() {
      if (this.speechcraftInfo.time === undefined || !this.speechcraftInfo.time) {
        this.$message.error('请录入时间')
        return;
      }
      if (this.speechcraftInfo.verbalContent === undefined || !this.speechcraftInfo.verbalContent) {
        this.$message.error('请输入话术内容')
        return;
      }
      console.log(this.speechcraftInfo);
      const data = {
        time: this.speechcraftInfo.time,
        courseId: this.speechcraftInfo.id,
        verbalContent: this.speechcraftInfo.verbalContent,
        // courseTypeId: this.speechcraftInfo.courseTypeId
      }
      this.showLoading();
      speechcraftEdit(data)
        .then(res => {
          if (res.data.code === 200) {
            this.hideLoading();
            this.$message.success('操作成功')
            this.speechcraftInfo.verbalContent = '';
            this.onLoadSpeechcraft(this.speechcraftInfo.id, this.speechcraftPage.currentPage, this.speechcraftPage.pageSize);
          }
        }).catch(err => {
        this.hideLoading();
        console.log(err);
      })
    },
    // TODO 解锁，锁定
    handleLocking(isLocking) {
      let type = isLocking === 0 ? '解锁' : '锁定';
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      } else if (this.selectionList.length > 1) {
        this.$message.warning("最多只能同时选择一条");
        return;
      }
      this.$confirm(`您即将为选中课程${type}进行, ${type}后课程会有一定的影响`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return lockCourse({
            isLocking,
            id: this.selectionList[0].id
          })
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
