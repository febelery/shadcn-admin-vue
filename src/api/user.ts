import axios from 'axios'

export const loginApi = (params: Record<string, any>) => {
  return axios.post('/auth/admin', params)
}

export const verifyOtpApi = (params: { otp_key: string }): any => {
  return axios.post('/auth/admin/otp', params)
}
