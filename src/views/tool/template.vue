<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
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
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="{row}" slot="menu">
        <el-button type="text"
                   icon="el-icon-setting"
                   size="small"
                   plain
                   class="none-border"
                   @click.stop="handleTemplateFile(row)">模板配置
        </el-button>
      </template>
      <template slot-scope="{row}"
                slot="templateEngine">
        <el-tag>{{row.$templateEngine}}</el-tag>
      </template>
      <template slot-scope="{row}"
                slot="isCover">
        <el-tag>{{row.$isCover}}</el-tag>
      </template>
    </avue-crud>
    <avue-drawer :title="`[${templateName}] 模板文件配置`" show-close :width="1200" v-model="drawerVisible"
                 :before-close="handleDrawerClose">
      <avue-crud :option="optionFile"
                 :data="dataFile"
                 :page="pageFile"
                 v-model="formFile"
                 ref="crudFile"
                 @row-del="rowDelFile"
                 @row-update="rowUpdateFile"
                 @row-save="rowSaveFile"
                 :before-open="beforeOpenFile"
                 @search-change="searchChangeFile"
                 @search-reset="searchResetFile"
                 @selection-change="selectionChangeFile"
                 @current-change="currentChangeFile"
                 @size-change="sizeChangeFile"
                 @on-load="onLoadFile">
        <template slot="menuLeft">
          <el-button type="danger"
                     size="small"
                     icon="el-icon-delete"
                     plain
                     @click="handleDeleteFile">删 除
          </el-button>
        </template>
        <template slot-scope="scope" slot="fileContentForm">
          <codemirror :options="codeOption" v-model="formFile.fileContent"></codemirror>
        </template>
      </avue-crud>
    </avue-drawer>
  </basic-container>
</template>

