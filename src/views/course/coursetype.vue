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
      <!--      <template slot="menuLeft">-->
      <!--        <el-button type="danger"-->
      <!--                   size="small"-->
      <!--                   icon="el-icon-delete"-->
      <!--                   plain-->
      <!--                   v-if="permission.coursetype_delete"-->
      <!--                   @click="handleDelete">删 除-->
      <!--        </el-button>-->
      <!--      </template>-->
    </avue-crud>
  </basic-container>
</template>

<script>
import {
  getList,
  getDetail,
  add,
  update,
  remove,
  getTreeData, getTypeTree
} from "@/api/course/coursetype";
import {mapGetters} from "vuex";
import {getDeptTree} from "@/api/system/dept";

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
        viewBtn: true,
        // selection: true,
        dialogClickModal: false,
        column: [
          {
            label: "课程类别名称",
            labelWidth: 150,
            prop: "courseTypeName",
            search: true,
            rules: [{
              required: true,
              message: "请输入",
              trigger: "blur"
            }]
          },
          {
            label: "上级课程类别",
            labelWidth: 150,
            type: 'tree',
            prop: 'parentId',
            hide: true,
            dicData: [],
            props: {
              label: "title",
              value: 'id'
            }
          },
          {
            label: "创建时间",
            display: false,
            prop: 'createTime'
          },
        ]
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.coursetype_add, false),
        viewBtn: this.vaildData(this.permission.coursetype_view, false),
        delBtn: this.vaildData(this.permission.coursetype_delete, false),
        editBtn: this.vaildData(this.permission.coursetype_edit, false)
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
      console.log(row);
      let {parentId} = row;
      if (parentId === '') {
        parentId = 0;
      }
      add({
        ...row,
        parentId: parentId
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
    beforeOpen(done, type) {
      if (type === 'add') {
        getTreeData()
          .then(res => {
            const index = this.$refs.crud.findColumnIndex("parentId");
            this.option.column[index].dicData = res.data.data;
          }).catch(err => {
          console.log(err);
        })
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
        console.log(res);
        const data = res.data.data;
        // getTypeTree().then(res => {
        //   console.log(res);
        //   const data = res.data.data;
        //   const index = this.$refs.crud.findColumnIndex("parentName");
        //   this.option.column[index].dicData = data;
        // });
        this.page.total = data.total;
        this.data = data;
        this.loading = false;
        this.selectionClear();
      });
    }
  }
};
</script>

<style>
</style>
