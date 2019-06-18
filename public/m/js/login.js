$(function() {

    $('.lt_login').on('tap', function(event) {

        if ($('input[name="username"]').val() == '') {
            mui.toast('请输入用户名');
            return false;
        }
        if ($('input[name="password"]').val() == '') {
            mui.toast('请输入密码');
            return false;
        }
        /*执行返回URL的ajax*/
        $.ajax({
            url: '/user/login',
            type: 'POST',
            data: $('form').serialize(),
            success: function(data) {
                /*验证用户名和密码*/
                if (data.error == 403) {
                    mui.toast(data.message);
                    return false;
                }
                /*判断是否有地址栏是否有returnUrl关键字*/
                if (location.href.indexOf('returnUrl') == -1) {
                    location.href = 'index.html';
                    return false;
                }
                LT.getReturnUrl();
            },
            error: function() {
                mui.toast('服务器繁忙');
            }
        });
    });




});
