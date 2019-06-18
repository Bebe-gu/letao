$(function() {
    getFirstCategoryData(function(data) {
        /*一级分类渲染*/
        $('.cate_left ul').html(template('first-template', data));
        /*通过一级分类的data-id 查询对应的二级分类 */
        var categoryId = $('.cate_left ul:first-child').find('a').data('id');
        render(categoryId);
    });

    /*点击一级分类加载对应二级分类,一级需在渲染之后执行，或者委托ul执行*/
    $('.cate_left').on('tap', 'a', function() {
    	/*当前如果有active状态就不去加载选中样式*/
    	if ($(this).parent().hasClass('active')) return false;
    	/*样式选中样式*/
        $('.cate_left ul li').removeClass('active');
        $(this).parent().addClass('active');
        var categoryId = $(this).data('id');
        render(categoryId);
    });

}); //-----$function end

/*获取一级分类*/
var getFirstCategoryData = function(callback) {
        $.ajax({
            url: '/category/queryTopCategory',
            type: 'get',
            data: '',
            dataType: 'json',
            success: function(data) {
                callback && callback(data);
            }
        });
    }
    /*获取二级参数，params= {id:1}*/
var getSecondCategoryData = function(params, callback) {
    $.ajax({
        url: '/category/querySecondCategory',
        type: 'get',
        data: params,
        dataType: 'json',
        success: function(data) {
            callback && callback(data);
        }
    });
}

/*渲染二级分类方法*/
var render = function(categoryId) {
    getSecondCategoryData({
        id: categoryId
    }, function(data) {
        /*二级分类渲染*/
        $('.cate_right ul').html(template('second-template', data));
    });
}
