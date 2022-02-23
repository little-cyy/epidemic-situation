/**
* @desc 函数节流
* @param func (function) 函数
* @param wait (number) 延迟执行毫秒数
* @param options  (object) 配置函数的执行方式 
         1.默认，有头有尾：立即执行，触发事件结束后也会再执行一次
         2.{begin:true}：立即执行，触发事件结束后不会再执行一次
         3.{end:true}：不立即执行，触发事件结束后会再执行一次
*/
const throttle=(func, wait, options = {begin:true,end:true})=> {
  let timeout,
    previous = 0
  return function(...args) {
    
    let now = +new Date()
    let remain = wait - (now - previous)
    if (remain < 0) {
      if (previous === 0 && !options.begin) {
        previous = now
        return
      }
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(this,args)
    } else if (!timeout && options.end) {
      timeout = setTimeout(() => {
        func.apply(this, args)
        timeout = null
      }, wait)
    }
  }
}
export default throttle
/*

// 时间戳方案
第一种是用时间戳来判断是否已到执行时间，记录上次执行的时间戳，然后每次触发事件执行回调，
回调中判断当前时间戳距离上次执行时间戳的间隔是否已经达到时间差（wait） ，
如果是则执行，并更新上次执行的时间戳，如此循环。
特点:在持续触发事件的过程中，函数会立即执行，并且每 1s 执行一次。
function throttle(func, wait) {
  let previous = 0   // 上一次执行 fn 的时间
  return function(...args) {
    let now = Date.now()   // 获取当前时间，转换成时间戳，单位毫秒
    if (now - previous > wait) {
      previous = now
      fn.apply(this, args)
    }
  }
}

***********************************88
// 定时器方案
function throttle(func, wait) {
  let timeout
  return function(...args) {
    if (!timeout) {  //说明执行完了，重新执行
      timeout = setTimeout(() => {
        timeout = null
        func.apply(this, args)
      }, wait)
    }
  }
}
当触发事件的时候，如果没有设置执行回调函数的定时器，就创建一个。当定时器中的回调函数被执行的时候， 将指向定时器引用的timeout设置为null，那么下一此再执行时，又会重新触发并设置一个定时器。
特点:在持续触发事件的过程中，函数不会立即执行，并且每 1s 执行一次，在停止触发事件后，函数还会再执行一次。

*/