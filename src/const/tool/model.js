export const switchDic = [
  {
    label: "",
    value: 0
  },
  {
    label: "",
    value: 1
  }
];

export const option = {
  tip: false,
  border: true,
  index: true,
  viewBtn: true,
  selection: true,
  dialogWidth: 300,
  dialogHeight: 355,
  column: [
    {
      label: "数据源",
      prop: "datasourceId",
      search: true,
      span: 24,
      type: "select",
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
      label: "物理表名",
      prop: "modelTable",
      type: "tree",
      slot: true,
      dicData: [],
      props: {
        label: "comment",
        value: "name"
      },
      rules: [{
        required: true,
        message: "请输入数据库表名",
        trigger: "blur"
      }]
    },
    {
      label: "模型类名",
      prop: "modelClass",
      rules: [{
        required: true,
        message: "请输入模型类名",
        trigger: "blur"
      }]
    },
    {
      label: "模型名称",
      prop: "modelName",
      search: true,
      rules: [{
        required: true,
        message: "请输入模型名称",
        trigger: "blur"
      }]
    },
    {
      label: "模型编号",
      prop: "modelCode",
      search: true,
      rules: [{
        required: true,
        message: "请输入模型编号",
        trigger: "blur"
      }]
    },
    {
      label: "模型备注",
      prop: "modelRemark",
      hide: true,
      span: 24,
    },
  ]
};

export const option0 = {
  border: true,
  index: true,
  addBtn: false,
  editBtn: false,
  addRowBtn: false,
  cellBtn: false,
  cancelBtn: false,
  tip: false,
  menu: false,
  selection: true,
  column: [{
    label: '物理列名',
    prop: 'jdbcName',
  }, {
    label: '物理类型',
    prop: 'jdbcType',
  }, {
    label: '说明',
    prop: 'comment',
    cell: true,
  }]
};

export const option1 = {
  border: true,
  index: true,
  addBtn: false,
  editBtn: false,
  addRowBtn: false,
  cellBtn: false,
  cancelBtn: false,
  tip: false,
  menu: false,
  selection: true,
  column: [{
    label: '物理列名',
    prop: 'jdbcName',
  }, {
    label: '物理类型',
    prop: 'jdbcType',
  }, {
    label: '说明',
    prop: 'comment',
  }, {
    label: '实体类型',
    prop: 'propertyEntity',
    type: "select",
    dicData: [],
    props: {
      label: "entityName",
      value: "entityFullName"
    },
    cell: true,
  }, {
    label: '实体列名',
    prop: 'propertyName',
    cell: true,
  }]
};

export const option2 = {
  border: true,
  index: true,
  addBtn: false,
  editBtn: false,
  addRowBtn: false,
  cellBtn: false,
  cancelBtn: false,
  tip: false,
  menu: false,
  selection: true,
  column: [{
    label: '物理列名',
    prop: 'jdbcName',
  }, {
    label: '物理类型',
    prop: 'jdbcType',
  }, {
    label: '实体列名',
    prop: 'propertyName',
  }, {
    label: '说明',
    prop: 'comment',
  }, {
    label: '表单显示',
    prop: 'isForm',
    type: 'switch',
    dicData: switchDic,
    align: 'center',
    cell: true,
  }, {
    label: '独占一行',
    prop: 'isRow',
    type: 'switch',
    dicData: switchDic,
    align: 'center',
    cell: true,
  }, {
    label: '组件类型',
    prop: 'componentType',
    type: "select",
    dicUrl: "/api/blade-develop/custom-component/select",
    props: {
      label: "componentName",
      value: "componentKey"
    },
    cell: true,
  }, {
    label: '字典编码',
    prop: 'dictCode',
    type: "select",
    dicUrl: "/api/blade-system/dict/select",
    props: {
      label: "dictValue",
      value: "code"
    },
    cell: true,
  }]
};

export const option3 = {
  border: true,
  index: true,
  addBtn: false,
  editBtn: false,
  addRowBtn: false,
  cellBtn: false,
  cancelBtn: false,
  tip: false,
  menu: false,
  selection: true,
  column: [{
    label: '物理列名',
    prop: 'jdbcName',
  }, {
    label: '物理类型',
    prop: 'jdbcType',
  }, {
    label: '实体列名',
    prop: 'propertyName',
  }, {
    label: '说明',
    prop: 'comment',
  }, {
    label: '必填',
    prop: 'isRequired',
    type: 'switch',
    dicData: switchDic,
    align: 'center',
    cell: true,
  }, {
    label: '验证类型',
    prop: 'validateType',
    type: "select",
    dicUrl: "/api/blade-develop/custom-validate/select",
    props: {
      label: "validateName",
      value: "validateKey"
    },
    cell: true,
  }]
};

export const option4 = {
  border: true,
  index: true,
  addBtn: false,
  editBtn: false,
  addRowBtn: false,
  cellBtn: false,
  cancelBtn: false,
  tip: false,
  menu: false,
  selection: true,
  column: [{
    label: '物理列名',
    prop: 'jdbcName',
  }, {
    label: '物理类型',
    prop: 'jdbcType',
  }, {
    label: '实体列名',
    prop: 'propertyName',
  }, {
    label: '说明',
    prop: 'comment',
  }, {
    label: '列表显示',
    prop: 'isList',
    type: 'switch',
    dicData: switchDic,
    align: 'center',
    cell: true,
  }, {
    label: '查询配置',
    prop: 'isQuery',
    type: 'switch',
    dicData: switchDic,
    align: 'center',
    cell: true,
  }, {
    label: '查询类型',
    prop: 'queryType',
    type: "select",
    dicUrl: "/api/blade-develop/custom-query/select",
    props: {
      label: "queryName",
      value: "queryKey"
    },
    cell: true,
  }]
};
