/**
   * @desc 函数防抖
   * @param func 目标函数
   * @param delay 延迟执行毫秒数
   * @param immediate true - 立即执行， false - 延迟执行
   */
  const debounce=(func, delay, immediate=false)=>{
    let timer;
    return function(...args) {
      if (timer) clearTimeout(timer);
      if (immediate) {
        let callNow = !timer;
        timer = setTimeout(() => {
          timer = null;
        }, delay);
        if (callNow) func.apply(this, args);
      } else {
        timer  = setTimeout(() => {
          func.apply(this, args);
        }, delay)
      }
    }
}

export default debounce
/*
   非立即执行版
   非立即执行版的意思是触发事件后函数不会立即执行，而是在 n 秒后执行，
   如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
  debounce = (func, delay = 500) => {
    let timer = null
    return function (...args) {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimerout(() => { // 
        func.apply(this, args)
      }, delay)
    }

  }
// 立即执行版
  立即执行版的意思是触发事件后函数会立即执行，
  然后 n 秒内不触发事件才能继续执行函数的效果。
  debounce=(func, delay=500) =>{
    let timer=null;
    return function(...args) {
      if (timer) {
        clearTimeout(timer)
      }
      let callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, delay)
      if (callNow) func.apply(this, args);
    }
}

*/