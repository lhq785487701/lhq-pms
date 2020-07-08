/**
 * 用户脚本
 * 
 * @文件名 userList
 * @作者 李浩祺
 * @创建日期 2017-04-18
 * @版本 V 1.0
 */
"use strict";
$(function() {
	// 数据字典
	var dicConf = [ 'sdp_role_sts' ];
	var context = new SDP.SDPContext();
	var user = context.newDataStore("user");
	user.$keyField = "user_id";
	var page = user.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);

	var userRole = context.newDataStore("userRole");
	var page1 = userRole.getPage();
	page1.setPageNumber(1);
	page1.setPageRowCount(20);

	userRole.setParentDS(user);
	userRole.$parentKeys = {
		'user_code' : 'user_code'
	};

	var role = context.newDataStore("role");
	var page2 = role.getPage();
	page2.setPageNumber(1);
	page2.setPageRowCount(20);

	user.$queryUrl = "/api/common/selectList";
	user.statement = "SDP-USER-010";

	userRole.$queryUrl = "/api/common/selectList";
	userRole.statement = "SDP-USER-011";

	role.$queryUrl = "/api/common/selectList";
	role.statement = "SDP-ROLE-007";

	var cols = [ {
		title : '选择',
		key : 'radio',
		type : 'radio',
		width : 80
	}, {
		title : '用户编码',
		key : 'user_code'
	}, {
		title : '用户名称',
		key : 'user_name'
	} ];

	var colsRole = [
			{
				key : 'checked',
				type : "selection",
				width : 70
			},
			{
				title : '角色编码',
				key : 'role_code',
				width : 200
			},
			{
				title : '角色名称',
				key : 'role_name',
				width : 205
			},
			{
				title : '角色状态',
				key : 'role_sts',
				width : 180,
				format : function(row, val) {
					return pageVue.stsFormat('sdp_role_sts', row,
							'role_sts');
				}
			} ];

	var colsRole1 = [ {
		key : 'checked',
		type : "selection",
		width : 70
	}, {
		title : '角色编码',
		key : 'role_code',
		width : 200
	}, {
		title : '角色名称',
		key : 'role_name',
		width : 200
	} ];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			user_name : null,
			role_name : null,
			datas : [],
			dicDatas : {},
			dicMaps : {},
			page : page,
			curRow : {},
			columns : cols,
			datasUserRole : [],
			columnsUserRole : colsRole,
			page1 : page1,
			curRoleRow : {},
			dataRoleList : false,
			datasRole : [],
			columnsRole : colsRole1,
			page2 : page2
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
		context.set("user_name", pageVue.user_name);
		var loading = layer.load();
		var g=this;
		user.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	// 角色查询
	methods_page.queryRoleData = function() {
		var loading = layer.load();
		var g=this;
		role.set('user_code', pageVue.curRow.user_code);
		role.set('role_name', pageVue.role_name);
		role.doQuery(function(data) {
			layer.close(loading);
			g.updateDatasRole();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	// 用户角色查询
	methods_page.queryDatasUserRole=function(){
		var loading = layer.load();
		var g=this;
		userRole.doQuery(function(data) {
			layer.close(loading);
			g.updateDatasUserRole();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = user.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};
	// 设置用户角色数据
	methods_page.updateDatasUserRole = function() {
		var vs = userRole.$rowSet.$views;
		if (vs.length == 0) {
			this.datasUserRole.splice(0, this.datasUserRole.length);
		} else {
			this.datasUserRole = vs;
		}
	};
	// 设置角色数据
	methods_page.updateDatasRole = function() {
		var vs = role.$rowSet.$views;
		if (vs.length == 0) {
			this.datasRole.splice(0, this.datasRole.length);
		} else {
			this.datasRole = vs;
		}
	};
	// 选择用户
	methods_page.userTableSelect = function(data) {
		if (user.$curRow != data.item) {
			this.curRow = data.item;
			user.setCurRow(data.item);
			page1.setPageNumber(1);
			this.queryDatasUserRole();
		}
	};

	// 新增角色
	methods_page.addRoles = function() {
		if ($.isEmptyObject(this.curRow)) {
			layer.msg('必须选择一个用户');
		} else {
			this.dataRoleList = true;
			this.queryRoleData();
		}
	};

	// 新增保存
	methods_page.listDataSave = function() {
		var g = this;
		var loading = layer.load();

		var itms = this.$refs.dataRoleGrid.getSelection();
		if (itms != null && itms.length > 0) {
			var codes = [];
			$.each(itms, function(idx, itm) {
				codes.push(itm.role_code);
			});
			//添加时需要添加门户权限 SDP-PORTAL-WIN-012
			context.doAction({
				statement : 'SDP-USER-013',
				inserts:['SDP-PORTAL-WIN-012'],
				params : {
					user_code : g.curRow.user_code,
					role_code : codes
				}
			}, '/api/common/insert', function() {
				layer.close(loading);
				page1.setPageNumber(1);
				g.queryDatasUserRole();
				layer.msg('添加成功');
				g.dataRoleList = false;
			}, function(data) {
				layer.close(loading);
				layer.alert(data.msg);
			});
		} else {
			this.dataRoleList = false;
		}
	};

	// 删除用户的角色
	methods_page.deleteRows = function() {
		var itms = this.$refs.dataUserRoleGrid.getSelection();
		var g=this;
		if (itms != null && itms.length > 0) {
			var tindex = layer.confirm('是否删除数据', {
				btn : [ '是', '否' ]
			}, function() {
				var loading = layer.load();
				var codes = [];
				$.each(itms, function(idx, itm) {
					codes.push(itm.role_code);
				});
				//删除时需要删除门户权限 SDP-PORTAL-WIN-014
				context.doAction({
					statement : 'SDP-USER-012',
					deletes:['SDP-PORTAL-WIN-014'],
					params : {
						user_code : g.curRow.user_code,
						role_code : codes
					}
				}, '/api/common/delete', function(data) {
					layer.close(loading);
					layer.close(tindex);
					page1.setPageNumber(1);
					g.queryDatasUserRole();
					layer.msg("成功删除");
				}, function(data) {
					layer.close(loading);
					layer.close(tindex);
					layer.alert(data.msg);
				});
			});
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
	// 改变用户角色当前页号
	methods_page.handleUrCurrentChange = function(val) {
		page1.setPageNumber(val);
		if (page1.getIsChange()) {
			this.queryDatasUserRole();
		}
	};
	// 用户角色翻页大小
	methods_page.handleUrSizeChange = function(val) {
		page1.setPageRowCount(val);
		if (page1.getIsChange()) {
			this.queryDatasUserRole();
		}
	};

	// 改变角色当前页号
	methods_page.handleRoleCurrentChange = function(val) {
		page2.setPageNumber(val);
		if (page2.getIsChange()) {
			this.queryRoleData();
		}
	};
	// 角色翻页大小
	methods_page.handleRoleSizeChange = function(val) {
		page2.setPageRowCount(val);
		if (page2.getIsChange()) {
			this.queryRoleData();
		}
	};
	
	// 初始化
	page_conf.mounted = function() {
		// 查询用户数据
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
});