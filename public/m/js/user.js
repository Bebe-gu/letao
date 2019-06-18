$(function() {


    /*查询用户信息*/
    $.ajax({
        url: '/user/queryUserMessage',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            /*验证登录状态*/
            if (data.error == 400) {
                mui.toast(data.message);
                setTimeout(function() {
                    location.href = LT.loginUrl;
                }, 2000);
            }
            //console.log(data);
            /*渲染*/
            setTimeout(function() {
                $('#username').text(data.username);
                $('#mobile span').text(data.mobile);
            }, 1000);


        }
    });


    $('.lt_login_out').on('tap', function(event) {
        $.ajax({
            url: '/user/logout',
            type: 'get',
            dataType: 'json',
            success: function(data) {
               console.log(data);
            },
            error: function() {
                mui.toast('操作失败');
            }
        });


    });


});
