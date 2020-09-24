import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-develop/custom-entity/list',
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
    url: '/api/blade-develop/custom-entity/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-develop/custom-entity/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-develop/custom-entity/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-develop/custom-entity/submit',
    method: 'post',
    data: row
  })
}

export const select = () => {
  return request({
    url: '/api/blade-develop/custom-entity/select',
    method: 'get',
  })
}

