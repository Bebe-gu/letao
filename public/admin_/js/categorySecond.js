$(function() {

    $('.modal-dialog').draggable();
    var currentPage = 1;
    /*渲染*/
    var render = function() {
        getSecondCategoryData({
            page: currentPage,
            pageSize: 5
        }, function(data) {
            // console.log(data);
            $('tbody').html(template('template', data));
            /*分页按钮*/
            $('.pagination').bootstrapPaginator({
                currentPage: data.page, //当前的请求页面。
                totalPages: Math.ceil(data.total / data.size), //一共多少页。
                size: "normal", //设置控件的显示大小。
                bootstrapMajorVersion: 3, //bootstrap的版本要求。
                alignment: "right",
                numberOfPages: 5, //设置分页按钮显示的页码数
                itemTexts: function(type, page, current) { //如下的代码是将页眉显示的中文显示我们自定义的中文。
                    switch (type) {
                        case "first":
                            return "首页";
                        case "prev":
                            return "上一页";
                        case "next":
                            return "下一页";
                        case "last":
                            return "末页";
                        case "page":
                            return page;
                    }
                },
                //1.jquery对象 2.dom原生对象 3.分页按钮的类型 4.点击的按钮的页码
                onPageClicked: function(event, originalEvent, type, page) { //给每个页眉绑定一个事件，其实就是ajax请求，其中page变量为当前点击的页上的数字。
                    currentPage = page;
                    render();
                }
            });

        });
    }
    render();
    /*点击选择一级分类下拉框*/
    getFirstCategoryData({
        page: 1,
        pageSize: 1000
    }, function(data) {
        $('.dropdown-menu').html(template('firstCategoryTemplate', data)).find('li').on('click', function(event) {
            var that = $(this).find('a');
            //console.log(that);
            $('.dropdown-toggle .categoryName').text(that.text());
            // 把data-id赋值给隐藏input,用于表单提交
            $('[name="categoryId"]').val(that.data('id'));
            /*修改校验状态*/
             $('#form').data('bootstrapValidator').updateStatus('categoryId', 'VALID');

        });;
    });
    /*上传图片*/
    initFileUpload();
    /*点击确定提交模态框数据*/
    $('#addModal form').bootstrapValidator({
        /*默认校验不包括的表单元素 [':hidden',':disabled',':not(visible)']表示*/
        excluded: [],

        message: 'This value is not valid',
        // 表单框里右侧的icon
        feedbackIcons: {　　　　　　　　
            valid: 'glyphicon glyphicon-ok',
            　　　　　　　　invalid: 'glyphicon glyphicon-remove',
            　　　　　　　　validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            categoryId: {
                validators: {
                    notEmpty: {
                        message: '请输入一级分类'
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: '请输入二级分类'
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: '请输上传图片'
                    }
                }
            }
        }
    }).on('success.form.bv', function(e) { //点击提交之后
        //阻止默认表单提交方式,本次用ajxa     
        e.preventDefault();
        //获取表单对象jquery对象
         var $form = $(e.target);
        $.ajax({
            url: '/category/addSecondCategory',
            type: 'post',
            dataType: 'json',
            data: $form.serialize(),
            success: function(data) {
                if (data.success) {
                    pageSize=1;
                    render();
                    $('#addModal').modal('hide');
                    

                } 
                // else {                 
                //     $form.data('bootstrapValidator').disableSubmitButtons(false);
                //     if (data.error == 1000) {
                //         $form.data('bootstrapValidator').updateStatus('username', 'INVALID', 'callback');
                //     } else if (data.error == 1001) {
                //         $form.data('bootstrapValidator').updateStatus('password', 'INVALID', 'callback');
                //     }
                // }
            }
        });
    });
    /*重置功能*/
    $('[type="reset"]').on('click', function() {
        /*6.重置验证*/
        $('#login').data('bootstrapValidator').resetForm();
    });

    // $('#addModal').on('click', '.btn-primary',function(event) {
    //     event.preventDefault();
    //     $('#addModal').modal('hide');
    //     /* Act on the event */
    // });


});

/*获取二级分类数据*/
var getSecondCategoryData = function(params, callback) {
    $.ajax({
        url: '/category/querySecondCategoryPaging',
        type: 'get',
        dataType: 'json',
        data: params,
        success: function(data) {
            callback && callback(data);
        }
    });
};
/*获取一级分类列表*/
var getFirstCategoryData = function(params, callback) {
    $.ajax({
        url: '/category/queryTopCategoryPaging',
        type: 'get',
        dataType: 'json',
        data: params,
        success: function(data) {
            callback && callback(data);
        }
    });
};

/*上传插件*/
var initFileUpload = function() {
    $('[name="pic1"]').fileupload({
        url: '/category/addSecondCategoryPic',
        dataType: 'json',
        done: function(e, data) {
            //上传文件夹不能删,删了报错
            $('#uploadImg').attr('src', data.result.picAddr);
            $('[name="brandLogo"]').val(data.result.picAddr);
            $('#form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID');

        }
    });
};
