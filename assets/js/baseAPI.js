$(function (){
//    每次调用$.get()或$.post或$.ajax()的时候
//    会先调用ajaxPrefilter这个函数
//    在这个函数中可以拿到给Ajax提供的配置对象
    $.ajaxPrefilter( function( options ) {
        options.url=`http://www.liulongbin.top:3007${options.url}`;
        // Modify options, control originalOptions, store jqXHR, etc
    });
});