$(function() {

    mui.init({
        pullRefresh: {
            container: "#refreshContainer", //
            down: {
                auto: true,
                callback: function() {
                    var that = this;
                    setTimeout(function() {
                        queryCartData(function(data) {
                            LT.loginCheck(data);
                            LT.getReturnUrl();
                            //console.log(data);
                            /*将后台数据data保存在window下的data中,再通过参数data(对象格式)传到前台渲染*/
                            window.data = data;
                            $('#cartList').html(template('cartTemplate', {
                                data: window.data
                            }));

                            /*计算价格*/
                            var sum = 0;
                            $('input[type="checkbox"]').on('change', function() {
                                // /*单个商品总价*/
                                // $(this).prop('checked')
                                //     /*判断选择状态 选择加 否则减*/
                                // var num = $(this).parent().find('.price').find('span:last-of-type')
                                // console.log(num.text());;
                                // sum += parseFloat($(this).prop('checked') ? $(this).val() : -$(this).val());
                                setAmount();



                            });
                            /*点击减号*/
                            $('body').on('tap', '.jian', function(event) {
                                var value = $('#num').val();
                                if (value > 0) {
                                    value--;
                                    $('#num').val(value);
                                } else {
                                    value = 0;
                                }
                            });
                            /*点击加号*/
                            $('body').on('tap', '.jia', function(event) {
                                var value = $('#num').val();
                                if (value < $('#num').data('max')) {
                                    value++;
                                    $('#num').val(value);
                                } else {
                                    mui.toast('库存不足');
                                    value = $('#num').data('max');
                                }

                            });
                            /*尺码点击*/
                            $('body').on('tap', '.btn-size', function(event) {
                                $(this).addClass('active').siblings().removeClass('active');
                            });



                            /*点击编辑按钮修改商品*/
                            $('body').on('tap', '.btn-edit', function(e) {
                                var li = this.parentNode.parentNode;
                                e.detail.gesture.preventDefault();
                                /*初始化弹窗的html*/
                                var resultData = LT.getObjectFromId(window.data, $(this).data('id'));
                                console.log($(this).data('id'));
                                // console.log(resultData);
                                var html = template('confirmTemplate', resultData).replace(/\n/g, '');
                                console.log(html);
                                mui.confirm(html, '编辑商品', ['确定', '取消'], function(e) {
                                    if (e.index == 0) {
                                        var params = {
                                            id: resultData.id,
                                            size: $('.btn-size.active').text(),
                                            num: parseInt($('#num').val())
                                        };
                                        if (!params.size) {
                                            mui.toast('请选择尺码');
                                            return false;
                                        }
                                        if (!params.num) {
                                            mui.toast('请选择数量');
                                            return false;
                                        }
                                        // console.log(params);
                                        updateCart(params, function(data) {
                                            if (data.success) {
                                                mui.toast('编辑成功');

                                                mui.swipeoutClose(li);
                                                // var resultData = LT.getObjectFromId(window.data, $('.btn-edit').data('id'));
                                                // resultData.num = params.num;
                                                // resultData.size = params.size;

                                                /*合并两组数据，并修改第一个对象的数据*/
                                                $.extend(resultData, params);
                                                //console.log($('.btn-edit').data('id'));
                                                // $('#cartList').html(template('cartTemplate', {
                                                //     data: window.data
                                                // }));
                                                $(li).find('.price span:last-of-type').html('x' + params.num + '双');
                                                $(li).find('.size').html('鞋码：' + params.size);
                                                setAmount();
                                            } else {
                                                mui.toast(data.message);
                                            }

                                        });

                                    }
                                });
                            });

                            /*点击滑块删除按钮*/
                            $('body').on('tap', '.btn-delete', function(event) {
                                var id = $(this).data('id');
                                var li = this.parentNode.parentNode;
                                mui.confirm('确定要删除这件商品吗？', '温馨提示', ['确定', '取消'], function(e) {
                                    if (e.index == 0) {
                                        // console.log(id);
                                        deleteCart({
                                            id: id
                                        }, function(data) {
                                            if (data.success) {
                                                li.parentNode.removeChild(li);
                                                // console.log(data);
                                                mui.toast('删除成功');
                                                setAmount();
                                            } else {
                                                mui.toast('data.message');
                                            }
                                        });
                                    } else {
                                        mui.swipeoutClose(li);
                                    }
                                });
                            });
                        });
                        that.endPulldownToRefresh();
                        that.refresh(true);
                    }, 2000);
                }
            }
        }
    });
    /*刷新按钮*/
    $('.icon_refresh').on('tap', function(event) {
        var that = this;
        setTimeout(function() {
            queryCartData(function(data) {


                /*将后台数据data保存在window下的data中,再通过参数data(对象格式)传到前台渲染*/
                window.data = data;
                $('#cartList').html(template('cartTemplate', {
                    data: window.data
                }));
            });
            that.endPulldownToRefresh();
            that.refresh(true);
        }, 2000);
    });
});
var queryCartData = function(callback) {
    $.ajax({
        url: '/cart/queryCart',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            callback && callback(data);
        }
    });

}

var updateCart = function(params, callback) {
    $.ajax({
        url: '/cart/updateCart',
        type: 'post',
        dataType: 'json',
        data: params,
        success: function(data) {
            callback && callback(data);
        }
    });
};

var deleteCart = function(params, callback) {

    $.ajax({
        url: '/cart/deleteCart',
        type: 'get',
        dataType: 'json',
        data: params,
        success: function(data) {
            callback && callback(data);
        }
    });
}

var setAmount = function() {
    var sum = 0;
    var checkedBox = $('[type=checkbox]:checked');

    checkedBox.each(function(i, item) {
        var id = $(checkedBox[i]).data('id');
        // console.log(id);
        var item = LT.getObjectFromId(window.data, id);
        var num = item.num;
        var price = item.price;
        var amount = num * price;
        sum += amount;
    });
    sum = Math.floor(sum * 100) / 100
    $('.order_form span:last-of-type').text(sum);
    if (sum == 0) {
        $('.order_form span:last-of-type').text('0.00');
    }

};
