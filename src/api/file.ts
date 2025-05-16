import axios, { type AxiosResponse } from 'axios'
import qs from 'query-string'

interface QiniuParams {
  name: string
  modified: number
  size: number
  type: string
}

interface QiniuResponse {
  uptoken: string
}

export const qiniuUptokenApi = async (params: QiniuParams): Promise<AxiosResponse<QiniuResponse>> => {
  return axios.get<QiniuResponse>('/qiniu/uptoken', {
    params,
    paramsSerializer: (params) => qs.stringify(params),
  })
}
