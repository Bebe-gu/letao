$(function() {

    var oldPassword = "";

    getUserOldPassword(function(data) {
        if (data.error == 400) {
            mui.toast(data.message);
            setTimeout(function() {
                location.href = LT.loginUrl;
            }, 2000);
        }
    });




    $('.lt_reset').on('tap', function(event) {
        if (window.loading) return false;
        var data = {
            oldPassword: $.trim($('input[name="oldPassword"]').val()),
            newPassword: $.trim($('input[name="newPassword"]').val()),
            reNewPassword: $.trim($('input[name="passwordAgain"]').val()),
            code: $.trim($('[name="code"]').val())
        };
        if (!data.oldPassword) {
            mui.toast('原密码不能为空');
            return false;
        }
        /*获取旧密码*/
        /*  getUserOldPassword(function(data) {
                      oldPassword = data.password;
                      console.log(oldPassword);
                  });*/
        // var newPassword = $('input[name="oldPassword"]').val().MD5(64);
        // console.log(newPassword);
        // if (newPassword != oldPassword) {
        //     mui.toast('原密码不正确');
        //     return false;
        // }
        if (!data.newPassword) {
            mui.toast('新密码不能为空');
            return false;
        }
        if (!$('input[name="passwordAgain"]').val()) {
            mui.toast('确认密码不能为空');
            return false;
        }
        if (data.newPassword != $('input[name="passwordAgain"]').val()) {
            mui.toast('两次密码输入不一致');
            return false;
        }
        if (!$('input[name="passwordAgain"]').val()) {
            mui.toast('确认密码不能为空');
            return false;
        }
        if (!$('input[name="code"]').val()) {
            mui.toast('验证码不能为空');
            return false;
        }
        // console.log($('input[name="code"]').val());
        console.log(data);
        if (!/^\d{6}$/.test(data.code)) {
            mui.toast('请输入合法验证码');
            return false;
        }

        // console.log(data.code);
        /*修改密码*/
        $.ajax({
            url: '/user/updatePassword',
            type: 'post',
            dataType: 'json',
            data: data,
            beforeSend: function() {
                $('.lt_reset').html('正在提交...');
            },
            success: function(data) {
                window.loading = null;
                console.log(data);
                if (data.error == 401) {
                    mui.toast('修改成功！');
                    location.href = "user.html";
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
        // that.attr('disabled', 'disabled');
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
                // that.removeAttr('disabled')
                that.css('pointer-events', '');
                clearInterval(timer);
            }
        }, 1000);

    });


});


var getUserOldPassword = function(callback) {
    $.ajax({
        url: '/user/queryUserMessage',
        type: 'get',
        dataType: 'json',
        data: {},
        success: function(data) {

            callback && callback(data);
        }
    });
};

var getCode = function(callback) {
    $.ajax({
        url: '/user/vCodeForUpdatePassword',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            callback && callback(data);
        }
    });


};
