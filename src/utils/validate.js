/**
   * @param {string} path
   * @returns {Boolean}
   */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  // 对于传入的str，检查它是否在valid_map中存在
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validmobile(str) {
  // 正则校验
  return /^1[3-9]\d{9}$/.test(str)
}