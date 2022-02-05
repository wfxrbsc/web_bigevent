var layer = layui.layer;
var form = layui.form;
$(function () {
    initCate();
    // 初始化富文本编辑器
    initEditor();
//    实现基本裁剪方法
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    $('#btnSelImg').on('click', function () {
        $("#selImg").click();
    })

//监听文件状态
    $("#selImg").on('change', function (e) {
//    获取用户选择的文件
        var files = e.target.files[0];
//    判断用户是否选择了文件，没有选择，直接return
        if (files.length === 0) {
            return
        }
//    根据选择的文件，创建一个对应的URL地址
        var newImgURL = URL.createObjectURL(files);
        console.log(newImgURL);
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
//    发布文章模块
//    定义文章发布状态
    var art_state = '已发布';
//    如果点击存为草稿，更改类型
    $("#btnArtDrf").click(function () {
        art_state = '草稿';
    })
//为表单绑定submit提交事件
    $("#form-pub").on('submit', function (e) {
        //    1.阻止默认提交行为
        e.preventDefault();
        //    2.基于form表单，快速创建一个FormData对象
        var fd = new FormData($(this)[0]);
        //    3.将文章的发布状态，存到fd中
        fd.append('state', art_state)
        // 4.将封面裁剪后的区域，转换为文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //5.将文件对象，存到fd中
                fd.append('cover_img', blob)
            //    6.发起ajax请求
                publishArticle(fd)
            })
    })
})
//为选择封面的按钮，绑定点击事件的处理函数


//定义加载文章的方法
function initCate() {
    //    动态获取文章类别
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            // 渲染数据到模板引擎
            var htmlStr = template('tpl-artCate', res);
            $('#selCate').html(htmlStr);
            //    通知layui重新渲染表单区域的UI结构
            form.render();
        }
    })
}

//定义发布文章的方法
function publishArticle(fd){
    $.ajax({
        method: 'POST',
        url:'/my/article/add',
        data:fd,
    //    如果是向服务器提交的是FormData格式的数据
    //    必须添加以下两个配置项
        contentType:false,
        processData:false,
        success:function (res){
            if(res.status !== 0){
                return layer.msg(res.message)
            }
            layer.msg(res.message)
        //    发布文章成功后，跳转到文章列表页面
            location.href='/article/art_list.html'
        }
    })
}