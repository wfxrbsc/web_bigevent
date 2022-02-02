$(function () {
//    获取用户信息
    getUserInfo();

    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            //    headers就是请求配置对象
            // headers: {
            //     Authorization: localStorage.getItem('token') || ''
            // },
            success: function (res) {
                // console.log(res)
                if (res.status != 0) {
                    return layui.layer.msg("获取用户信息失败");
                }
                //    调用renderAvatar渲染用户的头像
                renderAvatar(res.data);
            },
        //    如果用户没有权限，不能直接访问index.html页面
            complete:function (res){
            //    1.强制清空本地存储token值
            //    判断返回值
            //     if(res.responseJSON.status ===1 && res.responseJSON.message === '身份认证失败！'){
            //         localStorage.removeItem('token');
            //         //    2.强制跳转到登录页面
            //         location.href="login.html"
            //     }
            }

        });
    }

    function renderAvatar(userInfo) {
        //    1.获取用户的名称
        var userName = userInfo.nickname || userInfo.username;
        //    2.渲染用户的名称
        $("#welcomeInfo").html(`欢迎${userName}`);
        //    3.获取用户头像
        if (userInfo.user_pic != null) {
            // 3.1有用户头像，渲染用户头像
            $(".layui-nav-img").attr('url', userInfo.user_pic).show();
            $(".text-avatar").hide();
        } else {
            //   3.2没有用户头像，渲染第一个字母
            var first = userName[0].toUpperCase();
            $(".text-avatar").html(first).show();
            $(".layui-nav-img").hide();
        }
    }

//    退出功能模块
    $('#btnLogout').on('click',function (){
        layer.confirm('是否确认退出', {icon: 3, title:'提示'}, function(index){
            //1.清空本地存储
            localStorage.removeItem('token');
            //2.跳转到登录页面
            location.href='login.html';
            layer.close(index);
        });
    })
})