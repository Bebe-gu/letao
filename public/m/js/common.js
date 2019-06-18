window.LT = {};
LT.loginUrl = '/m/login.html';
/*获取URL地址栏参数方法*/
LT.getParamsByUrl = function() {
    /*多个键值对转换成对象存取*/
    var params = {};
    var search = location.search;
    if (search) {
        search = search.substring(1);
        var arr = search.split('&');
        arr.forEach(function(value, index) {
            var arrList = value.split('=');
            params[arrList[0]] = arrList[1];
        });
    }
    //console.log(params);
    return params;
};

/*验证登录并跳转附带当前页URL*/
LT.loginCheck = function(data) {
    if (data.error == 400) {
        mui.toast(data.message);
        setTimeout(function() {
            location.href = LT.loginUrl + '?returnUrl=' + location.href;
        }, 2000);
    }
}
/*获取返回URL地址*/
LT.getReturnUrl = function() {
    /*判断是否有地址栏是否有returnUrl关键字*/
    var url = location.href;
    var index = location.href.indexOf('?');
    var returnUrl = url.substring(index + 11, url.length);
    //console.log(returnUrl);
    location.href = returnUrl;
}

/*传递带返回地址的URL*/


/*验证登录*/
/*if (data.error == 400) {
    mui.toast(data.message);
    setTimeout(function() {


    }, 2000);
}
*/

/*
 * 根据数组中对象数据获取索引
 * */
LT.getIndexFromId = function(arr, id) {
    var index = null;
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        if (item && item.id == id) {
            index = i;
            break;
        }
    }
    return index;
};
/*
 * 根据数组中对象数据ID获取索引
 * */
LT.getObjectFromId = function(arr, id) {
    var object = null;
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        if (item && item.id == id) {
            object = item;
            break;
        }
    }
    return object;
};
