import * as $ from 'jquery'
import './css/index.css'  // webpack css-loader解析css文件
import './css/index.less' // webpack less-loader解析less文件
$(function() {
  $('body').css({color: 'red'})
})

const echoFun = () => {
  return new Promise((resolve, reject) => {
    if (true) {
      conselo.log('sdsd')
      resolve('hello')
    } else {
      reject('error')
    }
  })
}

window.addEventListener('scroll', async () => {
  let result = await echoFun()
  console.log(result, '结果')
})