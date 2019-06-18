$(function() {
    var cityPicker = new mui.PopPicker({
        layer: 3
    });
    cityPicker.setData(cityData);

    /*获取页面参数*/
    var addressId = LT.getParamsByUrl().addressId;
    var recipients = $('input[name="recipients"]');
    var postCode = $('input[name="postCode"]');
    var address = $('input[name="address"]');
    var addressDetail = $('textarea[name="addressDetail"]');


    /*获取地址信息到页面*/
    if (addressId) {
        getAddressData(function(data) {
            $('.lt_topBar .title').text('修改收货地址')
            var resultData = LT.getObjectFromId(data, addressId);
            recipients.val(resultData.recipients);
            postCode.val(resultData.postCode);
            address.val(resultData.address);
            addressDetail.val(resultData.addressDetail);
        });
    } else {
        $('.lt_topBar .title').text('增加收货地址');
    }

    /*点击修改提交地址*/
    $('.lt_confirm').on('tap', function(event) {
        /*封装Data数据参数*/
        var data = {
                recipients: $.trim($('input[name="recipients"]').val()),
                postcode: $.trim($('input[name="postCode"]').val()),
                address: $.trim($('input[name="address"]').val()),
                addressDetail: $.trim($('textarea[name="addressDetail"]').val()),
            }
            /*验证输入为空*/
        if (!data.recipients) {
            mui.toast("请填写收货人");
            return false;
        }

        if (!/^\d{6}$/.test(data.postcode)) {
            mui.toast("请正确填写邮编");
            return false;
        }
        if (!data.address) {
            mui.toast("请选择地址");
            return false;
        }
        if (!data.addressDetail) {
            mui.toast("请填写详细地址");
            return false;
        }

        /*增加收货地址*/
        if (!addressId && $('.lt_topBar .title').text('增加收货地址')) {
            console.log(data);
            $.ajax({
                url: '/address/addAddress',
                type: 'post',
                dataType: 'json',
                data: data,
                success: function(data) {
                    if (data.success) {
                        $('.lt_confirm').text('正在提交...');
                        mui.toast('添加成功');
                        setTimeout(function() {

                            location.href = "address.html";
                        }, 2000);

                    } else {
                        mui.toast('服务器繁忙');
                    }
                }
            });
        }
        if (addressId && $('.lt_topBar .title').text('修改收货地址')) {
            /*修改收货地址*/
            data.id = addressId;
            console.log(data);
            $.ajax({
                url: '/address/updateAddress',
                type: 'post',
                dataType: 'json',
                data: data,
                success: function(data) {
                    if (data.success) {
                        $('.lt_confirm').text('正在提交...');
                        mui.toast('修改成功');
                        setTimeout(function() {

                            location.href = "address.html";
                        }, 2000);
                    } else {
                        mui.toast('服务器繁忙');
                    }
                }
            });
        }
    });

    /*多级选择城市*/
    $('#addressInput').on('tap', function(event) {
        cityPicker.show(function(items) {
            if (items[0].text == items[1].text) {
                items[0].text = '';
            }
            $('[name="address"]').val(items[0].text + items[1].text + (items[2].text || ''));
            //返回 false 可以阻止选择框的关闭
        });
    });


});
/*获取地址信息*/
var getAddressData = function(callback) {
    $.ajax({
        url: '/address/queryAddress',
        type: 'get',
        dataType: 'json',
        data: {},
        success: function(data) {
            callback && callback(data);

        }
    });

};
