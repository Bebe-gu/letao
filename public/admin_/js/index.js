$(function() {

    var myChart = echarts.init(document.getElementById('bar'));
    option = {
    	title: {
            text: '2017年注册人数',
            //subtext: '纯属虚构',
            x: 'left'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}"
        },
        legend: {
            orient: 'vertical',
            left: 'center',
            data: ['人数']
        },
        xAxis: {
            type: 'category',
            data: ['一月', '二月', '三月', '四月', '五月', '六月']
        },
        yAxis: {
            type: 'value'
        },

        series: [{
        	 name:'人数',
            data: [1200, 2000, 1500, 800, 700, 4000],
            type: 'bar'
        }]
    };

    myChart.setOption(option);

    var myChart2 = echarts.init(document.getElementById('pie'));
    option2 = {
        title: {
            text: '热门品牌销售',
            subtext: '2017年6月',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['耐克', '阿迪', '百伦', '安踏', '李宁']
        },
        series: [{
            name: '销售情况',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [{
                value: 335,
                name: '耐克'
            }, {
                value: 310,
                name: '阿迪'
            }, {
                value: 234,
                name: '百伦'
            }, {
                value: 135,
                name: '安踏'
            }, {
                value: 1548,
                name: '李宁'
            }],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    myChart2.setOption(option2);

});
