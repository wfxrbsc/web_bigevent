var layer = layui.layer;
var form = layui.form;
var laypage = layui.laypage;
var q = {
    pagenum: 1,//页码值，默认请求第一页的数据
    pagesize: 3,//每页显示几条数据，默认每页显示2条
    cate_id: '',//文章分类的Id
    state: ''//文章的发布状态
}
$(function () {
    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return `${y}-${m}-${d}  ${hh}:${mm}:${ss}`
    }
    initTable();
    intiCate();
    editArtcile();//编辑文章功能
//表单筛选模块
    $("#formSearch").submit(function (e) {
        e.preventDefault();
        //    获取表单中选中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        //    为查询参数对象q中对应的值赋值
        q.cate_id = cate_id;
        q.state = state;
        //    根据最新的筛选条件，重新初始化文章列表
        initTable();

    })

})
//定义一个查询的参数对象，将来请求的时候，需要将请求参数对象提交到服务器

//初始化，获取文章列表
function initTable() {
    $.ajax({
        method: 'GET',
        url: '/my/article/list',
        data: q,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            // layer.msg(res.message)
            //    用模板引擎渲染数据到网页
            var htmlStr = template('tpl-table', res);
            $('tbody').html(htmlStr);
            renderPage(res.total);
        }
    })
}

//定义补零函数
function padZero(n) {
    return n > 9 ? n : `0${n}`;
}

//初始化分类列表数据
function intiCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            //    渲染数据到模板引擎
            var htmlStr = template('tpl-cate', res);
            $('[name=cate_id]').html(htmlStr);
            //    通知layui重新渲染表单区域的UI结构
            form.render();

        }
    })
}

//定义渲染分页的方法
function renderPage(total) {
//    调用laypage.render()方法来渲染分页的结构
    laypage.render({
        elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
        count: total, //数据总数，从服务端得到
        limit: q.pagesize,//每页显示几条数据
        curr: q.pagenum,
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10],
        //触发jump回调的方式有两种：
        //1.点击页码的时候，会触发jump回调
        //2.只要调用了laypage.render()方法，就会触发jump回调
        jump: function (obj, first) {
            //分页发生跳转时，触发jump
            //如果first的值为true，证明方式2触发的，否则就是方式1触发的
            //obj包含了当前分页的所有参数，比如：
            // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
            // console.log(obj.limit); //得到每页显示的条数
            //把最新的页码值，赋值到q这个查询参数对象中
            q.pagenum = obj.curr;
            //把最新的条目数，赋值到q这个查询参数对象的pagesize属性中
            q.pagesize = obj.limit;

            //首次不执行
            if (!first) {
                //do something
                initTable();
            }
        }//设置默认被选中的分页
    });

}

//通过代理的形式为删除按钮绑定点击事件--编辑文章功能还未处理完毕
$("tbody").on('click', '.btn-delete', function () {
//    获取删除按钮的个数
    var len = $(".btn-delete").length;
//    询问用户是否要删除数据
    //获取当前id
    var id = $(this).attr('data-id')
    layer.confirm('确认删除?', {icon: 3, title: '提示'}, function (index) {
        //do something
        //发起ajax数据请求
        $.ajax({
            method: 'GET',
            url: '/my/article/delete/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                //当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                //如果没有剩余的数据了，则让页码-1
                if (len === 1) {
                    //页码值最小必须是1
                    q.pagenum = q.pagenum === 1 ? q.pagenum : q.pagenum - 1;
                }
                initTable();
            }
        })
        layer.close(index);
    });
})

//定义文章编辑编辑功能
function editArtcile() {
    //通过代理的形式，根据ID更新文章信息

    $("body").on('click', '#edit', function () {
        // 先完成文章发布页面，在做编辑功能
//    获取当前的id值
        var id = $(this).attr('data-id');
        // 打开文章编辑页面
//        将id存储到本地
        localStorage.setItem("Id", id);
//    根据ID把数据填充到默认页面
//    通过ajax获取数据,

    })
}
