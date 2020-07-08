
"use strict";
$(function() {
	// 数据字典
	var dicConf = [ 'sdp_system','sdp_schedule_task_sts','sdp_task_run_sts','sdp_task_do_type' ];
	var context = new SDP.SDPContext();
	var tasks = context.newDataStore("tasks");
	tasks.$keyField = "taske_code";
	var page = tasks.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);

	tasks.$queryUrl = "/api/common/selectList";
	tasks.statement = "SDP-TASK-001";
	
	var rules = {
			cron_exp : [ {
				required : true,
				message : '请输入时间表达式',
				trigger : 'blur'
			}, {
				max : 80,
				message : '长度在 0到80个字符',
				trigger : 'blur'
				
			} ],
			do_content : [{
				required : true,
				trigger : 'blur',
				message : '请输入参数'
			},{
				max : 80,
				message : '长度在 0到80个字符',
				trigger : 'blur'
			} ]
		};
	
	var cols = [
			{
				title : '调度编码',
				key : 'task_code',
				width : 160
			},{
				title : '调度名称',
				key : 'task_name',
				width : 160
			},{
				title : '调度描述',
				key : 'task_remark',
				width : 180
			},{
				title : '调度状态',
				key : 'task_sts',
				width : 80,
				format:function(row,val){
					return pageVue.stsFormat('sdp_schedule_task_sts', row,
					'task_sts');
				}
			},{
				title : '时间表达式',
				key : 'cron_exp',
				width : 120,
			},{
				title : '运行状态',
				key : 'run_sts',
				width : 100,
				format:function(row,val){
					return pageVue.stsFormat('sdp_task_run_sts', row,
					'run_sts');
				}
			},{
				title : '执行类型',
				key : 'do_type',
				width : 140,
				format:function(row,val){
					return pageVue.stsFormat('sdp_task_do_type', row,
					'do_type');
				}
			}, {
				title : '执行参数' ,
				key : 'do_content',
				width : 160
			}, {
				title : '系统类型' ,
				key : 'system_code',
				width : 110,
				format:function(row,val){
					return pageVue.stsFormat('sdp_system', row,
					'system_code');
				}
			}, {
				title : '任务分组',
				key :'task_group',
				width :110
			},{
				title : '运行服务器',
				key : 'server_ip',
				width :140
			},{
				title : '创建时间',
				key : 'create_date',
				width :140
			},{
				title : '创建人',
				key : 'create_user',
				width :110
			},{
				title : '修改时间',
				key : 'update_date',
				width :140
			},{
				title : '修改人',
				key : 'update_user',
				width :110
			}, {
				title : '操作',
				key : 'action',
				align : 'left',
				width : 160,
				fixed : 'right',
				type : 'render',
				render : actionRender
			}];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				task_code : '',
				task_name : '',
				do_type : '',
				system_code:''
			},
			datas : [],
			page : page,
			dicDatas : {},
			dicMaps : {},
			curRow : {},
			columns : cols,
			dataEdit : false,
			rules : rules
		}
	};

	var methods_page = page_conf.methods = {};
	
	// 点击查询按钮
	methods_page.searchDatas=function(){
		page.setPageNumber(1);
		this.queryDatas();
	};
	// 查询
	methods_page.queryDatas = function() {
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var g = this;
		var loading = layer.load();
		tasks.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = tasks.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};
	
	// 改变当前页号
	methods_page.handleCurrentChange = function(val) {
		page.setPageNumber(val);
		if (page.getIsChange()) {
			this.queryDatas();
		}
	};
	// 改变页大小
	methods_page.handleSizeChange = function(val) {
		page.setPageRowCount(val);
		if (page.getIsChange()) {
			this.queryDatas();
		}
	};
	
	// 禁用调度任务
	methods_page.disableRow = function(row) {
		var g=this;
		var tindex = layer.confirm('是否禁用调度任务[' + row.task_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			console.log(context);
			context.doAction({
				params : {
					taskCode : row.task_code
				}
			}, '/api/task/doDisable', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas();
				layer.msg("成功禁用");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	//启用调度任务
	methods_page.enableRow = function(row) {
		var tindex = layer.confirm('是否启用调度任务[' + row.task_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				params : {
					taskCode : row.task_code
				}
			}, '/api/task/doStart', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas();
				layer.msg("成功禁用");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	//开始执行
	methods_page.runRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否执行调度任务[' + row.task_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				params : {
					taskCode : row.task_code
				}
			}, '/api/task/doStart', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas();
				layer.msg("执行成功");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	//执行一次
	methods_page.runOneRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否执行一次调度任务[' + row.task_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				params : {
					taskCode : row.task_code
				}
			}, '/api/task/doOne', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas();
				layer.msg("执行成功");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	//暂停
	methods_page.pauseRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否暂停调度任务[' + row.task_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				params : {
					taskCode : row.task_code
				}
			}, '/api/task/doPause', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas();
				layer.msg("成功暂停");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	
	// 编辑数据
	methods_page.editRow = function(row) {
		this.curRow = row;
		this.dataEdit = true;
	};
	// 修改保存
	methods_page.editDataSave = function() {
		var g = this;
		this.$refs['dataEditForm'].validate(function(valid) {
			 if (valid) {
				var loading = layer.load();
				tasks.$saveUrl = "/api/common/update";
				tasks.$update = 'SDP-TASK-004';
				tasks.doSave(function() {
					layer.close(loading);
					g.queryDatas();
					layer.msg('数据保存成功');
					g.dataEdit = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "update");
			 } else {
				 return false;
			 }
		});
	};
	// 修改取消
	methods_page.editDataCancel = function() {
		this.curRow = {};
	}
	
	
	
	// 业务状态格式化
	methods_page.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.col;
	};
	
	// 初始化
	page_conf.mounted = function() {
		this.$nextTick(function(){
			 this.queryDatas();
		});	
	};

	var pageVue = new Vue(page_conf);
	
	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});
	
	
	// 操作
	function actionRender(h, row, column, index) {
		var arr = [];
		if (row.task_sts != 'L') {
			arr.push(initBtn(h, "编辑", "fa fa-edit", function() {
				pageVue.editRow(row);
			}));
			
			arr.push(initBtn(h, "执行一次", "fa fa-dot-circle-o", function() {
				pageVue.runOneRow(row);
			}));
		
			arr.push(initBtn(h, "开始执行", "fa fa-play", function() {
				pageVue.runRow(row);
			}));
			
			arr.push(initBtn(h, "暂停", "fa fa-pause", function() {
				pageVue.pauseRow(row);
			}));

			arr.push(initBtn(h, "禁用", "fa fa-ban", function() {
				pageVue.disableRow(row);
			}));
			
			arr.push(initBtn(h, "查看日志", "fa fa-search", function() {
				parent.layer.open({
					title:'日志',
					type: 2,
					area: ['900px', '600px'],
					fixed: false, // 不固定
					maxmin: true,
					content: 'log/taskLog.html?taskCode='+row['task_code']
				});
			}));
			
		} else if (row.task_sts == 'L') {
			arr.push(initBtn(h, "启用", "fa fa-check-circle", function() {
				pageVue.enableRow(row);
			}));
		}
		return h('button-group', {
			attrs : {
				size : 'small'
			}
		}, arr);
	}
	// 初始化按钮
	function initBtn(h, title, icon, click) {
		var ele = h('i-button', {
			attrs : {
				type : 'text',
				img : icon,
				title : title
			},
			on : {
				click : click
			}
		});
		return ele;
	}
	
});