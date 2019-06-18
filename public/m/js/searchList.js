$(function() {
    // mui('#pullrefresh').pullRefresh().refresh(true);
    mui('.mui-scroll-wrapper').scroll({
        indicators: false //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });

    /*获取关键字*/
    var urlParams = LT.getParamsByUrl();
    $('.search_input').val(urlParams.key || '');

    /*页面加载初始化列表数据*/
    // getSearchData({
    //     proName: urlParams.key,
    //     page: 1,
    //     pageSize: 4
    // }, function(data) {
    //     //console.log(data);
    //     var html = template('productTemplate', data);
    //     $('.lt_product ul').html(html);
    // });

    /*输入关键字重新搜索*/
    $('.search_btn').on('tap', function(event) {
        var key = $.trim($('.search_input').val());
        if (!key) {
            mui.toast('请输入关键字', {
                duration: 'short',
                type: 'div'
            });
            return false;
        }
        getSearchData({
            proName: key,
            page: 1,
            pageSize: 4
        }, function(data) {
            var html = template('productTemplate', data);
            $('.lt_product ul').html(html);
        });
    });

    /*排序*/
    $('.orderby a').on('tap', function(event) {

        var $this = $(this);
        /*切换改变箭头样式*/
        if ($this.hasClass('active')) {
            /*改变降序选择样式*/
            $this.addClass('active').siblings().removeClass('active');
            if ($this.find('span').hasClass('fa-angle-down')) {
                $this.find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
            } else {
                $this.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
        }
        /*改变降序选择样式*/
        if (!$this.hasClass('active')) {
            $this.addClass('active').siblings().removeClass('active');
            $this.siblings().find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
        }
        /*获取参数传递后台查询*/
        if ($this.hasClass('active')) {
            var key = $.trim($('.search_input').val());
            if (!key) {
                mui.toast('请输入关键字', {
                    duration: 'short',
                    type: 'div'
                });
                return false;
            }
            /*保持排序状态*/
            var type = $this.data('type');
            var orderby = $this.find('span').hasClass('fa-angle-up') ? 1 : 2;
            var params = {
                proName: key,
                page: 1,
                pageSize: 4,
                // type: orderby
            };

            /*传递参数对象中多添加一个属性*/
            params[type] = orderby;
            getSearchData(
                params,
                function(data) {
                    var html = template('productTemplate', data);
                    $('.lt_product ul').html(html);
                });
        }
    });

    /*下拉刷新*/
    mui.init({
        pullRefresh: {
            container: '#pullrefresh',
            down: {
                auto: true,
                callback: function() {
                    var that = this;
                    var key = $.trim($('.search_input').val());
                    if (!key) {
                        mui.toast('请输入关键字', {
                            duration: 'short',
                            type: 'div'
                        });
                        return false;
                    }
                    /*重置排序*/
                    $('.orderby a').removeClass('active').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
                    /*获取数据*/
                    getSearchData({
                        proName: key,
                        page: 1,
                        pageSize: 4
                    }, function(data) {
                        setTimeout(function() {
                            var html = template('productTemplate', data);
                            $('.lt_product ul').html(html);
                            /*结束刷新状态*/
                            that.endPulldownToRefresh();
                            that.refresh(true);
                        }, 1000);
                    });
                }
            },
            /*上拉加载*/
            up: {
                contentrefresh: '正在加载...',
                contentnomore: '没有更多数据了',
                callback: function() {
                    var that = this;
                    var key = $.trim($('.search_input').val());
                    if (!key) {
                        mui.toast('请输入关键字', {
                            duration: 'short',
                            type: 'div'
                        });
                        return false;
                    }
                    /*保持排序状态*/
                    var type = $('.orderby a.active').data('type');
                    var orderby = $('.orderby a.active').find('span').hasClass('fa-angle-up') ? 1 : 2;

                    /*传递参数对象中多添加一个属性*/
                    window.page++;
                    var params = {
                        proName: key,
                        page: window.page,
                        pageSize: 4
                    };
                    params[type] = orderby;
                    /*获取数据*/
                    getSearchData(params, function(data) {
                        setTimeout(function() {
                            if (data.data.length) {
                                that.endPullupToRefresh();

                            } else {
                                that.endPullupToRefresh(true);
                            }
                            var html = template('productTemplate', data);
                            $('.lt_product ul').append(html);
                            /*结束刷新状态*/
                            setTimeout(function() {
                                that.endPullupToRefresh().refresh(true);
                            }, 4000);

                        }, 1000);

                    });
                }
            }
        }
    });

}); //----end $function

/*获取商品数据函数*/
var getSearchData = function(params, callback) {
    $.ajax({
        url: '/product/queryProduct',
        type: 'get',
        dataType: 'json',
        data: params,
        success: function(data) {
            window.page = data.page;
            callback && callback(data);

        }
    });

}
