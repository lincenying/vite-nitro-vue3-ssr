import { ElMessage, ElMessageBox } from '@/config/element'

type MessageType = 'success' | 'warning' | 'info' | 'error'
type ConfigType = string | { content: string, type: MessageType }

/**
 * 显式提示信息
 * @example
 * ```
 * showMsg('content')
 * showMsg({ content: 'content'; type: 'success' | 'warning' | 'info' | 'error' })
 * ```
 */
export function showMsg(config: ConfigType) {
    let content: string, type: MessageType
    if (!config) {
        content = '接口返回数据错误'
        type = 'error'
    }
    else if (typeof config === 'string') {
        content = config
        type = 'error'
    }
    else {
        content = config.content
        type = config.type
    }
    ElMessage[type](content)
}

/**
 * 提示登录弹窗
 * @param content 登录弹窗内容
 * @param pathname 登录后跳转路径
 */
export function loginMsgBox(content: string, pathname: string) {
    ElMessageBox.alert(content, '提示', {
        confirmButtonText: '确定',
        showClose: false,
        callback: () => {
            window.$$lock = false
            window.location.href = `/login?callback=${pathname}`
        },
    })
}
