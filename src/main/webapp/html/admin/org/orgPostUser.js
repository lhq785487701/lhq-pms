"use strict";
$(function() {
	// 数据字典
	var context = new SDP.SDPContext();
	var postuser = context.newDataStore("postuser");
	postuser.$keyField = "oup_id";
	var page = postuser.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);
	
	var orgcode=SDP.params["orgcode"];
	var postcode=SDP.params["postcode"];

	postuser.$queryUrl = "/api/common/selectList";
	postuser.statement = "SDP-ORG-014";
	
	var postuser01 = context.newDataStore("postuser01");
	var page01 = postuser01.getPage();
	page01.setPageNumber(1);
	page01.setPageRowCount(20);
	
	postuser01.$queryUrl = "/api/common/selectList";
	postuser01.statement = "SDP-ORG-015";
	
	//岗位人员
	var cols = [
			{
				title : '用户编码',
				key : 'user_code',
				width : 120
			}, {
				title : '用户名称',
				key : 'user_name',
				width : 120
			}, 
			{
				title : '操作',
				key : 'action',
				align : 'left',
				width : 110,
				type:'render',
				render : actionRender
			}];
	//非岗位人员
	var cols01 = [
				{
					key : 'checked',
					type : 'selection',
					width : 40
				},
				{
					title : '用户编码',
					key : 'user_code',
					width : 120
				}, {
					title : '用户名称',
					key : 'user_name',
					width : 120
				}];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				user_code : ''
			},
			usersParam : {
				user_code : ''
			},
			datas : [],
			usersdatas : [],
			page : page,
			page01 : page01,
			dicDatas : {},
			dicMaps : {},
			curRow : {},
			columns : cols,
			columnsUsers :cols01
		}
	};

	var methods_page = page_conf.methods = {};
	
	// 点击查询按钮
	methods_page.searchDatas=function(){
		page.setPageNumber(1);
		this.queryDatas();
	};
	// 查询此岗位人员
	methods_page.queryDatas = function() {
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		postuser.set('org_code', orgcode);
		postuser.set('post_code',postcode);
		var g = this;
		var loading = layer.load();
		postuser.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = postuser.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};

	
	//从岗位移除人员
	methods_page.deleteRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否删除人员[' + row.user_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			console.log("aa"+row.oup_id);
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-ORG-016',
				params : {
					oup_id : row.oup_id
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
	
	//打开设置岗位人员窗口
	var userIndex;
	methods_page.openUser=function(){
		userIndex=layer.open({
			title:'选择人员',
			type: 1,
			area: ['480px', '400px'],
			fixed: false, // 不固定
			maxmin: true,
			content:$("#postUserContainer")
		});
		$("#orgMdmContainer").removeClass("hide");
		this.queryDatas01();
	};
	// 选择人员点击查询按钮
	methods_page.searchUsersDatas=function(){
		page.setPageNumber(1);
		this.queryDatas01();
	};
	//查询不在此岗位人员
	methods_page.queryDatas01 = function() {
		var obj = pageVue.usersParam;
		context.clearParam();
		context.put(obj);
		postuser01.set('org_code', orgcode);
		postuser01.set('post_code',postcode);
		var g = this;
		var loading = layer.load();
		postuser01.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas01();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas01 = function() {
		var vs = postuser01.$rowSet.$views;
		if (vs.length == 0) {
			this.usersdatas.splice(0, this.usersdatas.length);
		} else {
			this.usersdatas = vs;
		}
	};
	
	//选中人员设定岗位，多选
	methods_page.addDataSave = function() {
		var g = this;
		var loading = layer.load();
		var itms = this.$refs.dataUsersGrid.getSelection();
		console.log(itms);
		if (itms != null && itms.length > 0) {
			var codes = [];
			$.each(itms, function(idx, itm) {
				codes.push(itm.oup_id);
			});
			context.doAction({
				statement : 'SDP-ORG-017',
				params : {
					oup_id : codes,
					post_code : postcode
				}
			}, '/api/common/insert', function() {
				layer.close(loading);
				g.queryDatas();
				layer.msg('添加成功');
				layer.close(userIndex);
			}, function(data) {
				layer.close(loading);
				layer.alert(data.msg);
			});
		} else {
			this.dataRoleList = false;
		}
	}
	//取消选择，关窗
	methods_page.addDataCancel = function() {
		layer.close(userIndex);
	}
	
	
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
	// 改变当前页号
	methods_page.handleCurrentChangeUsers = function(val) {
		page01.setPageNumber(val);
		if (page01.getIsChange()) {
			this.queryDatas01();
		}
	};
	// 改变页大小
	methods_page.handleSizeChangeUsers = function(val) {
		page01.setPageRowCount(val);
		if (page01.getIsChange()) {
			this.queryDatas01();
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
		arr.push(initBtn(h, "删除", "fa fa-close", function() {
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