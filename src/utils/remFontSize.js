export default function remFontSize(rem){
  var fontSize = window.getComputedStyle(document.documentElement).fontSize;
  // console.log(111222,Math.floor(rem * fontSize.replace('px', '')))
  return Math.floor(rem * 2 * fontSize.replace('px', ''));
}