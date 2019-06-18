$(function() {
    /*区域滑动*/
    mui('.mui-scroll-wrapper').scroll({
        indicators: false //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
    /*轮播图*/
    var gallery = mui('.mui-slider');
    gallery.slider({
        interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
    });
});
