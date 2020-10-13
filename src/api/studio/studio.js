import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-studio/page',
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
    url: '/api/blade-studio/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-studio/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-studio/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-studio/submit',
    method: 'post',
    data: row
  })
}


export const getTree = () => {
  return request({
    url: '/api/blade-courseType/tree',
    method: 'get'
  })
}

export const getTreeChildren = (courseTypeId) => {
  return request({
    url: '/api/blade-course/Tree',
    params: {
      courseTypeId
    }
  })
}

export const openStudio = (data) => {
  return request({
    url: '/api/blade-studio/save',
    method: 'post',
    data
  })
}


export const sendStudioAddress = (vid) => {
  return request({
    url: '/api/blade-studio/studioCode',
    method: 'get',
    params: {
      vid
    }
  })
}


// 获取追加学院
export const getStudent = (current, size, params) => {
  return request({
    url: '/api/blade-member/studioMemberPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

// 追加学员
export const appendStudent = (data) => {
  return request({
    url: '/api/blade-studio/append',
    method: 'post',
    data
  })
}
