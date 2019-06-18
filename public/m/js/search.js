$(function() {
    /*获取localStorage中是否有历史记录*/
    var historyList = localStorage.getItem('historyList') || '[]';
    /*转换数据为js对象格式*/
    var historyListArray = JSON.parse(historyList);

    /*遍历数组,渲染到页面*/
    var showHistoryList = function() {
        var html = "";
        historyListArray.forEach(function(item, i) {
            html += '<li><a data-index="' + i + '">' + item + '</a><span class="icon_delete fa fa-close"></span></li>';
        });
        /*没有记录*/
        html = html || '<li><a>没有搜索记录</a></li>';
        $('.historyBox').html(html);
    }

    showHistoryList();

    /*点击搜索更新历史记录*/
    $('.search_btn').on('tap', function(event) {
        var key = $.trim($('.search_input').val());
        if (!key) {
            mui.toast('请输入关键字', {
                duration: 'short',
                type: 'div'
            });
            return false;
        }
        /*跳转搜索列表页面*/
         location.href = 'searchList.html?key=' + key;

        /*历史记录名称不重复*/
        if (historyListArray.indexOf(key) == -1) {
            /*追加记录到数组*/
            historyListArray.push(key);
        }
        //console.log(historyListArray.indexOf(key));

        /*转换成Json数据并存取*/
        localStorage.setItem('historyList', JSON.stringify(historyListArray));
        /*渲染*/
        showHistoryList();
        $('.search_input').val('');
    });

    /*删除记录*/
    $('.historyBox').on('tap', '.icon_delete', function(event) {

        var index = $(this).prev().data('index');
        historyListArray.splice(index, 1);
        localStorage.setItem('historyList', JSON.stringify(historyListArray));
        showHistoryList();
    });

    /*清空记录*/
    $('.history_clean a').on('tap', function(event) {
        /*清空*/
        historyListArr = [];
        /*慎用  清空网上的所有本地存储*/
        //localStorage.clear();
        //localStorage.removeItem('historyList');
        localStorage.setItem('historyList', '');
        showHistoryList();
    });

    /*点击历史记录中的文字添加到搜索框*/
    $('.historyBox').on('tap', 'a', function(event) {
        $('.search_input').val($(this).text());

    });

   

}); //-----end $function