<script>
  import {
    getList,
    getDetail,
    add,
    update,
    remove,
    getTemplateFile,
    getListTemplateFile,
    addTemplateFile,
    updateTemplateFile,
    removeTemplateFile
  } from "@/api/tool/template";
  import {mapGetters} from "vuex";
  import {codemirror} from 'vue-codemirror-lite'
  import 'codemirror/mode/clike/clike.js'

  export default {
    components: {
      codemirror
    },
    data() {
      return {
        codeOption: {
          mode: 'text/x-java',
          tabSize: 2,
          lineNumbers: true,
          lineWrapping: true,
          styleActiveLine: true,
          matchBrackets: true,
          viewportMargin: Infinity,
          extraKeys: {'Ctrl-Space': 'autocomplete'},
        },
        form: {},
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        drawerVisible: false,
        templateId: 0,
        templateName: "菜单",
        option: {
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          dialogWidth: 300,
          dialogHeight: 330,
          column: [
            {
              label: "模板名",
              prop: "templateName",
              search: true,
              rules: [{
                required: true,
                message: "请输入模板名",
                trigger: "blur"
              }]
            },
            {
              label: "模板编号",
              prop: "templateCode",
              search: true,
              rules: [{
                required: true,
                message: "请输入模板编号",
                trigger: "blur"
              }]
            },
            {
              label: "模版引擎",
              prop: "templateEngine",
              search: true,
              slot: true,
              type: "select",
              dicUrl: "/api/blade-system/dict/dictionary?code=template_category",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入模板名",
                trigger: "blur"
              }]
            },
            {
              label: "允许覆盖",
              prop: "isCover",
              search: true,
              slot: true,
              type: "select",
              dicData: [
                {
                  label: "否",
                  value: 0,
                },
                {
                  label: "是",
                  value: 1,
                },
              ],
              rules: [{
                required: true,
                message: "请输入模板编号",
                trigger: "blur"
              }]
            },
            {
              label: "模板备注",
              prop: "templateRemark",
              span: 24,
              minRows: 6,
              type: "textarea"
            },
          ]
        },
        data: [],
        formFile: {},
        selectionListFile: [],
        pageFile: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        optionFile: {
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          menuWidth: 200,
          dialogHeight: 610,
          column: [
            {
              label: "文件名称",
              prop: "fileName",
              width: 350,
              search: true,
              rules: [{
                required: true,
                message: "请输入名称",
                trigger: "blur"
              }]
            },
            {
              label: "文件编号",
              prop: "fileCode",
              width: 80,
              search: true,
              rules: [{
                required: true,
                message: "请输入编号",
                trigger: "blur"
              }]
            },
            {
              label: "系统类型",
              prop: "fileCategory",
              width: 80,
              type: "select",
              dicUrl: "/api/blade-system/dict/dictionary?code=system_category",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请选择系统类型",
                trigger: "blur"
              }]
            },
            {
              label: "构建代号",
              prop: "buildCode",
              type: "tree",
              multiple: true,
              width: 150,
              dicUrl: "/api/blade-develop/custom-code/select",
              props: {
                label: "codeKey",
                value: "codeKey"
              },
              rules: [{
                required: true,
                message: "请选择构建代号",
                trigger: "blur"
              }]
            },
            {
              label: "相对路径",
              prop: "filePath",
              hide: true,
              type: "select",
              dicUrl: "/api/blade-develop/custom-path/select?category=1",
              props: {
                label: "pathName",
                value: "pathValue"
              },
              rules: [{
                required: true,
                message: "请选择相对路径",
                trigger: "blur"
              }]
            },
            {
              label: "备注",
              prop: "fileRemark",
            },
            {
              label: "模板内容",
              prop: "fileContent",
              hide: true,
              formslot: true,
              span: 24,
              rules: [{
                required: true,
                message: "请输入内容",
                trigger: "blur"
              }],
            },
          ]
        },
        dataFile: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: true,
          delBtn: true,
          editBtn: true,
          viewBtn: false
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      },
      fileIds() {
        let ids = [];
        this.selectionListFile.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      rowSave(row, loading, done) {
        add(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowUpdate(row, index, loading, done) {
        update(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          done();
          console.log(error);
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
        if (["add"].includes(type)) {
          setTimeout(() => {
            this.form.templateEngine = 1;
            this.form.isCover = 0;
          }, 10);
        }
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
      searchChange(params) {
        this.query = params;
        this.onLoad(this.page, params);
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
      handleTemplateFile(row) {
        this.drawerVisible = true;
        this.templateId = row.id;
        this.templateName = row.templateName;
      },
      handleDrawerClose(hide) {
        hide();
      },
      rowSaveFile(row, loading, done) {
        row = {
          ...row,
          templateId: this.templateId,
          buildCode: row.buildCode.join(",")
        }
        addTemplateFile(row).then(() => {
          loading();
          this.onLoadFile(this.pageFile);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowUpdateFile(row, index, loading, done) {
        row = {
          ...row,
          templateId: this.templateId,
          buildCode: row.buildCode.join(",")
        }
        updateTemplateFile(row).then(() => {
          loading();
          this.onLoadFile(this.pageFile);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowDelFile(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return removeTemplateFile(row.id);
          })
          .then(() => {
            this.onLoadFile(this.pageFile);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      handleDeleteFile() {
        if (this.selectionListFile.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return removeTemplateFile(this.fileIds);
          })
          .then(() => {
            this.onLoadFile(this.pageFile);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crudFile.toggleSelection();
          });
      },
      beforeOpenFile(done, type) {
        if (["add"].includes(type)) {
          setTimeout(() => {
            this.formFile.buildCode = "main";
          }, 10);
        }
        if (["edit", "view"].includes(type)) {
          getTemplateFile(this.formFile.id).then(res => {
            this.formFile = res.data.data;
          });
        }
        done();
      },
      searchResetFile() {
        this.onLoadFile(this.pageFile);
      },
      searchChangeFile(params) {
        this.onLoadFile(this.pageFile, params);
      },
      selectionChangeFile(list) {
        this.selectionListFile = list;
      },
      currentChangeFile(currentPage) {
        this.pageFile.currentPage = currentPage;
      },
      sizeChangeFile(pageSize) {
        this.pageFile.pageSize = pageSize;
      },
      onLoadFile(page, params = {}) {
        const values = {
          ...params,
          templateId: this.templateId,
        }
        getListTemplateFile(page.currentPage, page.pageSize, Object.assign(values, this.query)).then(res => {
          const data = res.data.data;
          this.pageFile.total = data.total;
          this.dataFile = data.records;
          this.selectionListFile = [];
        });
      },
    }
  };
</script>

<style>
  .none-border {
    border: 0;
    background-color: transparent !important;
  }

  .CodeMirror {
    border: 1px solid #DCDFE6 !important;
    height: 350px !important;
  }
</style>
