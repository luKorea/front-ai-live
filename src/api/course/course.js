import request from '@/router/axios';
import axios from 'axios';
import qs from 'qs';

export const getList = (current, size, params) => {
    return request({
        url: '/api/blade-course/page',
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
        url: '/api/blade-course/detail',
        method: 'get',
        params: {
            id
        }
    })
}

export const remove = (ids) => {
    return request({
        url: '/api/blade-course/remove',
        method: 'post',
        params: {
            ids,
        }
    })
}

export const add = (row) => {
    return request({
        url: '/api/blade-course/submit',
        method: 'post',
        data: row
    })
}

export const update = (row) => {
    return request({
        url: '/api/blade-course/submit',
        method: 'post',
        data: row
    })
}

// 排课管理
export const getCourseEdit = (courseId) => {
    return request({
        url: '/api/blade-schedule/page',
        method: 'get',
        params: {
            courseId,
            current: 1,
            size: 100,
        }
    })
}


// 添加排课管理
export const courseEdit = (data) => {
    return request({
        url: '/api/blade-schedule/submit',
        method: 'post',
        data: data
    })
}

// 删除排课管理
export const removeCourse = (ids) => {
    return request({
        url: '/api/blade-schedule/remove',
        method: 'post',
        params: {
            ids,
        }
    })
}

// 解锁锁定接口
export const lockCourse = (data) => {
    return request({
        url: '/api/blade-course/locking',
        method: 'post',
        data
    })
}

// 话术管理
export const speechcraftData = (courseId) => {
    return request({
        url: '/api/blade-words/page',
        method: 'get',
        params: {
            courseId,
            current: 1,
            size: 100,
        }
    })
}

// 添加话术管理
export const speechcraftEdit = (data) => {
    return request({
        url: '/api/blade-words/submit',
        method: 'post',
        data: data
    })
}

// 删除话术管理
export const removeSpeechcraft = (ids) => {
    return request({
        url: '/api/blade-words/remove',
        method: 'post',
        params: {
            ids,
        }
    })
}


// 获取树状结构
export const getTreeData = () => {
    return request({
        url: '/api/blade-courseType/tree',
        method: 'get'
    })
}

// 上传Excel
export const sendExcel = (data) => {
  return request({
    url: '/api/blade-words/import',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
