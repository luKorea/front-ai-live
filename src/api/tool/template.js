import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-develop/template/list',
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
    url: '/api/blade-develop/template/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-develop/template/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-develop/template/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-develop/template/submit',
    method: 'post',
    data: row
  })
}

export const getListTemplateFile = (current, size, params) => {
  return request({
    url: '/api/blade-develop/template-file/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getTemplateFile = (id) => {
  return request({
    url: '/api/blade-develop/template-file/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const removeTemplateFile = (ids) => {
  return request({
    url: '/api/blade-develop/template-file/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const addTemplateFile = (row) => {
  return request({
    url: '/api/blade-develop/template-file/submit',
    method: 'post',
    data: row
  })
}

export const updateTemplateFile = (row) => {
  return request({
    url: '/api/blade-develop/template-file/submit',
    method: 'post',
    data: row
  })
}
