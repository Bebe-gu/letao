$(function() {
    mui('.mui-scroll-wrapper').scroll({
        indicators: false //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });

    mui.init({
        pullRefresh: {
            container: '#pullrefresh',
            down: {
                auto: true,
                callback: function() {

                    var that = this;
                    /*获取地址栏方法*/
                    getProductData(LT.getParamsByUrl().productId, function(data) {
                        //console.log(data);
                        setTimeout(function() {
                            /*渲染*/
                            $('#detail').html(template('productTemplate', data));

                            /*初始化轮播图*/
                            var gallery = mui('.mui-slider');
                            gallery.slider({
                                interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
                            });
                            /*点击减号*/
                            $('.product_num').on('tap', '.jian', function(event) {
                                var value = $('#num').val();
                                if (value > 0) {
                                    value--;
                                    $('#num').val(value);
                                } else {
                                    value = 0;
                                }
                            });
                            /*点击加号*/
                            $('.product_num').on('tap', '.jia', function(event) {
                                var value = $('#num').val();

                                if (value < data.num) {
                                    value++;
                                    $('#num').val(value);
                                } else {
                                    mui.toast('库存不足');
                                    value = data.num;
                                }
                            });
                            /*尺码点击*/
                            $('.product_size').on('tap', 'span', function(event) {
                                $(this).addClass('active').siblings().removeClass('active');
                            });
                            /*点击加入购物车*/
                            $('.incart').on('tap', function(e) {
                                /*判断选择尺码和数量*/
                                if (!$('.product_size span').hasClass('active')) {
                                    mui.toast('没有选择尺码');
                                    return false;
                                }
                                if ($('input[type=text]').val() == 0) {
                                    mui.toast('没有选择数量');
                                    return false;
                                }

                                var productId = LT.getParamsByUrl().productId;
                                var size = $('.product_size span.active').text();
                                var num = $('input[type=text]').val();
                                var params = {
                                    productId: productId,
                                    num: num,
                                    size: size
                                };
                                /*添加购物车*/
                                addCart(params, function(data) {
                                    if (data.success) {
                                        mui.confirm('添加成功,去购物车看看?', '温馨提示', ['是', '否'], function(e) {
                                            if (e.index == 0) {
                                                location.href = 'cart.html';
                                            }
                                        });
                                    } else {
                                        /*验证登录*/
                                        LT.loginCheck(data);
                                    }
                                });
                            });
                            /*点击立即购买*/
                            //   TODO
                            /*结束刷新状态*/
                            that.endPulldownToRefresh();
                            that.refresh(true);
                        }, 1000);
                    });

                }
            }
        }
    });







}); //-----end $function

addCart = function(params, callback) {
    $.ajax({
        url: '/cart/addCart',
        type: 'post',
        dataType: 'json',
        data: params,
        success: function(data) {
            callback && callback(data);
        }
    });
}



var getProductData = function(productId, callback) {
    $.ajax({
        url: '/product/queryProductDetail',
        type: 'get',
        dataType: 'json',
        data: {
            id: productId
        },
        success: function(data) {
            callback && callback(data);
        }

    });
}
