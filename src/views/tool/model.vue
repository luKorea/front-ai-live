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
                   @click.stop="handleModel(row)">模型配置
        </el-button>
      </template>
      <template slot-scope="{row}" slot="modelTable">
        <el-tag>{{row.modelTable}}</el-tag>
      </template>
    </avue-crud>
    <el-dialog title="自动模型配置"
               :visible.sync="modelBox"
               :fullscreen="true">

      <el-steps :active="active" finish-status="success" simple>
        <el-step title="物理表配置" icon="el-icon-coin"></el-step>
        <el-step title="实体类配置" icon="el-icon-files"></el-step>
        <el-step title="表单控件配置" icon="el-icon-document"></el-step>
        <el-step title="表单校验配置" icon="el-icon-document-checked"></el-step>
        <el-step title="列表页面配置" icon="el-icon-notebook-2"></el-step>
      </el-steps>

      <div v-show="active===stepStart" class="step-div">
        <avue-crud ref="crud0" :option="option0" :data="fields" :table-loading="loading"
                   @selection-change="selectionModelChange">
          <template slot="menuLeft">
            <el-button type="danger"
                       size="small"
                       icon="el-icon-delete"
                       plain
                       @click="handleDeleteModel">删 除
            </el-button>
          </template>
        </avue-crud>
      </div>
      <div v-show="active===1" class="step-div">
        <avue-crud ref="crud1" :option="option1" :data="fields"></avue-crud>
      </div>
      <div v-show="active===2" class="step-div">
        <avue-crud ref="crud2" :option="option2" :data="fields"></avue-crud>
      </div>
      <div v-show="active===3" class="step-div">
        <avue-crud ref="crud3" :option="option3" :data="fields"></avue-crud>
      </div>
      <div v-show="active===stepEnd" class="step-div">
        <avue-crud ref="crud4" :option="option4" :data="fields"></avue-crud>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handlePrev" :disabled="active===stepStart">上一步</el-button>
        <el-button @click="handleNext" :disabled="active===stepEnd">下一步</el-button>
        <el-button type="danger" @click="modelBox = false">关 闭</el-button>
        <el-button type="primary" @click="handleSubmit">提 交</el-button>
      </span>
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
    getTableList,
    getTableInfoByName,
    getModelPrototype,
    submitModelPrototype
  } from "@/api/tool/model";
  import {select as selectEntity} from "@/api/base/customentity";
  import {option, option0, option1, option2, option3, option4} from "@/const/tool/model";
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
        modelBox: false,
        modelId: 0,
        datasourceId: 1,
        tableInfo: {},
        active: 0,
        stepStart: 0,
        stepEnd: 4,
        data: [],
        option: option,
        formStep: {},
        fields: [],
        selectionModelList: [],
        option0: option0,
        option1: option1,
        option2: option2,
        option3: option3,
        option4: option4,
      };
    },
    watch: {
      'form.datasourceId'() {
        if (!validatenull(this.form.datasourceId)) {
          getTableList(this.form.datasourceId).then(res => {
            const index = this.$refs.crud.findColumnIndex("modelTable");
            this.option.column[index].dicData = res.data.data;
          });
        }
      },
      'form.modelTable'() {
        if (!validatenull(this.form.modelTable)) {
          getTableInfoByName(this.form.modelTable, this.form.datasourceId).then(res => {
            const result = res.data;
            if (result.success) {
              const {name, comment, entityName} = result.data;
              if (validatenull(this.form.modelClass)) {
                this.form.modelClass = entityName;
              }
              if (validatenull(this.form.modelName)) {
                this.form.modelName = comment;
              }
              if (validatenull(this.form.modelCode)) {
                this.form.modelCode = name;
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
      },
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
      handleDeleteModel() {
        if (this.selectionModelList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {

            this.data0 = this.data0.filter(item => {
              let arr = [];
              this.selectionModelList.forEach(modelItem => {
                if (item.name === modelItem.name) {
                  arr.push(item);
                }
              });
              return arr.length === 0;
            });

            this.$refs.crud0.toggleSelection();
            this.$message({type: "success", message: "操作成功!"});
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
      searchChange(params) {
        this.query = params;
        this.onLoad(this.page, params);
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionModelChange(list) {
        this.selectionModelList = list;
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
      handleModel(row) {
        this.active = this.stepStart;
        this.modelBox = true;
        this.loading = true;
        this.modelId = row.id;
        this.datasourceId = row.datasourceId;
        getModelPrototype(this.modelId, this.datasourceId).then(res => {
          const result = res.data;
          if (result.success) {
            selectEntity().then(res => {
              const ret = res.data;
              if (ret.success) {
                const entityList = ret.data;
                const index = this.$refs.crud1.findColumnIndex("propertyEntity");
                this.option1.column[index].dicData = entityList;
                this.fields = result.data;
                this.fields.forEach(item => {
                  item.$cellEdit = true;
                  item.modelId = this.modelId;
                  if (validatenull(item.id)) {
                    item.isForm = 1;
                    item.isRow = 0;
                    item.isRequired = 0;
                    item.isList = 1;
                    item.isQuery = 0;
                    item.componentType = "input";
                  }
                  if (!validatenull(item.name) && !validatenull(item.type)) {
                    item.jdbcName = item.name;
                    item.jdbcType = item.type;
                    entityList.forEach(el => {
                      if (item.propertyType === el.entityName) {
                        item.propertyEntity = el.entityFullName;
                      }
                    });
                  }
                });
                this.loading = false;
              }
            })
          }
        });
      },
      handlePrev() {
        if (this.active-- <= this.stepStart) this.active++;
      },
      handleNext() {
        if (this.active++ >= this.stepEnd) this.active--;
      },
      handleSubmit() {
        console.log(this.fields);
        this.$confirm("确定提交模型配置?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          submitModelPrototype(this.fields).then(res => {
            const result = res.data;
            if (result.success) {
              this.$message.success(result.msg);
              this.modelBox = false;
            } else {
              this.$message.error(result.msg);
            }
          })
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

  .step-div {
    margin-top: 30px;
  }
</style>
