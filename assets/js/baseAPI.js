$(function () {
//    每次调用$.get()或$.post或$.ajax()的时候
//    会先调用ajaxPrefilter这个函数
//    在这个函数中可以拿到给Ajax提供的配置对象
    $.ajaxPrefilter(function (options) {
        //统一为请求地址添加根网址
        options.url = `http://www.liulongbin.top:3007${options.url}`;
        //统一为有权限的网页添加headers头
        //    先判断是否需要权限，有权限才添加
        if (options.url.indexOf('/my/') !== -1) {
            options.headers = {
                Authorization: localStorage.getItem('token') || ''
            }
        }
        //    全局统一挂载complete函数
        options.complete = function (res) {
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                localStorage.removeItem('token');
                //    2.强制跳转到登录页面
                location.href = "login.html"
            }
        }
    });
});