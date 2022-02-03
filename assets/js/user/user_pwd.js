var layer = layui.layer;
$(function () {
    // 密码验证规则
    var form = layui.form;
    form.verify({
        //密码必须是6-12位
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })
//    提交修改模块
    $('#pwdSubmit').submit(function (e) {
        e.preventDefault();
        //    发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败')
                }
                layer.msg('更新密码成功')
            //    重置表单,将jq对象转换为文档对象
                $(".layui-form")[0].reset();
            }
        })
    })
})