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
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/member/member";
  import {mapGetters} from "vuex";
  import {dateFormat} from "@/util/date";

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
          addBtn: false,
          align: 'center',
          // viewBtn: true,
          // selection: true,
          dialogClickModal: false,
          menu: false,
          column: [
            {
              label: "ID",
              prop: "id"
            },
            {
              label: "直播间id",
              prop: "studioId"
            },
            {
              label: "手机号",
              prop: "phone",
              search: true
            },
            {
              label: "真实姓名",
              prop: "name"
            },
            {
              label: "微信名称",
              prop: "nickname"
            },
            {
              label: '直播时间',
              prop: 'dayTime'
            },
             {
              label: "课程名称",
              prop: "courseTitle"
            },

            {
              label: "上课时长",
              prop: "timeMax",
              type: 'time'
            },
             {
              label: "销售姓名",
              prop: "realName"
            },
            {
              label: "开始时间",
              prop: "startTime",
              search: true,
              type: 'datetime',
              valueFormat: "timestamp",
              // format: "yyyy-MM-dd hh:mm",
              // valueFormat: "yyyy-MM-dd hh:mm",
              display: false,
              hide: true,
            },
            {
              label: "结束时间",
              prop: "endTime",
              search: true,
              type: 'datetime',
              valueFormat: "timestamp",
              // format: "yyyy-MM-dd hh:mm",
              // valueFormat: "yyyy-MM-dd hh:mm",
              display: false,
              hide: true
            },
            {
              label: "意向程度",
              prop: "intentionName",
              display: false,
              type: 'select',
              search: true,
              dicData: [
                {
                  label: 'A',
                  value: 1
                }, {
                  label: 'B',
                  value: 2
                }, {
                  label: 'C',
                  value: 3
                }, {
                  label: 'D',
                  value: 4
                }
              ]
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
          addBtn: this.vaildData(this.permission.member_add, false),
          viewBtn: this.vaildData(this.permission.member_view, false),
          delBtn: this.vaildData(this.permission.member_delete, false),
          editBtn: this.vaildData(this.permission.member_edit, false)
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
        params.startTime = dateFormat(new Date(params.startTime));
        params.endTime = dateFormat(new Date(params.endTime));
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
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
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
      }
    }
  };
</script>

<style>
</style>
