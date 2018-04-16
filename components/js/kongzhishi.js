/** 控制室 */
var kongzhishi = {
    labels: [],
    data1: [],
    data2:[],
    realDataIntervals: [],
    ino: 13,
    timeGap: 24,
    start1: null,
    start2: null,
    end1: null,
    end2: null,
    init: function () {
        /** 给日期添加格式化的原型方法*/
        kongzhishi.funcs.updateDate()

        /** 初始化日期控件日期控件  todo当选择日期控件的日期后,会相应的把end1和end2中的值填满*/
        layui.use('laydate', function () {
            var laydate = layui.laydate
            laydate.render({
                elem: '#start1',//指定元素
                format: 'yyyy/MM/dd HH:mm:ss',
                done: function (value, date, endDate) {
                    kongzhishi.timeGap = Number($('#timeGapInp').val())
                    var date = kongzhishi.funcs.addHourAndRender(date, kongzhishi.timeGap)
                    var end1Val = date.Format("yyyy-MM-dd hh:mm:ss");
                    $('#end1').val(end1Val)
                }
            })
            laydate.render({
                elem: '#start2',  //指定元素
                format: 'yyyy/MM/dd HH:mm:ss',
                done: function (value, date, endDate) {
                    kongzhishi.timeGap = Number($('#timeGapInp').val())
                    var date = kongzhishi.funcs.addHourAndRender(date, kongzhishi.timeGap)
                    var end2Val = date.Format("yyyy-MM-dd hh:mm:ss");
                    $('#end2').val(end2Val)
                }
            })
        })
        /** 数据加载 */
        kongzhishi.funcs.bindSelectChangeEvent($('#model-li-hide-15-select'))
        /** 点击一二级菜单会清空intervals的事件绑定 */
        kongzhishi.funcs.bindClearInterval()
        /** 清除intervals */
        home.funcs.clearIntervals(kongzhishi.realDataIntervals)
        /** 初始化的图表 */
        kongzhishi.funcs.bindSubmitEvent($('#submitBtn'))
        /** 清除interval */
        home.funcs.clearIntervals(kongzhishi.realDataIntervals)
    },
    funcs: {
        updateDate: function () {
            Date.prototype.Format = function (fmt) { //author: meizz
                var o = {
                    "M+": this.getMonth() + 1, //月份
                    "d+": this.getDate(), //日
                    "h+": this.getHours(), //小时
                    "m+": this.getMinutes(), //分
                    "s+": this.getSeconds(), //秒
                    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                    "S": this.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                }
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;

            }
        },
        addHourAndRender: function (date, gap) {
            return new Date(date.year, date.month - 1, date.date, date.hours + gap, date.minutes, date.seconds)
        },
        bindSubmitEvent: function (submitBtn) {
            submitBtn.off('click')
            submitBtn.on('click', function () {
                kongzhishi.timeGap = $('#timeGapInp').val()
                kongzhishi.start1 = $('#start1').val()
                kongzhishi.start2 = $('#start2').val()
                kongzhishi.end1 = $('#end1').val()
                kongzhishi.end2 = $('#end2').val()
                console.log(kongzhishi.timeGap, kongzhishi.start1, kongzhishi.start2, kongzhishi.end1, kongzhishi.end2)
                if (!kongzhishi.timeGap || !kongzhishi.start1 || !kongzhishi.start2 || !kongzhishi.end1 || !kongzhishi.end2) {
                    alert('您的查询条件还没填写完整!')
                    return
                }
                /** 首先马上查询一次*/
                kongzhishi.funcs.loadDataAndRender()

                /** 接下来每30秒查询一次 */
                /** 开始间隔30秒获取数据 */
                kongzhishi.funcs.bindLoadDataEvent()
            })
        },
        bindClearInterval: function () {
            $('#menu3-li-15').on('click', function () {
                home.funcs.clearIntervals(kongzhishi.realDataIntervals)
                kongzhishi.funcs.bindLoadDataEvent()
            })
            $('.menus2').off('click')
            $('.menus2').on('click', function () {
                home.funcs.clearIntervals(kongzhishi.realDataIntervals)
            })
            $('.menus1').off('click')
            $('.menus1').on('click', function () {
                home.funcs.clearIntervals(kongzhishi.realDataIntervals)
            })
        },
        /** 每隔30秒查询一次 */
        bindLoadDataEvent: function () {
            kongzhishi.realDataIntervals.push(setInterval(function () {
                kongzhishi.funcs.loadDataAndRender()
            }, 3000))
        },
        bindSelectChangeEvent: function (select) {
            select.on('change', function () {
                // kongzhishi.ino = $(this).val()
                // kongzhishi.funcs.loadDataAndRender()
                console.log($(this).val())
            })
        },
        createChart: function (labels, data1, data2) {
            /** 创建曲线图 */
            var data = {
                //折线图需要为每个数据点设置一标签。这是显示在X轴上。
                /** 横坐标 */
                labels : labels,
                //数据集（y轴数据范围随数据集合中的data中的最大或最小数据而动态改变的）
                datasets: [
                    {
                        label: "时间段1能耗值曲线",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 5,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        spanGaps: true,
                        /** 纵坐标 */
                        data : data1
                    },
                    {
                        label: "时间段2能耗值曲线",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,100,192,0.4)",
                        borderColor: "rgba(75,140,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,140,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 5,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        spanGaps: true,
                        /** 纵坐标 */
                        data : data2
                    }
                ]
            };
            var ctx = document.getElementById("myChart").getContext("2d");
            var myChart = new Chart(ctx, {
                type: 'line',
                data: data
            })
        },
        fillLabelsAndData1: function (data) {
            kongzhishi.data1 = []
            kongzhishi.labels = []
            data.forEach(function (e) {
                kongzhishi.data1.push(e.ivalue)
                kongzhishi.labels.push(e.ihour)
            })

        },
        fillData2 : function(data) {
            kongzhishi.data2 = []
            data.forEach(function(e){
                kongzhishi.data2.push(e.ivalue)
            })
        },
        loadDataAndRender: function () {
            $.get(home.urls.energyMonitor.loadKongzhishiData(), {
                ino: kongzhishi.ino,
                startDateTime: new Date(kongzhishi.start1).getTime(),
                endDateTime: new Date(kongzhishi.end1).getTime()
            }, function (result) {
                /** 获取到数据后 */
                /** 首先填满数据 */
                kongzhishi.funcs.fillLabelsAndData1(result.data)
            })
            $.get(home.urls.energyMonitor.loadKongzhishiData(), {
                ino: kongzhishi.ino,
                startDateTime: new Date(kongzhishi.start2).getTime(),
                endDateTime: new Date(kongzhishi.end2).getTime()
            }, function (result) {
                kongzhishi.funcs.fillData2(result.data)
            })
            var time = setTimeout(function() {
                // console.log(kongzhishi.data1)
                // console.log(kongzhishi.data2)
                kongzhishi.funcs.createChart(kongzhishi.labels, kongzhishi.data1,kongzhishi.data2)
                clearTimeout(time)
            },1000) //这里必须设置一个时间阈值，要不然可能数据还没有完全加载好
        }
    }
}
