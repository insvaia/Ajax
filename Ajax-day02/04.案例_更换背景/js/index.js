/**
 * 目标：网站-更换背景
 *  1. 选择图片上传，设置body背景
 *  2. 上传成功时，"保存"图片url网址
 *  3. 网页运行后，"获取"url网址使用
 * */
document.querySelector('.bg-ipt').addEventListener('change', e => {
  const file = e.target.files[0]
  const formData = new FormData()
  formData.append('img', file)
  axios({
    method: 'POST',
    url: 'http://hmajax.itheima.net/api/uploadimg',
    data: formData
  }).then(res => {
    const imgUrl = res.data.data.url
    document.body.style.backgroundImage = `url(${imgUrl})`
    localStorage.setItem('bgImg', imgUrl)
  })
})
// 网页运行后，获取url网址使用
const bgUrl = localStorage.getItem('bgImg')
bgUrl && (document.body.style.backgroundImage = `url(${bgUrl})`)