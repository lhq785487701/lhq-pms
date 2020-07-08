
"use strict";
$(function() {
	var context = new SDP.SDPContext();
	var jobs = context.newDataStore("jobs");
	jobs.$keyField = "jobs_code";
	var page = jobs.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);

	jobs.$queryUrl = "/api/common/selectList";
	jobs.statement = "SDP-ORG-JOBS-002";
	
	// 字段验证
	var rules = {
			jobs_name : [ {
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
		jobs_code : [ {
			required : true,
			message : '请输入职务编码',
			trigger : 'blur'
		}, {
			min : 2,
			max : 80,
			message : '长度在 2到 80 个字符',
			trigger : 'blur'
		} ]
	}, rules);
	
	var cols = [
			{
				title : '职务编码',
				key : 'jobs_code',
				width : 120
			}, {
				title : '职务名称',
				key : 'jobs_name',
				width : 120
			}, {
				title : '职务级别',
				key : 'jobs_level',
				width : 120
			}, {
				title : '职务描述',
				key : 'jobs_remark',
				width : 200
			}, {
				title : '创建时间',
				key : 'create_date',
				width : 160
			}, {
				title : '创建人',
				key : 'create_user',
				width : 120
			}, {
				title : '最后修改时间' ,
				key : 'update_date',
				width : 160
			}, {
				title : '最后修改人' ,
				key : 'update_user',
				width : 120
			}, {
				title : '操作',
				key : 'action',
				align : 'left',
				width : 120,
				type:'render',
				render : actionRender
			}];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				jobs_code : '',
				jobs_level : ''
			},
			datas : [],
			page : page,
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
		jobs.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = jobs.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};

	// 新增职务
	methods_page.addData = function() {
		var r = jobs.newRow();
		r.set('jobs_code', '');
		r.set('jobs_name', '');
		r.set('jobs_level', '');
		r.set('jobs_remark', '');
		this.curRow = r;
		this.dataAdd = true;
	};
	// 新增职务保存
	methods_page.addDataSave = function() {
		var g = this;
		this.$refs['dataAddForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				jobs.$saveUrl = "/api/common/insert";
				jobs.$insert = 'SDP-ORG-JOBS-003';
				jobs.doSave(function() {
					layer.close(loading);
					g.queryDatas();
					layer.msg('数据新增成功');
					g.dataAdd = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "insert");
			} else {
				return false;
			}
		});
	};
	// 新增职务取消
	methods_page.addDataCancel = function() {
		jobs.delRow(this.curRow);
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
				jobs.$saveUrl = "/api/common/update";
				jobs.$update = 'SDP-ORG-JOBS-004';
				jobs.doSave(function() {
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
		var tindex = layer.confirm('是否删除职务[' + row.jobs_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-ORG-JOBS-005',
				params : {
					jobs_code : row.jobs_code,
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
		this.$nextTick(function(){
			 this.queryDatas();
		});	
	};

	var pageVue = new Vue(page_conf);

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