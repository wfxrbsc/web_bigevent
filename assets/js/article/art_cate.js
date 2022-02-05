var layer = layui.layer;
var form = layui.form;
$(function () {
//    初始化表格数据
    getInitArtcileList();
//    添加文章类别模块
    var indexAdd = null
    $("#addCate").on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: ['添加文章分类', 'font-size:15px;'],
            area: ['500px', '250px'],
            content: $("#dialog-add").html(),
        });
    });
    //确认添加数据请求,因为是动态添加的，只能通过代理添加form-add
    $("body").on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败')
                }
                layer.msg('新增文章分类成功');
                //    重新初始化
                getInitArtcileList();
                //    关闭弹出层
                layer.close(indexAdd);

            }
        })
    })
    //编辑文章类别模块,通过代理添加编辑功能
    var indexEdit = null
    $('tbody').on('click', '#editCate', function () {
        indexEdit = layer.open({
            type: 1,
            title: ['修改文章分类', 'font-size:15px;'],
            area: ['500px', '250px'],
            content: $("#dialog-edit").html(),
        });
        //    填充当前内容
        //    获取自定义属性id
        var id = $(this).attr('data-index');
        //    确认修改，ajax数据请求
        //发起Ajax请求，填充数据
        $.ajax({
            method: 'GET',
            url: `/my/article/cates/${id}`,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // layer.msg(res.message);
                //    填充数据到表格
                form.val('form-edit', res.data);
            }
        })


    })
//    通过代理，表格提交
    $('body').on('submit', '#form-edit', function (e) {
        //    确认修改功能,根据ID更新数据
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                getInitArtcileList();
                layer.close(indexEdit);
            }

        })

    })
//    删除文章类别功能,通过代理
    $('tbody').on('click', '#delCate', function () {
        //    定义弹出层
        //    获取需要删除分类的id
        var id = $(this).attr('data-index');
        //定义弹出层
        layer.confirm('确认删除', {icon: 3, title: '提示'}, function (index) {
            //do something
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/'+id,
                success:function (res){
                    if(res.status !== 0){
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message);
                    getInitArtcileList();
                }
            })
            layer.close(index);

        });
    })

})

function getInitArtcileList() {

//    发起Ajax请求获取文章列表数据
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            // console.log(res)
            if (res.status !== 0) {
                return layer.msg('获取文章列表失败')
            }
            // layer.msg('获取文章列表成功')
            //    通过调用模板引擎渲染数据到表格
            var htmlStr = template('tpl-table', res)
            $('#artcileList').html(htmlStr)
        }
    })

}