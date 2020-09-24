import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-develop/model/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-develop/model/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-develop/model/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-develop/model/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-develop/model/submit',
    method: 'post',
    data: row
  })
}

export const getTableList = (datasourceId) => {
  return request({
    url: '/api/blade-develop/model/table-list',
    method: 'get',
    params: {
      datasourceId,
    }
  })
}

export const getTableInfo = (modelId, datasourceId) => {
  return request({
    url: '/api/blade-develop/model/table-info',
    method: 'get',
    params: {
      modelId,
      datasourceId,
    }
  })
}

export const getTableInfoByName = (tableName, datasourceId) => {
  return request({
    url: '/api/blade-develop/model/table-info',
    method: 'get',
    params: {
      tableName,
      datasourceId,
    }
  })
}

export const getModelPrototype = (modelId, datasourceId) => {
  return request({
    url: '/api/blade-develop/model/model-prototype',
    method: 'get',
    params: {
      modelId,
      datasourceId,
    }
  })
}

export const submitModelPrototype = (row) => {
  return request({
    url: '/api/blade-develop/model-prototype/submit-list',
    method: 'post',
    data: row
  })
}
