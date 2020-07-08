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
	var context = new SDP.SDPContext();
	var role = context.newDataStore("role");
	var page = role.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);
	role.$queryUrl = "/api/common/selectList";
	role.statement = "SDP-ROLE-008";

	var menuRole = context.newDataStore("menuRole");
	menuRole.setParentDS(role);
	menuRole.$parentKeys = {
		'role_code' : 'role_code'
	};
	menuRole.$queryUrl = "/api/common/selectList";
	menuRole.statement = "SDP-ROLE-009";

	var menu = context.newDataStore("menu");

	menu.$queryUrl = "/api/common/selectList";
	menu.statement = "SDP-MENU-009";
	
	var setting = {
		view : {
			selectedMulti : false
		},
		check:{
			enable:true
		}
	};
	setting.data = {
		key : {
			 title : "",
			 name : "name"
		},
		simpleData : {
			  enable : true,
			  idKey : "id",
			  pIdKey : "pid",
			  rootPId : null
		}
	};
    var nodeList=[];
    var zTree,curDragNode=null;

	var cols = [ {
		key : 'checked',
		type : "radio",
		width : 70
	}, {
		title : '角色编码',
		key : 'role_code',
		width : 200
	}, {
		title : '角色名称',
		key : 'role_name',
		width : 205
	} ];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			role_name : '',
			datas : [],
			page : page,
			curRow : {},
			columns : cols,
			datasTree : [],
			treeMap:{},
			tmpData:{}
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
			g.freshTreeCheck();
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
			this.queryDatas01();
		}else{
			if(data.checked){
				role.setCurRow(data.item);
				this.queryDatas01();
			}else{
				role.setCurRow(null);
				this.freshTreeCheck();
			}
		}
	};
	// 查询菜单角色
	methods_page.queryDatas01=function(){
		var loading = layer.load();
		menuRole.set('role_code', pageVue.curRow.role_code);
		var g=this;
		menuRole.doQuery(function(data) {
			g.freshTreeCheck();
			layer.close(loading);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	// 刷新树勾选
	methods_page.freshTreeCheck=function(){
		var rs=menuRole.$rowSet.$views;
		var g=this;
		// 初始化菜单
		if(zTree==null){
			return;
		}
		zTree.checkAllNodes(false);

		this.tmpData={};
		var tmp={};
		// 已授权菜单
		$.each(rs,function(idx,itm){
			var d=g.treeMap[itm.menu_code];
			tmp[itm.menu_code]=itm;
			if(d!=null && (d.children==null || d.children.length<=0)){
				zTree.checkNode(d,true,true,false);
			}
			g.tmpData[itm.menu_code]=itm;
		});
	};

	// 保存授权数据
	methods_page.saveData = function() {
		var g = this;
		var loading = layer.load();

		var datas=this.treeMap;

		var tindex = layer.confirm('是否授权', {
				btn : [ '是', '否' ]
		}, function() {
			// 处理数据
			var tmp={};
			var chkNodes=zTree.getCheckedNodes(true);
			// 添加选中节点
			$.each(chkNodes,function(index,itm){
				var row=g.tmpData[itm.id];
				if(row==null){
					var r=menuRole.newRow();
					r.set('menu_code',itm.id);
					r.set('role_code',g.curRow.role_code);
				}
				tmp[itm.id]=true;
			});
			// 移除非选中节点
			$.each(g.tmpData,function(n,itm){
				if(tmp[n]==null){
					itm.del();
				}
			});
				
			// 数据保存到服务端
			context.doAction({
				'dataStore':{
					'name':'menuRole',
					'insert':'SDP-ROLE-010',
					'delete':'SDP-ROLE-011',
					'rows':menuRole.$rowSet.toObject('update')
				}
			}, '/api/common/save', function() {
				layer.close(loading);
				g.queryDatas01();
				layer.msg('权限修改成功');
			}, function(data) {
				layer.close(loading);
				layer.alert(data.msg);
			});
		});
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
	// 初始化菜单树
	methods_page.queryDatasTree = function() {
		var loading = layer.load();
		var g=this;
		menu.doQuery(function(data) {
			var d = initTreeMenu(menu.$rowSet.$views);
			nodeList=[];
			zTree = $.fn.zTree.init($("#menuTree"), setting, d);
			// 展开第一层菜单
			g.$nextTick(function(){
				var nodes = zTree.getNodes();
				$.each(nodes,function(index,itm){
					zTree.expandNode(itm,true,false,false,false);
				});				
			});
			
			layer.close(loading);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 初始化
	page_conf.mounted = function() {
		this.$nextTick(function(){
			this.queryData();
			this.queryDatasTree();
		});	
	};

	var pageVue = new Vue(page_conf);

	// 初始化菜单
	function initTreeMenu(menus) {
		var obj = pageVue.treeMap={};		
		var arr = [];
		$.each(menus, function(index, itm) {
			var m={id:itm.menu_code,pid:itm.menu_pcode,name:itm.menu_name,entity:itm};
			arr.push(m);
			obj[itm.menu_code]=m;
		});
		return arr;
	}
});