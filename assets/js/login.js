$(function () {
    //切换登录注册模块
    $("#login_box").on('click', 'a', function (event) {
        $("#reg_box").show();
        $("#login_box").hide();
    });
    $("#reg_box").on('click', 'a', function (event) {
        $("#reg_box").hide();
        $("#login_box").show();
    });
//    表单验证模块
//    从layui中获取from对象
    var form = layui.form;
    var layer = layui.layer; //利用layer msg 提示
//    通过from.verify()函数自定义校验规则
    form.verify({
        //    自定义一个叫做pwd校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            //"[]"是属性判断选择
            var pwd = $('.reg [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        },
        uname: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }

            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === 'xxx') {
                alert('用户名不能为敏感词');
                return true;
            }
        }
    });
//    注册请求模块
    $("#form_reg").on("submit", function (e) {
        e.preventDefault();
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val(),
        }
        $.ajax({
            method: 'post',
            url: '/api/reguser',
            data: data,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg("注册失败");
                }
                layer.msg("注册成功");
                $("#link_login").click();
            }
        });
    });
//    登录模块
    $("#form_login").submit(function (e) {
        e.preventDefault();
        //快速获取表单数据
        var data = $(this).serialize();
        //     {
        //     username: $("#form_login [name=username]").val(),
        //     password: $("#form_login [name=password]").val()
        // }

        $.post('/api/login', data, function (res) {
                // console.log(res)
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                console.log(res.token);
                //将登录成功的token字符串保存到localStrorage 中
                localStorage.setItem('token', res.token);
                location.href='/index.html';
            }
        );
    });
});