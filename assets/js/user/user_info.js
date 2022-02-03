//入口函数
var layer = layui.layer;
var form = layui.form;
$(function () {
//    自定义昵称验证规则长度必须是1-6位

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return layer.msg("请重新输入，用户昵称必须是1-12位")
            }
        }
    });
    initUserInfo();
//    初始化用户信息

//    用户信息修改提交
    $("#userInfoForm").submit(function (e) {
        //阻止表单默认提交行为
        e.preventDefault();
        //发Ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            //提交的表单数据,数据序列化
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('修改信息失败')
                }
                //调用form.val快速为表单赋值
                // alert(11)
                layer.msg('修改信息成功')
                //    更新昵称，调用父页面的方法，重新渲染用户昵称和头像
                window.parent.getUserInfo();

            }
        })
    })
//重置修改信息
    $("#bntReset").click(function (e) {
        //    阻止默认清空行为
        e.preventDefault();
        initUserInfo();
    })

})

function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status != 0) {
                return layer.msg('获取用户信息失败')
            }
            // console.log(res);
            form.val('formUserInfo', res.data)
        }
    })
}