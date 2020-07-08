/**
 * 计划脚本
 * 
 * @文件名 messageLog
 * @作者 梁展鹏
 * @创建日期 2018-3-14
 * @版本 V 1.0
 */
"use strict";
$(function() {
	// 数据字典
	var dicConf = [ 'plan_visible_sts', 'plan_sts', 'plan_order_sts' ];
	// 上下文
	var context = new SDP.SDPContext();
	var planday = context.newDataStore("planday");
	var userinfo = context.newDataStore("userinfo");
	var page = planday.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);
	var user={};
	planday.$queryUrl = "/api/common/selectList";
	planday.statement = "SDP-PLAN-DAY-001";
	
	// 字段验证
	var rules = {
			plan_title : [ {
				required : true,
				message : '请输入职务名称',
				trigger : 'blur'
			}, {
				max : 40,
				message : '长度在 0到 80个字符',
				trigger : 'blur'
			} ]
		};
	//验证
	var rulesAdd = $.extend({
		plan_content : [ {
			required : true,
			message : '请输入内容',
			trigger : 'blur'
		}, {
			min : 2,
			max : 80,
			message : '长度在 2到 80 个字符',
			trigger : 'blur'
		} ]
	}, rules);
	
	var cols = [ {
		type	 : 'index',
		width : 40,
        align: 'center'
	}, {
		title : '计划名称',
		key : 'plan_title',
		width : 100,
	},{
		title : '计划内容',
		key : 'plan_content',
		width : 160
	}, {
		title : '计划详情',
		key : 'plan_details',
		width : 160
	}, {
		title : '发起人',
		key : 'plan_owner_name',
		width : 80
	}, {
		title : '负责人',
		key : 'plan_user_name',
		width : 80
	}, {
		title : '计划类型',
		key : 'plan_type',
		width : 90
	}, {
		title : '计划创建时间',
		key : 'create_date',
		width : 160
	}, {
		title : '开始时间',
		key : 'plan_starttime',
		width : 160
	}, {
		title : '结束时间',
		key : 'plan_endtime',
		width : 160
	}, {
		title : '优先级',
		key : 'plan_order_level',
		width : 50,
		format : function(row,val) {
			return  pageVue.stsFormat('plan_order_sts', row,
					'plan_order_level');
		}
	}, {
		title : '备注',
		key : 'rmark',
		width : 160
	}, {
		title : '更新时间',
		key : 'update_date',
		width : 160
	}, {
		title : '任务状态',
		key : 'plan_state',
		width : 100,
		format : function(row,val) {
			if((new Date()) > (new Date((row.plan_endtime).toString().replace(/-/g,"\/")))){
				val='2';
			}
			return  pageVue.stsFormat('plan_sts', row,
					'plan_state');
		}
	},{
		title : '可视程度',
		key : 'plan_visible',
		width : 100,
		format : function(row,val) {
			return  pageVue.stsFormat('plan_visible_sts', row,
					'plan_visible');
		}
	},{
		title : '操作',
		key : 'action',
		align : 'left',
		fixed: 'right',
		width : 120,
		type:'render',
		render : actionRender
	} ];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				taskCode : planday,
				system : '',
				plan_title : '',
				plan_user : ''
					
			},
			datas : [],
			page : page,
			dicDatas : {},
			dicMaps : {},
			f_action : {},
			curRow : {},
			user : {},
			columns : cols,
			rules : rules,
			rulesAdd : rulesAdd,
			dataAdd : false,
			dataEdit : false,
			dataDelay : false
		}
	};

	var methods_page = page_conf.methods = {};
	//获取当前登录的用户信息
	var url = "/api/user/getUserInfo?t=" + new Date().getTime();
	context.doAction({}, url, function(data) {
		if (data.data != null) {
			SDP.loginUser = data.data;
			$.each(data.data.attrs, function(index, itm) {
				for ( var n in itm) {
					SDP.loginUser[n] = itm[n];
				}
			});
			user = SDP.loginUser;
		}
	}, function(data) {
		layer.alert(data.msg);
	});
	var a=context;
	// 点击查询按钮
	methods_page.searchDatas = function() {
		page.setPageNumber(1);
		this.queryDatas();
	};

	//查询
	methods_page.queryDatas = function() {
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;
		g.judgeState();
		planday.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	// 新增计划
	methods_page.addData = function() {
		var r = planday.newRow();
		r.set('plan_title', '');
		r.set('plan_content', '');
		r.set('plan_details', '');
		r.set('plan_user', '');
		r.set('plan_owner', '');
		r.set('plan_starttime', '');
		r.set('plan_endtime', '');
		r.set('plan_type', '');
		r.set('plan_visible', '');
		r.set('plan_order_level', '');
		r.set('plan_visible', '');
		r.set('rmark', '');
		this.curRow = r;
		
		this.dataAdd = true;
	};
	// 新增计划保存
	methods_page.addDataSave = function() {
		
		var g = this;
		this.$refs['dataAddForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				g.curRow.plan_starttime = g.changeDate01(g.curRow.plan_starttime);
				g.curRow.plan_endtime = g.changeDate01(g.curRow.plan_endtime);
				planday.$saveUrl = "/api/common/insert";
				planday.$insert = 'SDP-PLAN-DAY-003';
				
				planday.doSave(function() {
					layer.close(loading);
					g.queryDatas();
					layer.msg('数据新增成功');
					g.dataAdd = false;
				}, function(data) {
					console.log(data);
					layer.close(loading);
					layer.alert(data.msg);
				}, "insert");
			} else {
				return false;
			}
		});
	};
	// 新增计划取消
	methods_page.addDataCancel = function() {
		this.curRow.plan_starttime = this.changeDate01(this.curRow.plan_starttime);
		this.curRow.plan_endtime = this.changeDate01(this.curRow.plan_endtime);
		planday.delRow(this.curRow);
		this.curRow = {};
	}
	
	// 编辑任务
	methods_page.editRow = function(row) {
		this.curRow = row;
		this.dataEdit = true;
	};
	
	//时区日期格式转换(TZ)
	methods_page.changeDate01 = function(dateA) {
		
		var dateee = new Date(dateA).toJSON();
		var date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')  
		return date
	};
	//比较日期
	methods_page.compareDate = function (d1){
	  return ((new Date()) > (new Date(d1.replace(/-/g,"\/"))));
	}
	// 编辑后保存
	methods_page.editDataSave = function() {
		var g = this;
		this.$refs['dataEditForm'].validate(function(valid) {
			 if (valid) {
				g.curRow.plan_starttime = g.changeDate01(g.curRow.plan_starttime);
				g.curRow.plan_endtime = g.changeDate01(g.curRow.plan_endtime);
				
				var loading = layer.load();
				planday.$saveUrl = "/api/common/update";
				planday.$update = 'SDP-PLAN-DAY-004';
				planday.doSave(function() {
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
	// 编辑取消
	methods_page.editDataCancel = function() {
		this.curRow.plan_starttime = this.changeDate01(this.curRow.plan_starttime);
		this.curRow.plan_endtime = this.changeDate01(this.curRow.plan_endtime);
		this.curRow = {};
	}
	// 删除计划
	methods_page.deleteRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否删除计划[' + row.plan_title + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-PLAN-DAY-005',
				params : {
					plan_code : row.plan_code,
				}
			}, '/api/common/update', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas();
				layer.msg("成功删除");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	// 完成计划
	methods_page.finishRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否确定完成计划[' + row.plan_title + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-PLAN-DAY-006',
				params : {
					plan_code : row.plan_code,
					plan_state : row.plan_state,
				}
			}, '/api/common/update', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas();
				layer.msg("成功完成");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	
	// 任务延期
	methods_page.delayRow = function(row) {
		this.curRow = row;
		this.dataDelay = true;
	};
	// 任务延期保存
	methods_page.editDelaySave = function() {
		
		var g = this;
		this.$refs['dataDelayForm'].validate(function(valid) {
			 if (valid) {
				g.curRow.plan_starttime = g.changeDate01(g.curRow.plan_starttime);
				g.curRow.plan_endtime = g.changeDate01(g.curRow.plan_endtime);
				var loading = layer.load();
				context.doAction({
					statement : 'SDP-PLAN-DAY-007',
					params : {
						plan_code : g.curRow.plan_code,
						plan_endtime : g.curRow.plan_endtime,
					}
				}, '/api/common/update', function(data) {
					layer.close(loading);
					layer.closeAll('iframe');
					g.queryDatas();
					layer.msg("成功延期");
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
					layer.closeAll('iframe');
				});
				g.dataDelay = false;
				} else {
				 return false;
			 }
		});
		
	};
	// 延期取消
	methods_page.editDelayCancel = function() {
		this.curRow.plan_starttime = this.changeDate01(this.curRow.plan_starttime);
		this.curRow.plan_endtime = this.changeDate01(this.curRow.plan_endtime);
		this.curRow = {};
	}
	
	// 判断任务状态
	methods_page.judgeState = function() {
		context.doAction({
			statement : 'SDP-PLAN-DAY-008'
		}, '/api/common/update', function(data) {
			layer.msg("更新状态成功");
		}, function(data) {
			layer.msg("更新状态失败");
		});
	}
	
	// 系统格式化
	methods_page.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.role_sts;
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = planday.$rowSet.$views;
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
	
	
	// 初始化
	page_conf.mounted = function() {
		// 查询角色数据
		this.$nextTick(function() {
			this.queryDatas();
		});
		
		
	};

	var pageVue = new Vue(page_conf);

	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});
	
	// 初始化功能列表	
	SDP.FUNCTION.initDatas(window.location.pathname, function(data) {
		pageVue.f_action = data;
	});

	
	// 操作
	function actionRender(h, row, column, index) {
		var arr = [];
		if (row.plan_state == '1' || row.plan_state == '4') {
			arr.push(initBtn(h, "编辑", "fa fa-edit", function() {
				pageVue.editRow(row);
			}));
			arr.push(initBtn(h, "删除", "fa fa-remove", function() {
				pageVue.deleteRow(row);
			}));
		} else {
			arr.push(initBtn(h, "编辑", "fa fa-edit", function() {
				pageVue.editRow(row);
			}));
			arr.push(initBtn(h, "删除", "fa fa-remove", function() {
				pageVue.deleteRow(row);
			}));
			arr.push(initBtn(h, "完成", "fa fa-check", function() {
				pageVue.finishRow(row);
			}));
			arr.push(initBtn(h, "延期", "fa fa-tachometer", function() {
				pageVue.delayRow(row);
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
	//转化日期格式
	methods_page.changeDateFormat = function(value) {
		var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
		if(value != null && value != ""){
			if(value.toString().match(reg) == null) {
				return value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate();
			} 
		} else if (value == "") {
			return null;
		}
	}

});