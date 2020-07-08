"use strict";
$(function() {
	var context = new SDP.SDPContext();
	// role
	var role = context.newDataStore("role");
	var page = role.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);
	role.$queryUrl = "/api/common/selectList";
	role.statement = "SDP-ROLE-008";
	
	// functionRole
	var functionRole = context.newDataStore("functionRole");
	var page2 = functionRole.getPage();
	page2.setPageNumber(1);
	page2.setPageRowCount(20);
	functionRole.setParentDS(role);
	functionRole.$parentKeys = {
		'role_code' : 'role_code'
	};
	functionRole.$queryUrl = "/api/common/selectList";
	functionRole.statement = "SDP-FUNCTION-009";
	
	// function
	var fun = context.newDataStore("function");
	var pagefunction = fun.getPage();
	pagefunction.setPageNumber(1);
	pagefunction.setPageRowCount(20);
	fun.$queryUrl = "/api/common/selectList";
	fun.statement = "SDP-FUNCTION-011";
	

	var cols01 = [ {
		key : 'checked',
		type : "radio",
		width : 47
	}, {
		title : '角色编码',
		key : 'role_code',
		width : 195
	}, {
		title : '角色名称',
		key : 'role_name',
		width : 195
	} ];

	var cols02 = [{
		key : 'checked',
		type : "selection",
		width : 50
	}, {
		title : '功能编码',
		key : 'function_code',
		width : 100
	}, {
		title : '功能名称',
		key : 'function_name',
		width : 150
	}, {
		title: '菜单编码',
		key : 'menu_code',
		width : 150
	},{
		title: '菜单名称',
		key : 'menu_name',
		width : 150
	}];
	
	
	var colfunction =  [{
		key : 'checked',
		type : "selection",
		width : 50
	}, {
		title : '功能编码',
		key : 'function_code',
		width : 100
	}, {
		title : '功能名称',
		key : 'function_name',
		width : 150
	}, {
		title: '菜单编码',
		key : 'menu_code',
		width : 150
	},{
		title: '菜单名称',
		key : 'menu_name',
		width : 150
	}];
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			role_name : '',
			function_name : '',
			datas : [],
			datas02 : [],
			datasFunction : [],
			page : page,
			page2 : page2,
			pagefunction : pagefunction,
			curRow : {},
			columns01 : cols01,
			columns02 : cols02,
			columnsFunction : colfunction,
			dataAdd : false
			
		}
	};

	var methods_page = page_conf.methods = {};
	// 点击查询按钮
	methods_page.searchDatas=function(){
		page.setPageNumber(1);
		this.queryData();
	};
	// 查询
	methods_page.queryData = function() {
		var loading = layer.load();
		role.set('role_name', pageVue.role_name);
		var g=this;
		role.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = role.$rowSet.$views;
		 if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		 } else {
			this.datas = vs;
		}
	};

	// 选择角色
	methods_page.roleTableSelect = function(data) {
		if (role.$curRow != data.item) {
			this.curRow = data.item;
			role.setCurRow(data.item);
			page2.setPageNumber(1);
			this.queryDatas02();
		}else{
			if(data.checked){
				role.setCurRow(data.item);
				page2.setPageNumber(1);
				this.queryDatas02();
			}else{
				role.setCurRow(null);
				page2.setPageNumber(1);
				this.queryDatas02();
			}
		}
	};
	// 查询角色功能
	methods_page.queryDatas02=function(){
		var loading = layer.load();
		functionRole.set('role_code', pageVue.curRow.role_code);
		var g=this;
		functionRole.doQuery(function(data) {
			g.updateDatas02();
			layer.close(loading);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置角色功能数据
	methods_page.updateDatas02 = function() {
		var vs = functionRole.$rowSet.$views;
		if (vs.length == 0) {
			this.datas02.splice(0, this.datas02.length);
		} else {
			this.datas02 = vs;
		}
	};	

	// 删除当前角色选中功能
	methods_page.deleteRows = function() {
		var itms = this.$refs.dataFunctionRoleGrid.getSelection();
		var g=this;
		if (itms != null && itms.length > 0) {
			var tindex = layer.confirm('是否删除数据', {
				btn : [ '是', '否' ]
			}, function() {
				var loading = layer.load();
				var codes = [];
				$.each(itms, function(idx, itm) {
					codes.push(itm.function_code);
				});
				context.doAction({
					statement : 'SDP-FUNCTION-010',
					params : {
						function_code : codes,
						role_code : g.curRow.role_code,
					}
				},'/api/common/delete', function(data) {
					layer.close(loading);
					layer.close(tindex);
					g.queryDatas02();
					layer.msg("成功删除");
				}, function(data) {
					layer.close(loading);
					layer.close(tindex);
					layer.alert(data.msg);
				});
			});
		}
	};
	// 新增选中角色功能
	methods_page.addFunction = function() {
		if ($.isEmptyObject(this.curRow)) {
			layer.msg('必须选择一个角色');
		} else {
			this.dataAdd = true;
			pagefunction.setPageNumber(1);
			this.queryFunctionDatas();
		}
	};
	// 未授权功能查询
	methods_page.queryFunctionDatas = function() {		
		var loading = layer.load();
		var g=this;
		fun.set('role_code', pageVue.curRow.role_code);
		fun.set('function_code', pageVue.function_code);
		fun.doQuery(function(data) {
			layer.close(loading);
			g.updateDatasFunction();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置功能数据
	methods_page.updateDatasFunction = function() {
		var vs = fun.$rowSet.$views;
		if (vs.length == 0) {
			this.datasFunction.splice(0, this.datasFunction.length);
		} else {
			this.datasFunction = vs;
		}
	};
	// 新增保存
	methods_page.listDataSave = function() {
		var g = this;
		var loading = layer.load();

		var itms = this.$refs.dataFunctionGrid.getSelection();
		if (itms != null && itms.length > 0) {
			var codes = [];
			$.each(itms, function(idx, itm) {
				codes.push(itm.function_code);
			});
			context.doAction({
				statement : 'SDP-FUNCTION-012',
				params : {
					function_code : codes,
					role_code : g.curRow.role_code
				}
			}, '/api/common/insert', function() {
				layer.close(loading);
				g.queryDatas02();
				layer.msg('添加成功');
				g.dataAdd = false;
			}, function(data) {
				layer.close(loading);
				layer.alert(data.msg);
			});
		} else {
			this.dataRoleList = false;
		}
	};
	
	
	
	// 改变角色当前页号
	methods_page.handleCurrentChange = function(val) {
		page01.setPageNumber(val);
		if (page01.getIsChange()) {
			queryData();
		}
	};
	// 改变角色页大小
	methods_page.handleSizeChange = function(val) {
		page01.setPageRowCount(val);
		if (page01.getIsChange()) {
			this.queryData();
		}
	};
	// 改变功能当前页号
	methods_page.handleFunctionCurrentChange = function(val) {
		page2.setPageNumber(val);
		if (page2.getIsChange()) {
			this.queryDatas02();
		}
	};
	// 功能翻页大小
	methods_page.handleFunctionSizeChange = function(val) {
		page2.setPageRowCount(val);
		if (page2.getIsChange()) {
			this.queryDatas02();
		}
	};
	// 改变功能当前页号
	methods_page.handlefunctionCurrentChange = function(val) {
		pagefunction.setPageNumber(val);
		if (pagefunction.getIsChange()) {
			this.queryFunctionDatas();
		}
	};
	// 功能翻页大小
	methods_page.handlefunctionSizeChange = function(val) {
		pagefunction.setPageRowCount(val);
		if (pagefunction.getIsChange()) {
			this.queryFunctionDatas();
		}
	};
	// 初始化
	page_conf.mounted = function() {
		this.$nextTick(function(){
			this.queryData();
		});	
	};

	var pageVue = new Vue(page_conf);

});