import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-develop/plan/list',
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
    url: '/api/blade-develop/plan/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-develop/plan/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-develop/plan/save',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-develop/plan/update',
    method: 'post',
    data: row
  })
}

export const build = (ids) => {
  return request({
    url: '/api/blade-develop/plan/build-code',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const zip = (id) => {
  return request({
    url: '/api/blade-develop/plan/zip-code',
    method: 'post',
    params: {
      id,
    }
  })
}

export const planModels = (planId) => {
  return request({
    url: '/api/blade-develop/plan/plan-models',
    method: 'get',
    params: {
      planId
    }
  })
}
