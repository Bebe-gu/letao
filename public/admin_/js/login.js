$(function() {

    $('form').bootstrapValidator({
        // 默认的提示消息
        message: 'This value is not valid',
        // 表单框里右侧的icon
        feedbackIcons: {　　　　　　　　
            valid: 'glyphicon glyphicon-ok',
            　　　　　　　　invalid: 'glyphicon glyphicon-remove',
            　　　　　　　　validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                message: '用户名验证失败',
                validators: {
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    regexp: { //正则表达式
                        regexp: /^[a-zA-Z0-9_]+$/,
                        message: '用户名只能包含大写、小写、数字和下划线'
                    },
                    callback: {
                        message: '用户名错误'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: { //长度限制
                        min: 6,
                        max: 18,
                        message: '用户名长度必须在6到18位之间'
                    },
                    callback: {
                        message: '密码错误'
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
            url: '/employee/employeeLogin',
            type: 'post',
            dataType: 'json',
            data: $form.serialize(),
            success: function(data) {
                if (data.success) {
                    location.href = '/admin_/index.html'
                } else {
                    //回复按钮可用状态
                    $form.data('bootstrapValidator').disableSubmitButtons(false);
                    if (data.error == 1000) {
                        /*username 参数1.校验对象 2.校验的状态(NOT_VALIDATED 没有校验, VALIDATING 校验中, INVALID 校验失败 or VALID 校验成功 ) 3.选着校验规则提示的消息*/
                        $form.data('bootstrapValidator').updateStatus('username', 'INVALID', 'callback');
                    } else if (data.error == 1001) {
                        $form.data('bootstrapValidator').updateStatus('password', 'INVALID', 'callback');
                    }
                }
            }
        });
    });
    /*重置功能*/
    $('[type="reset"]').on('click', function() {
        /*6.重置验证*/
        $('#login').data('bootstrapValidator').resetForm();
    });

});
