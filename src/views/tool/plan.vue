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
        <el-button type="primary"
                   size="small"
                   plain
                   icon="el-icon-refresh"
                   @click="handleBuild">代码生成
        </el-button>
        <el-button type="primary"
                   size="small"
                   plain
                   icon="el-icon-download"
                   @click="handleDownload">代码导出
        </el-button>
      </template>
      <template slot-scope="{row}"
                slot="templateId">
        <el-tag>{{row.$templateId}}</el-tag>
      </template>
      <template slot="modelForm" slot-scope="scope">
        <avue-crud :option="modelOption"
                   :data="modelData"
                   v-model="modelForm"
                   ref="crudModel"
                   @row-del="rowDelModel"
                   @row-update="rowUpdateModel"
                   @row-save="rowSaveModel"></avue-crud>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove, planModels, build, zip} from "@/api/tool/plan";
  import {getDetail as getModelDetail} from "@/api/tool/model";
  import {validatenull} from "@/util/validate";
  import {mapGetters} from "vuex";

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
        data: [],
        option: {
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          dialogHeight: 650,
          column: [
            {
              label: "方案名称",
              prop: "planName",
              search: true,
              rules: [{
                required: true,
                message: "请输入方案名称",
                trigger: "blur"
              }]
            },
            {
              label: "方案编号",
              prop: "planCode",
              search: true,
              rules: [{
                required: true,
                message: "请输入方案编号",
                trigger: "blur"
              }]
            },
            {
              label: "方案类型",
              prop: "planType",
              type: "select",
              dicUrl: "/api/blade-develop/custom-type/select",
              props: {
                label: "typeName",
                value: "id"
              },
              rules: [{
                required: true,
                message: "请输入方案类型",
                trigger: "blur"
              }]
            },
            {
              label: "绑定模板",
              prop: "templateId",
              type: "tree",
              slot: true,
              dicUrl: "/api/blade-develop/template/select",
              props: {
                label: "templateName",
                value: "id"
              },
              rules: [{
                required: true,
                message: "请选择绑定模板",
                trigger: "blur"
              }]
            },
            {
              label: "前端目录",
              prop: "frontendPath",
              type: "select",
              dicUrl: "/api/blade-develop/custom-path/select?category=2",
              props: {
                label: "pathName",
                value: "pathValue"
              },
              hide: true,
              rules: [{
                required: true,
                message: "请输入前端根目录",
                trigger: "blur"
              }]
            },
            {
              label: "前端模块",
              prop: "srcPath",
              search: true,
              hide: true,
              rules: [{
                required: true,
                message: "请输入前端模块名",
                trigger: "blur"
              }]
            },
            {
              label: "后端目录",
              prop: "backendPath",
              type: "select",
              dicUrl: "/api/blade-develop/custom-path/select?category=2",
              props: {
                label: "pathName",
                value: "pathValue"
              },
              hide: true,
              rules: [{
                required: true,
                message: "请输入后端根目录",
                trigger: "blur"
              }]
            },
            {
              label: "后端包名",
              prop: "packagePath",
              search: true,
              hide: true,
              rules: [{
                required: true,
                message: "请输入后端包名",
                trigger: "blur"
              }]
            },
            {
              labelWidth: 0,
              label: '模型绑定',
              prop: 'model',
              span: 24,
              hide: true,
              formslot: true,
            },
          ]
        },
        modelData: [],
        modelForm: {},
        modelOption: {
          border: true,
          index: true,
          addBtn: true,
          editBtn: true,
          viewBtn: false,
          tip: false,
          selection: true,
          dialogWidth: 300,
          dialogHeight: 300,
          column: [{
            label: '模型名称',
            prop: 'modelId',
            type: "tree",
            dicUrl: "/api/blade-develop/model/select",
            span: 24,
            props: {
              label: "modelName",
              value: "id"
            },
            rules: [{
              required: true,
              message: "请选择模型名称",
              trigger: "blur"
            }],
          }, {
            label: '构建代号',
            prop: 'buildCode',
            span: 24,
            type: "select",
            dicUrl: "/api/blade-develop/custom-code/select",
            props: {
              label: "codeKey",
              value: "codeKey"
            },
            rules: [{
              required: true,
              message: "请选择构建代号",
              trigger: "blur"
            }],
          }, {
            label: '模型编号',
            prop: 'modelCode',
            disabled: true,
            span: 24,
          }]
        }
      };
    },
    watch: {
      'modelForm.modelId'() {
        if (!validatenull(this.modelForm.modelId)) {
          getModelDetail(this.modelForm.modelId).then(res => {
            const result = res.data;
            if (result.success) {
              const {modelCode} = result.data;
              this.modelForm.modelCode = modelCode;
              if (this.modelData.length === 0) {
                this.modelForm.buildCode = "main";
              }
            }
          });
        }
      }
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
      }
    },
    methods: {
      rowSave(row, loading, done) {
        const vo = {
          plan: row,
          model: this.modelData
        };
        add(vo).then(() => {
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
        const vo = {
          plan: row,
          model: this.modelData
        };
        update(vo).then(() => {
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
      handleBuild() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("是否生成选中方案?", {
          title: "代码生成确认",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.loading = true;
            return build(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          }, error => {
            this.loading = false;
            console.log(error);
          });
      },
      handleDownload() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        if (this.selectionList.length > 1) {
          this.$message.warning("只能选择一条数据");
          return;
        }
        this.$confirm("是否导出选中方案?", {
          title: "代码导出确认",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.loading = true;
            return zip(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            window.location.href = `/api/blade-develop/plan/download-code?id=${this.ids}`;
            this.$refs.crud.toggleSelection();
          }, error => {
            this.loading = false;
            console.log(error);
          });
      },
      beforeOpen(done, type) {
        if (["add"].includes(type)) {
          this.modelData = [];
        }
        if (["edit", "view"].includes(type)) {
          const planId = this.form.id;
          getDetail(planId).then(res => {
            this.form = res.data.data;
            planModels(planId).then(res => {
              this.modelData = res.data.data;
            });
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
      rowSaveModel(row, loading, done) {
        loading();
        // 过滤相同模型id,保证只有一份
        this.modelData = this.modelData.filter(item => {
          return item.modelId !== row.modelId;
        });
        // 新增模型数据
        this.modelData.push(row);
        this.$message({type: "success", message: "操作成功!"});
        done();
      },
      rowUpdateModel(row, index, loading, done) {
        loading();
        // 获取更新前的原始数据
        const oldRow = this.modelData.filter(item => {
          return item.$index === index;
        });
        // 过滤原始数据
        this.modelData = this.modelData.filter(item => {
          return item.modelId !== oldRow[0].modelId;
        });
        // 过滤相同模型id,保证只有一份
        this.modelData = this.modelData.filter(item => {
          return item.modelId !== row.modelId;
        });
        // 新增模型数据
        this.modelData.push(row);
        this.$message({type: "success", message: "操作成功!"});
        done();
      },
      rowDelModel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.modelData = this.modelData.filter(item => {
            return item.modelId !== row.modelId;
          });
          this.$refs.crudModel.toggleSelection();
          this.$message({type: "success", message: "操作成功!"});
        });
      },
    }
  };
</script>

<style>
</style>
