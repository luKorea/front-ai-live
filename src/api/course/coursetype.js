import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-courseType/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getTypeTree = () => {
  return request({
    url: '/api/blade-courseType/pageTree',
    method: 'get'
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-courseType/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-courseType/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-courseType/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-courseType/submit',
    method: 'post',
    data: row
  })
}



export const getTreeData = () => {
  return request({
    url:'/api/blade-courseType/pageTree',
    method: 'get'
  })
}
