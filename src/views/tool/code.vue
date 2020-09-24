<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               ref="crud"
               v-model="form"
               :permission="permissionList"
               :page="page"
               @row-del="rowDel"
               @row-update="rowUpdate"
               @row-save="rowSave"
               :before-open="beforeOpen"
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
                   v-if="permission.code_delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
        <el-button type="primary"
                   size="small"
                   plain
                   icon="el-icon-refresh"
                   @click="handleBuild">代码生成
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text"
                   size="small"
                   icon="el-icon-document-copy"
                   v-if="permission.code_edit"
                   plain
                   class="none-border"
                   @click.stop="handleCopy(scope.row)">复制
        </el-button>
      </template>
      <template slot-scope="{row}" slot="tableName">
        <el-tag>{{row.tableName}}</el-tag>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getTableList, getTableInfoByName} from "@/api/tool/model";
  import {getList, getCode, build, remove, add, update, copy} from "@/api/tool/code";
  import {validatenull} from "@/util/validate";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {},
        selectionList: [],
        loading: true,
        query: {},
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        option: {
          dialogWidth: 400,
          dialogHeight: 500,
          tip: false,
          border: true,
          index: true,
          selection: true,
          labelWidth: 120,
          viewBtn: true,
          column: [
            {
              label: "数据源",
              prop: "datasourceId",
              search: true,
              type: "select",
              width: 120,
              dicUrl: "/api/blade-develop/datasource/select",
              props: {
                label: "name",
                value: "id"
              },
              rules: [{
                required: true,
                message: "请选择数据源",
                trigger: "blur"
              }]
            },
            {
              label: "前端系统",
              prop: "systemName",
              search: true,
              type: "select",
              width: 80,
              dicData: [
                {
                  label: "saber",
                  value: "saber",
                },
                {
                  label: "sword",
                  value: "sword",
                },
              ],
              rules: [{
                required: true,
                message: "前端系统",
                trigger: "blur"
              }]
            },
            {
              label: "表名",
              prop: "tableName",
              slot: true,
              type: "tree",
              dicData: [],
              props: {
                label: "comment",
                value: "name"
              },
              rules: [{
                required: true,
                message: "请输入表名",
                trigger: "blur"
              }]
            },
            {
              label: "表前缀",
              prop: "tablePrefix",
              hide: true,
              rules: [{
                required: true,
                message: "请输入表前缀",
                trigger: "blur"
              }]
            },
            {
              label: "模块名",
              prop: "codeName",
              search: true,
              rules: [{
                required: true,
                message: "请输入模块名",
                trigger: "blur"
              }]
            },
            {
              label: "服务名",
              prop: "serviceName",
              search: true,
              rules: [{
                required: true,
                message: "请输入服务名",
                trigger: "blur"
              }]
            },
            {
              label: "主键名",
              prop: "pkName",
              hide: true,
              rules: [{
                required: true,
                message: "请输入主键名",
                trigger: "blur"
              }]
            },
            {
              label: "包名",
              prop: "packageName",
              overHidden: true,
              rules: [{
                required: true,
                message: "请输入包名",
                trigger: "blur"
              }]
            },
            {
              label: "基础业务",
              prop: "baseMode",
              type: 'radio',
              dicUrl: "/api/blade-system/dict/dictionary?code=yes_no",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              hide: true,
              rules: [{
                required: true,
                message: "请选择基础业务",
                trigger: "blur"
              }]
            },
            {
              label: "包装器",
              prop: "wrapMode",
              type: 'radio',
              dicUrl: "/api/blade-system/dict/dictionary?code=yes_no",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              hide: true,
              rules: [{
                required: true,
                message: "请选择包装器",
                trigger: "blur"
              }]
            },
            {
              label: "后端生成路径",
              prop: "apiPath",
              span: 24,
              hide: true,
              rules: [{
                required: true,
                message: "请输入后端生成路径",
                trigger: "blur"
              }]
            },
            {
              label: "前端生成路径",
              prop: "webPath",
              span: 24,
              hide: true,
              rules: [{
                required: true,
                message: "请输入前端生成路径",
                trigger: "blur"
              }]
            }
          ]
        },
        data: []
      };
    },
    watch: {
      'form.datasourceId'() {
        if (!validatenull(this.form.datasourceId)) {
          getTableList(this.form.datasourceId).then(res => {
            const index = this.$refs.crud.findColumnIndex("tableName");
            this.option.column[index].dicData = res.data.data;
          });
        }
      },
      'form.tableName'() {
        if (!validatenull(this.form.tableName)) {
          const table = this.form.tableName;
          getTableInfoByName(this.form.tableName, this.form.datasourceId).then(res => {
            const result = res.data;
            if (result.success) {
              const {name, comment} = result.data;
              if (validatenull(this.form.tablePrefix)) {
                this.form.tablePrefix = table.split("_")[0] + "_";
              }
              if (validatenull(this.form.codeName)) {
                this.form.codeName = comment;
              }
              if (validatenull(this.form.serviceName)) {
                this.form.serviceName = `blade-${name}`;
              }
              if (validatenull(this.form.pkName)) {
                this.form.pkName = "id";
              }
              if (validatenull(this.form.packageName)) {
                this.form.packageName = `org.springblade.${name}`;
              }
            }
          });
        }
      },
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.code_add, false),
          viewBtn: this.vaildData(this.permission.code_view, false),
          delBtn: this.vaildData(this.permission.code_delete, false),
          editBtn: this.vaildData(this.permission.code_edit, false)
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
      handleBuild() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("是否生成选中模块的代码?", {
          title: "代码生成确认",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return build(this.ids);
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
      handleCopy(row) {
        copy(row.id).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "复制成功!"
          });
        });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getCode(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
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
      }
    }
  };
</script>

<style>
  .none-border {
    border: 0;
    background-color: transparent !important;
  }
</style>
