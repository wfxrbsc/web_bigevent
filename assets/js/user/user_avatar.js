$(function () {
//    定义layui消息组件对象
    var layer = layui.layer;
// 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,//16/9 16：9的宽高
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
//    为上传按钮绑定点击事件
    $("#btnChooseImage").click(function () {
        $("#file").click();
    })
//    调用文件change事件，监听文件状态
    $("#file").on('change', function (e) {
        //获取用户选择的图片
        var files = e.target.files;
        if (files.length === 0) {
            return layer.msg('请选择图片')
        }
        //    渲染图片到裁剪框
        //     1.拿到用户选择的文件
        var file = e.target.files[0];
        //    2.根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);
        //    3.先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
        //    上传图片到服务器，并更新用户头像
        $("#btnUpload").on('click', function () {
            // 将裁剪后的图片，输出为 base64 格式的字符串
            var dataURL = $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 100,
                    height: 100
                })
                .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            $.ajax({
                method:'POST',
                url:'/my/update/avatar',
                data:{
                    avatar:dataURL
                },
                success:function (res){
                    if(res.status !== 0){
                        return layer.msg("更换头像失败")
                    }
                    layer.msg('更换头像成功');
                //    重新更新页面头像
                    window.parent.getUserInfo();
                }
            })
        })
    })

})