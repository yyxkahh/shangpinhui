//暴露函数
//本地存储持久化存储token
export const setToken = (token) => {
    localStorage.setItem('TOKEN', token)
}
export const getToken = () => {
    return localStorage.getItem('TOKEN');
}
//清除token
export const clearToken = () => {
    return localStorage.removeItem('TOKEN')
}