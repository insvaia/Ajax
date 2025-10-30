/**
 * 目标1：渲染图书列表
 *  1.1 获取数据
 *  1.2 渲染数据
 */
//渲染数据
const creator = '小王'
function render() {
  //1.获取数据
  axios({
    url: 'http://hmajax.itheima.net/api/books',
    params: {
      creator
    }
  }).then(res => {
    console.log(res);
    const books = res.data.data
    console.log(books);
    //2.渲染数据
    const htmlStr = books.map((item, index) => {
      const { bookname, author, publisher, id } = item
      return ` <tr>
        <td>${index + 1}</td>
      <td>${bookname}</td>
      <td>${author}</td>
      <td>${publisher}</td>
      <td data-id=${id}>
        <span class="del">删除</span>
        <span class="edit">编辑</span>
      </td>
      </tr>`
    }).join('')
    document.querySelector('tbody').innerHTML = htmlStr
  })
}
render()
//创建弹窗对象
const addmodalDom = document.querySelector('.add-modal')
const addmodal = new bootstrap.Modal(addmodalDom)
//保存按钮->点击->隐藏发送
document.querySelector('.add-btn').addEventListener('click', () => {
  //2.2手机表单数据，并提交到服务器保存
  const addForm = document.querySelector('.add-form')
  const bookObj = serialize(addForm, { hash: true, empty: true })
  console.log(bookObj)
  axios({
    method: 'POST',
    url: 'http://hmajax.itheima.net/api/books',
    data: {
      ...bookObj,
      creator
    }
  }).then(res => {
    console.log(res)

    render()
    //重置表单，隐藏弹窗
    addForm.reset()
    addmodal.hide()
  })
})
//删除操作（事件委托）
document.querySelector('.list').addEventListener('click', e => {
  //判断用户点击的是否为删除选项
  if (e.target.classList.contains('del')) {
    //获取自定义id
    const theId = e.target.parentNode.dataset.id
    //发送请求，删除图书
    axios({
      method: 'DELETE',
      url: `http://hmajax.itheima.net/api/books/${theId}`
    }).then(res => {
      console.log(res)
      //重新渲染
      render()
    })
  }
})
//创建编辑弹窗对象
const editmodalDom = document.querySelector('.edit-modal')
const editmodal = new bootstrap.Modal(editmodalDom)
//编辑操作（事件委托）
document.querySelector('.list').addEventListener('click', e => {
  //判断用户点击的是否为编辑选项
  if (e.target.classList.contains('edit')) {
    //获取当前编辑图书数据
    const theId = e.target.parentNode.dataset.id
    axios({
      url: `http://hmajax.itheima.net/api/books/${theId}`
    }).then(res => {
      console.log(res)
      const bookObj = res.data.data
      //填充表单数据
      // const book = res.data.data
      // const editForm = document.querySelector('.edit-form')
      // for (const key in book) {
      //   const value = book[key]
      //   const input = editForm.elements[key]
      //   if (input) {
      //     input.value = value
      //   }
      // }
      const keys = Object.keys(bookObj)
      keys.forEach(key => {
        document.querySelector(`.edit-form [name=${key}]`).value = bookObj[key]
      })
      editmodal.show()
    })
  }
})
//提交保存修改
document.querySelector('.edit-btn').addEventListener('click', () => {
  //获取表单数据
  const editForm = document.querySelector('.edit-form')
  const { id, bookname, author, publisher } = serialize(editForm, { hash: true, empty: true })
  //发送请求，保存修改
  axios({
    method: 'PUT',
    url: `http://hmajax.itheima.net/api/books/${id}`,
    data: {
      bookname,
      author,
      publisher,
      creator
    }
  }).then(res => {
    console.log(res)
    //重新渲染
    render()
    //隐藏弹窗
    editmodal.hide()

  })
})