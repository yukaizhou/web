var art_manage = {
    init: function () {
        art_manage.funcs.renderTable()
        var out = $('#art_manage_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#art_manage_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
    funcs: {
        renderTable: function () {
            $.post(home.urls.productOrder.getAllByPage(), {}, function (res) {
                var $tbody = $("#art_manage_table").children('tbody')
                var items = res.data.content
                //console.log(items)
                art_manage.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                art_manage.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'art_manage_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.productOrder.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#art_manage_table").children('tbody')
                                art_manage.funcs.renderHandler($tbody, items)
                                art_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            art_manage.funcs.bindDetailEventListener($('.detail'))
            art_manage.funcs.bindEditorEventListener($('.editor'))
            art_manage.funcs.bindDeleteEventListener($('.delete'))

            art_manage.funcs.bindAddEvent($('#model_li_hide_add_26'))
            art_manage.funcs.bindDeleteEvent($('#model_li_hide_delete_26'))

            var refreshBtn = $('#model_li_hide_refresh_26');
            art_manage.funcs.bindRefreshEventListener(refreshBtn);

            //追加搜索事件
            var searchBtn = $('#model_li_hide_search_26')
            art_manage.funcs.bindSearchEventListener(searchBtn)

            var checkedBoxLen = $('.art_manage_checkbox:checked').length
            home.funcs.bindSelectAll($("#art_manage_checkAll"),$(".art_manage_checkbox"),checkedBoxLen,$("#art_manage_table"))

        }
        , renderHandler: function ($tbody, items) {
            $tbody.empty() //清空表格
            console.log(items)
            items.forEach(function (e) {
                var code = e.code
                var content = (
                    "<tr>" +
                    "<td><input type='checkbox' class='art_manage_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.code) + "</td>" +
                    "<td>" + e.batchNumber + "</td>" +
                    "<td>" + (e.productLineCode?e.productLineCode.name:'')+ "</td>" +
                    "<td>" + (e.inputPlan) + "</td>" +
                    "<td>" + (new Date(e.inputDate).Format('yyyy-MM-dd')) + "</td>" +
                    "<td>" + (e.serialNumber) + "</td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "<td><a href=\"#\" class='editor' id='editor-" + (code) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                    "<td><a href=\"#\" class='delete' id='delete-" + (code) + "'><i class='fa fa-times-circle-o'></a></td>" +
                    "</tr>"
                )
                $tbody.append(content)
                art_manage.funcs.bindDetailEventListener($('.detail'))
                art_manage.funcs.bindEditorEventListener($('.editor'))
                art_manage.funcs.bindDeleteEventListener($('.delete'))
               
                var checkedBoxLen = $('.art_manage_checkbox:checked').length
                home.funcs.bindSelectAll($("#art_manage_checkAll"),$(".art_manage_checkbox"),checkedBoxLen,$("#art_manage_table"))

            })

        }

        , bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $.post(home.urls.productOrder.getById(), {
                   code:code
                }, function (result) {
                    var items = result.data //获取数据
                    const div = $("#detail_modal")
                    console.log(items)
                    art_manage.funcs.fill_detail_data(div,items)

                })
                layer.open({
                    type: 1,
                    title: '新增工艺单',
                    content: $("#detail_modal"),
                    area: ['1000px', '700px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        },
        fill_detail_data: function(div,items){
            $("#task_name").text(items.code)
            $("#make_batch").text(items.batchNumber)
            $("#make_man").text(items.compactor.name)
            $("#product_num").text(items.productLineCode.code)
            $("#audit_man").text(items.auditor.name)
            $("#plan_amount").text(items.inputPlan)
            $("#exec_man").text(items.executor.name)
            $("#in_date").text(items.inputDate?new Date(items.inputDate).Format('yyyy-MM-dd'):'null')
            $("#pinguan").text(items.qc.code)
            $("#make_num").text(items.serialNumber)

            $("#t1").text(items.presomaCode)
            $("#t2").text(items.presomaContent)
            $("#t3").text(items.presomaRatio)
            $("#t4").text(items.lithiumCode)
            $("#t5").text(items.lithiumContent)
            $("#t6").text(items.lithiumRatio)
            $("#t7").text(items.additiveCode)
            $("#t8").text(items.targetLithium)
            $("#t9").text(items.additiveWeight)
            
            $("#t11").text(items.presomaWeight)
            $("#t12").text(items.lithiumWeight)
            $("#t13").text(items.mixFrequency)
            $("#t14").text(items.mixDate?new Date(items.mixDate).Format('yyyy-MM-dd'):'null')
            $("#t15").text(items.mixRequirements)
            $("#t16").text(items.presinteringDetection)
            $("#t17").text(items.presinteringPlan)
            $("#t18").text(items.presinteringParameter)
            $("#t19").text(items.mixRequirements)
        },
        bindEditorEventListener:function(editBtns) {
            editBtns.off('click').on('click',function() {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $.post(home.urls.productOrder.getById(), {
                   code:code
                }, function (result) {
                    var items = result.data //获取数据
                    const div = $("#editor_modal")
                    console.log(items)
                    art_manage.funcs.fill_editor_data(div,items)

                
                layer.open({
                    type:1,
                    title:'新增工艺单',
                    content:$("#editor_modal"),
                    area:['900px','700px'],
                    btn:['保存','提交','返回'],
                    offset:"auto",
                    closeBtn:0,
                    yes: function(index) {
                        $("#editor_modal").css('display', 'none')
                        layer.close(index)
                    }
                    ,btn2: function(index) {
                        $("#editor_modal").css('display', 'none')
                        layer.close(index)
                    }
                    ,btn3: function(index) {
                        $("#editor_modal").css('display', 'none')
                        layer.close(index)
                    }
                })
            })
        })
        }
        ,fill_editor_data: function(div,items){
            $("#task_name1").val(items.code)
            $("#make_batch1").val(items.batchNumber)
            $("#make_man1").append("<option value="+items.compactor.code+">"+items.compactor.name+"</option>")
            //$("#make_man1").val(items.compactor.name)
            $("#product_num1").val(items.productLineCode.code)
            //$("#audit_man1").val(items.auditor.name)
            $("#audit_man1").append("<option value="+items.auditor.code+">"+items.auditor.name+"</option>")
            $("#plan_amount1").val(items.inputPlan)
            $("#exec_man1").append("<option value="+items.executor.code+">"+items.executor.name+"</option>")
        
            $("#in_date1").val(items.inputDate?new Date(items.inputDate).Format('yyyy-MM-dd'):'null')
           // $("#pinguan1").val(items.qc.code)
            $("#pinguan1").append("<option value="+items.qc.code+">"+items.qc.name+"</option>")
            $("#make_num1").val(items.serialNumber)

            $("#t11").val(items.presomaCode)
            $("#t21").val(items.presomaContent)
            $("#t31").val(items.presomaRatio)
            $("#t41").val(items.lithiumCode)
            $("#t51").val(items.lithiumContent)
            $("#t61").val(items.lithiumRatio)
            $("#t71").val(items.additiveCode)
            $("#t81").val(items.targetLithium)
            $("#t91").val(items.additiveWeight)
            
            $("#t111").val(items.presomaWeight)
            $("#t121").val(items.lithiumWeight)
            $("#t131").val(items.mixFrequency)
            $("#t141").val(items.mixDate?new Date(items.mixDate).Format('yyyy-MM-dd hh:mm:ss'):'null')
            $("#t151").val(items.mixRequirements)
            $("#t161").val(items.presinteringDetection)
            $("#t171").val(items.presinteringPlan)
            $("#t181").val(items.presinteringParameter)
            $("#t191").val(items.mixRequirements)
            $.get(servers.backup()+'user/getAll',{},function(result){
                var user = result.data
                user.forEach(function(e){
                    if(items.compactor.code!=e.code){
                        $("#make_man1").append("<option value="+e.code+">"+e.name+"</option>")
                    }
                    if(items.auditor.code!=e.code){
                        $("#audit_man1").append("<option value="+e.code+">"+e.name+"</option>")
                    }
                    if(items.executor.code!=e.code){
                        $("#exec_man1").append("<option value="+e.code+">"+e.name+"</option>")
                    }
                    if(items.qc.code!=e.code){
                        $("#pinguan1").append("<option value="+e.code+">"+e.name+"</option>")
                    }
                })
            })
        }
        ,bindDeleteEventListener:function(deleteBtn){
            deleteBtn.off('click').on('click',function(){
                var _this = $(this)
                layer.open({
                    type:1,
                    title:'删除',
                    content:"<h5 style='text-align:center;padding-top:8px'>确认要删除该记录吗?</h5>",
                    area:['180px','130px'],
                    btn:['确认','取消'],
                    offset:['40%','55%'],
                    yes:function(index) {
                        var Code = _this.attr('id').substr(7)
                        $.post(home.urls.productOrder.deleteByCode(), {
                            code: Code
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    pro_out_manage.init()
                                    clearTimeout(time)
                                }, 500)
                            }
                            layer.close(index)
                        })
                    },
                    btn2: function (index) {
                        layer.close(index)
                    }
                })
            })
        }
        ,bindAddEvent:function(addBtn){
            addBtn.off('click').on('click',function(){
                layer.open({
                    type:1,
                    title:"新增工艺单",
                    content:$("#editor_modal"),
                    area:['900px','700px'],
                    btn:['提交','取消'],
                    offset:'auto',
                    closeBtn:0,
                    yes:function(index) {

                        $("#editor_modal").css('display','none')
                        layer.close(index)
                    }
                    ,btn2:function(index){
                        $("#editor_modal").css('display','none')
                        layer.close(index)
                    }
                })
            })
        }
        ,bindDeleteEvent:function(deleteBtn){
            deleteBtn.off('click').on('click',function(){
                if($('.plate_audit_checkbox:checked').length === 0) {
                    layer.msg('您还没有选中任何数据!',{
                        offset:['40%','55%'],
                        time:700
                    })
                }
                else {
                    layer.open({
                        type:1,
                        title:'批量删除',
                        content:"<h5 style='text-align: center;padding-top: 8px'>您确认要删除所有记录吗?</h5>",
                        area:['190px','130px'],
                        btn:['确认','取消'],
                        offset:['40%','55%'],
                        yes:function(index){
                            $('.plate_audit_checkbox').each(function() {
                                if($(this).prop('checked')) {
                                    plate_audit_codes.push({code:$(this).val()})
                                }
                            })
                            $.ajax({
                                url: home.urls.productOut.deleteByCodeBatch(),
                                contentType: 'application/json',
                                data: JSON.stringify(plate_audit_codes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            plate_audit.init()
                                            clearTimeout(time)
                                        }, 500)
                                    }
                                    layer.msg(result.message, {
                                        offset: ['40%', '55%'],
                                        time: 700
                                    })
                                }
                            })
                            layer.close(index)
                        } ,
                        btn2: function (index) {
                            layer.close(index)
                        }
                    })
                }
            })
        }
        ,bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {
                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    art_manage.init()
                    $('#input_batch_num').val('')
                    layer.close(index)
                    clearTimeout(time)
                }, 200)

            })
        },
        bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var batch_num = $('#input_batch_num').val()
                $.post(home.urls.productOrder.getByBatchNumberLikeByPage(), {
                    batchNumber: batch_num
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    const $tbody = $("#art_manage_table").children('tbody')
                    art_manage.funcs.renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'art_manage_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.productOrder.getByBatchNumberLikeByPage(), {
                                    batchNumber: batch_num,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
                                    const $tbody = $("#art_manage_table").children('tbody')
                                    art_manage.funcs.renderHandler($tbody, items)
                                    art_manage.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }

    }
}