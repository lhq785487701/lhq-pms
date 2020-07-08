/**
 * 计划脚本
 * 
 * @文件名 messageLog
 * @作者 LHQ
 * @创建日期 2018-3-14
 * @版本 V 1.0
 */
"use strict";
$(function() {
	// 数据字典
	var dicConf = [ 'sdp_plan_sts' ];
	// 上下文
	var context = new SDP.SDPContext();
	var plan = context.newDataStore("plan");
	var page = plan.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);
	
	plan.$queryUrl = "/api/common/selectList";
	plan.statement = "SDP-PLAN-005";
	
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
		title : '序号',
		key : 'index',
		width : 40,
	}, {
		title : '计划名称',
		key : 'plan_title',
		width : 130,
	},{
		title : '计划内容',
		key : 'plan_content',
		width : 160
	}, {
		title : '计划启动日期',
		key : 'plan_starttime',
		width : 130
	}, {
		title : '计划结束日期',
		key : 'plan_endtime',
		width : 130
	}, {
		title : '计划执行人',
		key : 'plan_user',
		width : 100
	}, {
		title : '计划类型',
		key : 'plan_type',
		width : 130,
		format : function(row,val) {
			return  pageVue.stsFormat('sdp_plan_sts', row,
					'plan_type');
		}
	}, {
		title : '计划创建时间',
		key : 'create_date',
		width : 130
	}, {
		title : '创建人',
		key : 'create_user',
		width : 100
	}, {
		title : '操作',
		key : 'action',
		align : 'left',
		width : 120,
		type:'render',
		render : actionRender
	} ];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				taskCode : plan,
				system : '',
				plan_title : '',
				plan_user : ''
					
			},
			datas : [],
			page : page,
			dicDatas : {},
			dicMaps : {},
			curRow : {},
			columns : cols,
			rules : rules,
			rulesAdd : rulesAdd,
			dataAdd : false,
			dataEdit : false
		}
	};

	var methods_page = page_conf.methods = {};
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
		plan.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	
	// 新增计划
	methods_page.addData = function() {
		var r = plan.newRow();
		r.set('plan_title', '');
		r.set('plan_content', '');
		r.set('plan_user', '');
		r.set('create_user', '');
		r.set('plan_starttime', '');
		r.set('plan_endtime', '');
		r.set('plan_type', '');
		this.curRow = r;
		this.dataAdd = true;
	};
	// 新增计划保存
	methods_page.addDataSave = function() {
		
		var g = this;
		this.$refs['dataAddForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				plan.$saveUrl = "/api/common/insert";
				plan.$insert = 'SDP-PLAN-002';
				plan.doSave(function() {
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
		plan.delRow(this.curRow);
		this.curRow = {};
	}
	
	// 编辑职务
	methods_page.editRow = function(row) {
		this.curRow = row;
		this.dataEdit = true;
	};
	// 编辑后保存
	methods_page.editDataSave = function() {
		var g = this;
		this.$refs['dataEditForm'].validate(function(valid) {
			 if (valid) {
				var loading = layer.load();
				plan.$saveUrl = "/api/common/update";
				plan.$update = 'SDP-PLAN-003';
				plan.doSave(function() {
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
		this.curRow = {};
	}
	// 删除职务
	methods_page.deleteRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否删除职务[' + row.plan_title + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-PLAN-004',
				params : {
					plan_id : row.plan_id,
				}
			}, '/api/common/delete', function(data) {
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
	
	
	// 系统格式化
	methods_page.systemFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.role_sts;
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = plan.$rowSet.$views;
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

	
	// 角色状态格式化
	methods_page.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.role_sts;
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

	

	// 操作
	function actionRender(h, row, column, index) {
		var arr = [];
		arr.push(initBtn(h, "编辑", "fa fa-edit", function() {
			pageVue.editRow(row);
		}));

		arr.push(initBtn(h, "删除", "fa fa-remove", function() {
			pageVue.deleteRow(row);
		}));
		
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