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
	
	// resRole
	var resRole = context.newDataStore("resRole");
	var page2 = resRole.getPage();
	page2.setPageNumber(1);
	page2.setPageRowCount(20);
	resRole.setParentDS(role);
	resRole.$parentKeys = {
		'role_code' : 'role_code'
	};
	resRole.$queryUrl = "/api/common/selectList";
	resRole.statement = "SDP-RES-009";
	
	// res
	var res = context.newDataStore("res");
	var pageres = res.getPage();
	pageres.setPageNumber(1);
	pageres.setPageRowCount(20);
	res.$queryUrl = "/api/common/selectList";
	res.statement = "SDP-RES-011";
	

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
		title : '资源编码',
		key : 'res_code',
		width : 120
	}, {
		title : '资源名称',
		key : 'res_name',
		width : 200
	}, {
		title: '资源地址',
		key : 'res_url',
		width : 200
	}];
	
	var colres =  [ {
		key : 'checked',
		type : "selection",
		width : 50
	}, {
		title : '资源编码',
		key : 'res_code',
		width : 140
	}, {
		title : '资源名称',
		key : 'res_name',
		width : 160
	}, {
		title : '资源URL',
		key : 'res_url',
		width : 200
	}  ];
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			role_name : '',
			res_name : '',
			datas : [],
			datas02 : [],
			datasRes : [],
			page : page,
			page2 : page2,
			pageres : pageres,
			curRow : {},
			columns01 : cols01,
			columns02 : cols02,
			columnsRes : colres,
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
	// 查询角色资源
	methods_page.queryDatas02=function(){
		var loading = layer.load();
		resRole.set('role_code', pageVue.curRow.role_code);
		var g=this;
		resRole.doQuery(function(data) {
			g.updateDatas02();
			layer.close(loading);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置角色资源数据
	methods_page.updateDatas02 = function() {
		var vs = resRole.$rowSet.$views;
		if (vs.length == 0) {
			this.datas02.splice(0, this.datas02.length);
		} else {
			this.datas02 = vs;
		}
	};	

	// 删除当前角色选中资源
	methods_page.deleteRows = function() {
		var itms = this.$refs.dataResRoleGrid.getSelection();
		var g=this;
		if (itms != null && itms.length > 0) {
			var tindex = layer.confirm('是否删除数据', {
				btn : [ '是', '否' ]
			}, function() {
				var loading = layer.load();
				var codes = [];
				$.each(itms, function(idx, itm) {
					codes.push(itm.res_code);
				});
				context.doAction({
					statement : 'SDP-RES-010',
					params : {
						res_code : codes,
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
	// 新增选中角色资源
	methods_page.addRes = function() {
		if ($.isEmptyObject(this.curRow)) {
			layer.msg('必须选择一个角色');
		} else {
			this.dataAdd = true;
			pageres.setPageNumber(1);
			this.queryResDatas();
		}
	};
	// 未授权资源查询
	methods_page.queryResDatas = function() {		
		var loading = layer.load();
		var g=this;
		res.set('role_code', pageVue.curRow.role_code);
		res.set('res_code', pageVue.res_code);
		res.doQuery(function(data) {
			layer.close(loading);
			g.updateDatasRes();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置资源数据
	methods_page.updateDatasRes = function() {
		var vs = res.$rowSet.$views;
		if (vs.length == 0) {
			this.datasRes.splice(0, this.datasRes.length);
		} else {
			this.datasRes = vs;
		}
	};
	// 新增保存
	methods_page.listDataSave = function() {
		var g = this;
		var loading = layer.load();

		var itms = this.$refs.dataResGrid.getSelection();
		if (itms != null && itms.length > 0) {
			var codes = [];
			$.each(itms, function(idx, itm) {
				codes.push(itm.res_code);
			});
			context.doAction({
				statement : 'SDP-RES-012',
				params : {
					res_code : codes,
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
			this.queryData();
		}
	};
	// 改变角色页大小
	methods_page.handleSizeChange = function(val) {
		page01.setPageRowCount(val);
		if (page01.getIsChange()) {
			this.queryData();
		}
	};
	// 改变资源当前页号
	methods_page.handleResCurrentChange = function(val) {
		page2.setPageNumber(val);
		if (page2.getIsChange()) {
			this.queryDatas02();
		}
	};
	// 资源翻页大小
	methods_page.handleResSizeChange = function(val) {
		page2.setPageRowCount(val);
		if (page2.getIsChange()) {
			this.queryDatas02();
		}
	};
	// 改变资源当前页号
	methods_page.handleresCurrentChange = function(val) {
		pageres.setPageNumber(val);
		if (pageres.getIsChange()) {
			this.queryResDatas();
		}
	};
	// 资源翻页大小
	methods_page.handleresSizeChange = function(val) {
		pageres.setPageRowCount(val);
		if (pageres.getIsChange()) {
			this.queryResDatas();
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