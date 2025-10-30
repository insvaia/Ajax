/**
 * 目标1：信息渲染
 *  1.1 获取用户的数据
 *  1.2 回显数据到标签上
 * */
const creator = '常刘原'
axios({
  url: 'http://hmajax.itheima.net/api/settings',
  params: {
    creator
  }
}).then(res => {
  // console.log(res)
  const userObj = res.data.data
  Object.keys(userObj).forEach(key => {
    if (key === 'avatar') {
      //赋予默认头像
      document.querySelector('.prew').src = userObj[key]
    } else if (key === 'gender') {
      const gRadioList = document.querySelectorAll('.gender')
      //获取性别数字
      const gNum = userObj[key]
      // 根据数字选中对应的单选框
      gRadioList[gNum].checked = true
    } else {
      document.querySelector(`.${key}`).value = userObj[key]
    }
  })
})
document.querySelector('.upload').addEventListener('change', e => {
  //获取头像文件
  console.log(e.target.files[0])
  const formData = new FormData()
  formData.append('avatar', e.target.files[0])
  formData.append('creator', creator)
  //提交到服务器并更新头像
  axios({
    method: 'PUT',
    url: 'http://hmajax.itheima.net/api/avatar',
    data: formData
  }).then(res => {
    // console.log(res)
    const imgUrl = res.data.data.url
    document.querySelector('.prew').src = imgUrl
  })
})
//提交表单
document.querySelector('.submit').addEventListener('click', e => {
  //收紧表单信息
  const userFrom = document.querySelector('.user-form')
  const userObj = serialize(userFrom, { hash: true, empty: true })
  //添加creator属性
  userObj.creator = creator
  //性别字符串转化为数字类型
  userObj.gender = +userObj.gender
  //提交到服务器
  axios({
    method: 'PUT',
    url: 'http://hmajax.itheima.net/api/settings',
    data: userObj
  }).then(res => {
    // console.log(res)
    //创建toast对象
    const toastDom = document.querySelector('.my-toast')
    const toast = new bootstrap.Toast(toastDom)
    //调用show方法显示提示框
    toast.show()
  })
})

