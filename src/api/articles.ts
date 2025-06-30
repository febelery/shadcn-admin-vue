import axios from 'axios'
import type { AxiosResponse } from 'axios'

export interface Article {
  id: number
  title: string
  excerpt: string
  content?: string
  author: string
  status: 'published' | 'draft' | 'archived'
  category: string
  tags: string | string[]
  publishedAt: string
  views: number
  cover: string
  createdAt: string
  updatedAt: string
}

export interface ArticleListParams {
  page?: number
  pageSize?: number
  search?: string
  category?: string
  status?: string
  author?: string
}

export interface ArticleListResponse {
  data: Article[]
  total: number
  page: number
  pageSize: number
}

export interface CreateArticleParams {
  title: string
  excerpt?: string
  content: string
  category: string
  tags: string[]
  status: 'published' | 'draft'
  cover?: string
}

export interface UpdateArticleParams extends Partial<CreateArticleParams> {
  id: number
}

// 获取文章列表
export const getArticlesApi = (params: ArticleListParams): Promise<AxiosResponse<ArticleListResponse>> => {
  return axios.get('/articles', { params })
}

// 获取文章详情
export const getArticleApi = (id: number): Promise<AxiosResponse<Article>> => {
  return axios.get(`/articles/${id}`)
}

// 创建文章
export const createArticleApi = (data: CreateArticleParams): Promise<AxiosResponse<Article>> => {
  return axios.post('/articles', data)
}

// 更新文章
export const updateArticleApi = (data: UpdateArticleParams): Promise<AxiosResponse<Article>> => {
  return axios.put(`/articles/${data.id}`, data)
}

// 删除文章
export const deleteArticleApi = (id: number): Promise<AxiosResponse<void>> => {
  return axios.delete(`/articles/${id}`)
}

// 批量删除文章
export const batchDeleteArticlesApi = (ids: number[]): Promise<AxiosResponse<void>> => {
  return axios.delete('/articles/batch', { data: { ids } })
}
