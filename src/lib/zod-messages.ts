import { z } from 'zod'

// 设置全局 Zod 错误消息
export function setupGlobalZodMessages() {
  const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
    switch (issue.code) {
      case z.ZodIssueCode.invalid_type:
        if (issue.expected === 'string') {
          return { message: '请输入文本内容' }
        }
        if (issue.expected === 'number') {
          return { message: '请输入数字' }
        }
        break
      case z.ZodIssueCode.too_small:
        if (issue.type === 'string') {
          return { message: `至少需要 ${issue.minimum} 个字符` }
        }
        if (issue.type === 'number') {
          return { message: `数值不能小于 ${issue.minimum}` }
        }
        break
      case z.ZodIssueCode.too_big:
        if (issue.type === 'string') {
          return { message: `不能超过 ${issue.maximum} 个字符` }
        }
        if (issue.type === 'number') {
          return { message: `数值不能大于 ${issue.maximum}` }
        }
        break
      case z.ZodIssueCode.invalid_string:
        if (issue.validation === 'email') {
          return { message: '请输入有效的邮箱地址' }
        }
        if (issue.validation === 'url') {
          return { message: '请输入有效的网址' }
        }
        break
      case z.ZodIssueCode.custom:
        return { message: issue.message || '输入格式不正确' }
    }
    return { message: ctx.defaultError }
  }

  z.setErrorMap(customErrorMap)
}