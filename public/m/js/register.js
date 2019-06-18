$(function() {


    $('.lt_register').on('tap', function(event) {
        if (window.loading) return false;
        var data = {
            username: $.trim($('input[name="username"]').val()),
            password: $.trim($('input[name="password"]').val()),
            mobile: $.trim($('input[name="mobile"]').val()),
            vCode: $.trim($('[name="code"]').val())
        };
        if (!data.username) {
            mui.toast('用户名不能为空');
            return false;
        }
        if (!/^1\d{10}$/.test(data.mobile)) {
            mui.toast('请输入合法手机号');
            return false;
        }
        if (!data.password) {
            mui.toast('密码不能为空');
            return false;
        }
        if (!$('input[name="passwordAgain"]').val()) {
            mui.toast('确认密码不能为空');
            return false;
        }
        if (data.password != $('input[name="passwordAgain"]').val()) {
            mui.toast('两次密码输入不一致');
            return false;
        }

        if (!$('input[name="code"]').val()) {
            mui.toast('验证码不能为空');
            return false;
        }

        if (!/^\d{6}$/.test(data.vCode)) {
            mui.toast('请输入合法验证码');
            return false;
        }

        if (!$('input[type="checkbox"]').prop('checked')) {
            mui.toast('请勾选同意协议');
            return false;
        }
        /*注册*/
        $.ajax({
            url: '/user/register',
            type: 'post',
            dataType: 'json',
            data: data,
            beforeSend: function() {
                $('.lt_register').html('正在提交...');
            },
            success: function(data) {

                console.log(data);
                if (data.success) {
                    mui.toast('注册成功!即将跳转登录页');
                    setTimeout(function() {
                        location.href = "login.html";
                    }, 2000);

                } else if (data.error) {
                    mui.toast(data.message);
                    $('.lt_register').html('注册');
                }
            }
        });
    });


    /*获取验证码*/
    $('.btn_getCode').on('tap', function(event) {

        getCode(function(data) {
            console.log(data.vCode);
            $('.codeImg').text(data.vCode);
            mui.toast('稍后自动输入验证码');
            setTimeout(function() {
                $('#code').val(data.vCode);
            }, 1000);

        });

        var that = $(this);
        //that.attr('disabled', 'disabled');
        that.addClass('disabled');
        that.css('pointer-events', 'none');
        that.text('正在发送...');
        var index = 60;
        var timer = setInterval(function() {
            that.text(index + '秒后再获取');
            index--;
            if (index < 0) {
                that.text('获取验证码');
                that.removeClass('disabled');
                //that.removeAttr('disabled')
                that.css('pointer-events', '');
                clearInterval(timer);
            }
        }, 1000);

    });

});

var getCode = function(callback) {
    $.ajax({
        url: '/user/vCode',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            callback && callback(data);
        }
    });


};
