
// 存储token
export const setToken = (key, token) => {
  console.log(token)
  window.sessionStorage.setItem(key, token)
}
export const removeToken = () => {
  window.sessionStorage.clear()
}
