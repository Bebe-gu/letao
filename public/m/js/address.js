$(function() {

    mui.init({
        pullRefresh: {
            container: '#pullrefresh',
            down: {
                auto: true,
                callback: function() {
                    var that = this;
                    /*渲染*/
                    queryAddress(function(data) {
                        /*验证登录状态*/
                        if (data.error == 400) {
                            mui.toast(data.message);
                            setTimeout(function() {
                                location.href = LT.loginUrl;
                            }, 2000);
                        }
                        /*渲染*/
                        $('#address').html(template('addressTemplate', {
                            data: data
                        }));
                    });
                    /*删除按钮绑定事件*/
                    $('#address').on('tap', '.delBtn', function(event) {
                        var id = $(this).data('id');
                        deleteAddress(id, function(data) {
                            if (data.success) {
                                mui.toast('删除成功');
                                queryAddress(function(data) {
                                    $('#address').html(template('addressTemplate', {
                                        data: data
                                    }));
                                });
                            }
                        });

                    });
                    /*结束刷新状态*/
                    that.endPulldownToRefresh();
                    that.refresh(true);
                }
            }
        }
    });


});

var queryAddress = function(callback) {
    $.ajax({
        url: '/address/queryAddress',
        type: 'get',
        data: {},
        dataType: 'json',
        success: function(data) {
            callback && callback(data);
        }
    });


}

var deleteAddress = function(id, callback) {
    $.ajax({
        url: '/address/deleteAddress',
        type: 'post',
        data: {
            id
        },
        dataType: 'json',
        success: function(data) {
            callback && callback(data);
        }
    });
}
