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
	var dicConf = [ 'sdp_user_sts' ];
	var context = new SDP.SDPContext();
	
	// role
	var role = context.newDataStore("role");
	var page = role.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);
	role.$queryUrl = "/api/common/selectList";
	role.statement = "SDP-ROLE-008";
	
	//roleUser
	var roleUser = context.newDataStore("roleUser");
	var page1 = roleUser.getPage();
	page1.setPageNumber(1);
	page1.setPageRowCount(20);
	

	roleUser.$queryUrl = "/api/common/selectList";
	roleUser.statement = "SDP-USER-016";
	

	
	var cols = [ {
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

	var colsUser = [
		{
			key : 'checked',
			type : "selection",
			width : 70
		},
		{
			title : '用户编码',
			key : 'user_code',
			width : 120
		},
		{
			title : '用户名称',
			key : 'user_name',
			width : 150
		},
		{
			title : '用户状态',
			key : 'user_sts',
			width : 80,
			format : function(row, val) {
				return pageVue.stsFormat('sdp_user_sts', row,
						'user_sts');
			}
		},{
			title : '联系方式',
			key : 'user_mobile',
			width : 150
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
			datasRoleUser : [],
			columnsRoleUser : colsUser,
			page1 : page1,
			curRoleRow : {},
			dataRoleList : false,
			datasRole : [],
		}
	};

	var methods_page = page_conf.methods = {};
	// 点击查询按钮
	methods_page.searchDatas=function(){
		page.setPageNumber(1);
		this.queryDatas();
	};
	// 查询角色
	methods_page.queryDatas = function() {
		var g = this;
		var obj = g.params;
		context.set("role_name", g.role_name);
		var loading = layer.load();
		var g=this;
		role.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	// 角色所对应用户查询
	methods_page.queryDatasRoleUser=function(){
		var loading = layer.load();
		var g=this;
		roleUser.set('role_code', g.curRow.role_code);
		roleUser.doQuery(function(data) {
			layer.close(loading);
			g.updateDatasRoleUser();
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
	
	// 设置用户角色数据
	methods_page.updateDatasRoleUser = function() {
		var vs = roleUser.$rowSet.$views;
		if (vs.length == 0) {
			this.datasRoleUser.splice(0, this.datasRoleUser.length);
		} else {
			this.datasRoleUser = vs;
		}
	};
	
	// 选择用户
	methods_page.roleTableSelect = function(data) {
		if (role.$curRow != data.item) {
			this.curRow = data.item;
			role.setCurRow(data.item);
			page1.setPageNumber(1);
			this.queryDatasRoleUser();
		}
	};
	
	//打开新增用户页面
	methods_page.addRoles = function(data) {
		var g = this;
		SDP.layer.open({
			title : '选择用户',
			type : 2,
			area : [ '500px', '420px' ],
			content : SDP.URL.getUrl('/html/admin/common/selectUser.html')
		}, {
			statement : 'SDP-USER-018',
			role_code : g.curRow.role_code
		}, function(val) {
			g.addRoleUser(val);
		},true);
	}
	
	//新增权限下的用户
	methods_page.addRoleUser = function(itms) {
		var g = this;
		if (itms != null && itms.length > 0) {
			var users = [];
			$.each(itms, function(idx, itm) {
				users.push(itm.user_code);
			});
			
			context.doAction({
				statement : 'SDP-USER-019',
				inserts:['SDP-PORTAL-WIN-024'],
				params : {
					user_codes : users,
					role_code : g.curRow.role_code,
				}
			}, '/api/common/insert', function() {
				page1.setPageNumber(1);
				g.queryDatasRoleUser();
				layer.msg('添加成功');
				g.dataRoleList = false;
			}, function(data) {
				layer.alert(data.msg);
			});
		} 
	}

	// 删除角色下的用户
	methods_page.deleteRows = function() {
		var g=this;
		var itms = g.$refs.dataRoleUserGrid.getSelection();
		if (itms != null && itms.length > 0) {
			var tindex = layer.confirm('是否删除数据', {
				btn : [ '是', '否' ]
			}, function() {
				var loading = layer.load();
				var users = [];
				$.each(itms, function(idx, itm) {
					users.push(itm.user_code);
				});
				context.doAction({
					statement : 'SDP-USER-017',
					deletes:['SDP-PORTAL-WIN-023'],
					params : {
						user_code : users,
						role_code : g.curRow.role_code
					}
				}, '/api/common/delete', function(data) {
					layer.close(loading);
					layer.close(tindex);
					page1.setPageNumber(1);
					g.queryDatasRoleUser();
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
			this.queryDatasRoleUser();
		}
	};
	// 用户角色翻页大小
	methods_page.handleUrSizeChange = function(val) {
		page1.setPageRowCount(val);
		if (page1.getIsChange()) {
			this.queryDatasRoleUser();
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