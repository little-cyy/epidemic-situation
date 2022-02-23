(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      // js获取当前的设备大小：document.documentElement.clientWidth;
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      if (clientWidth >= 750) {  //宽度>750 平板或者桌面
        docEl.style.fontSize = '100px';
      } else {  //移动端的适配
        //750设计稿
        docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
      }
    };
    if(!doc.addEventListener)return ;
    win.addEventListener(resizeEvt,recalc,false);
    doc.addEventListener('DOMContentLoaded',recalc,false);
})(document,window);