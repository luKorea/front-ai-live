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

export const getListPage = (current, size, params) => {
  return request({
    url: '/api/blade-studio/getUserMonitoringList',
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

// 获取用户信息
export const getUserMessage = (studioIds) => {
  return request({
    url: '/api/blade-studio/getAllMemberByStudioId',
    method: 'get',
    params: {
      studioIds
    }
  })
}

// 获取历史记录
export const getHistoryMessage = (params) => {
  return request({
    url: '/api/blade-studio-history/list',
    method: 'get',
    params: {
      ...params
    }
  })
}

// 设置意向度
export const setUserIntention = (data) => {
  return request({
    url: '/api/blade-member/updateIntentionById',
    method: 'post',
    data: data
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


export const getTree = (data) => {
  return request({
    url: '/api/blade-courseType/tree',
    method: 'get',
    params: {
      ...data
    }
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
