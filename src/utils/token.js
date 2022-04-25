
// 存储token
export const setToken = (key, token) => {
  window.sessionStorage.setItem(key, token)
}
export const removeToken = () => {
  window.sessionStorage.clear()
}
