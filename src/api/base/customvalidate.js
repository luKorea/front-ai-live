import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-develop/custom-validate/list',
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
    url: '/api/blade-develop/custom-validate/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-develop/custom-validate/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-develop/custom-validate/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-develop/custom-validate/submit',
    method: 'post',
    data: row
  })
}

export const select = () => {
  return request({
    url: '/api/blade-develop/custom-validate/select',
    method: 'get',
  })
}

