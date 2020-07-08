/**
 * 组织用户脚本
 * 
 * @文件名 selectOrgUser
 * @作者 李浩祺
 * @创建日期 2017-04-18
 * @版本 V 1.0
 */
"use strict";
$(function() {
	var context = new SDP.SDPContext();
	var user = context.newDataStore("user");
	var page = user.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);
	user.$queryUrl = "/api/common/selectList";
	user.statement = "SDP-USER-002";

	var org = context.newDataStore("org");
	org.$queryUrl = "/api/common/selectList";
	org.statement = "SDP-ORG-002";
	
	var zTree,curNode,nodeList;
	var setting = {
		view : {
			fontCss :getFontCss,
			selectedMulti : false
		},
		callback:{
			onClick : onSelect
		},
		data:{
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
		}
	};
	
	var cols=[
		{
			key : 'radio',
			type : "radio",
			width : 40
		},
		{
			title : '用户编码',
			key : 'user_code',
			width : 120
		},
		{
			title : '用户名称',
			key : 'user_name',
			width : 140
		}
	];	
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				org_code:null,
				user_code:null
			},
			mdmCode:null,
			datas : [],
			page : page,
			curRow:null,
			columns : cols,
			filterText:null,
			callback:null
		}
	};
	
	var methods_page = page_conf.methods = {};
	
	// 点击查询按钮
	methods_page.searchDatas=function(){
		page.setPageNumber(1);
		this.queryDatas();
	};
	
	// 查询树数据
	methods_page.queryDatasTree=function(){
		var loading = layer.load();
		var g=this;
		context.clearParam();
		context.set("mdm_code",this.mdmCode);
		
		org.doQuery(function(data) {
			var d = initTreeOrg(org.$rowSet.$views);
			zTree = $.fn.zTree.init($("#orgTree"), setting, d);
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
	
	// 查询组织用户数据
	methods_page.queryDatas=function(){
		var g = this;
		var loading = layer.load();
		context.clearParam();
		context.put(this.params);
		user.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	// 初始化用户数据
	methods_page.updateDatas=function(){
		var vs = user.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};
	
	// 选择用户
	methods_page.userTableSelect = function(data) {
		if (user.$curRow != data.item) {
			this.curRow = data.item;			
		}
	};
	
	// 确认
	methods_page.saveUser=function(userCode){
		if(this.callback){
			var obj=this.curRow==null?null:$.extend(true,{},this.curRow);
			this.callback(obj);
			this.closeWindow();
		}
	};
	
	// 关闭窗体
	methods_page.closeWindow=function(){
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	};
	
	// 初始化
	page_conf.mounted = function() {
		
	};
	
	// 监控数据变化
	page_conf.watch={
		filterText:function(val){
			updateNodes(false);
			
			var node = zTree.getNodesByParamFuzzy("name", val);
			if (node === null) {
			    nodeList = [];
			} else {
			    nodeList = node;
			}

			updateNodes(true);
		}
	};
	
	// 翻页改变
	methods_page.handleCurrentChange=function(val){
		page.setPageNumber(val);
		if (page.getIsChange()) {
			this.queryDatas();
		}
	};
	
	// 翻页每页大小改变
	methods_page.handleSizeChange=function(val){
		page.setPageRowCount(val);
		if (page.getIsChange()) {
			this.queryDatas();
		}
	};
	
	var pageVue = new Vue(page_conf);
	
	// 初始化组织树
	function initTreeOrg(orgs){	
		var arr = [];
		$.each(orgs, function(index, itm) {
			var m={id:itm.org_code,pid:itm.org_pcode,name:itm.org_name,entity:itm};
			arr.push(m);
		});
		return arr;
	}
	
	// 组织树选择
	function onSelect(event, treeId, treeNode, clickFlag){
		if(curNode!=treeNode){
			curNode=treeNode;
			pageVue.curRow = curNode.entity;
			pageVue.params.org_code=pageVue.curRow.org_code;
			pageVue.queryDatas();
		}
	}
	
	// 更新节点
	function updateNodes(highlight){
		if(nodeList==null){
			return;
		}
		var node = null;
		var p = null;
		for (var i = 0, l = nodeList.length; i < l; i++) {
		    node = nodeList[i];
		    node.highlight = highlight;
		    zTree.updateNode(node);
		    if (highlight) {
				p = node.getParentNode();
				if (p && p.open == false) {
				    zTree.expandNode(p, true, false, false);
				}
				while (p != null) {
				    p = p.getParentNode();
				    if (p && p.open == false) {
				    	zTree.expandNode(p, true, false, false);
				    }
				}
		    }
		}
	}
	
	// 树字体样式
	function getFontCss(treeId, treeNode){
		return (!!treeNode.highlight) ? {
		    color : "#A60000",
		    "font-weight" : "bold"
		} : {
		    color : "#333",
		    "font-weight" : "normal"
		};
	}

	$.sendParams = function(obj) {
		pageVue.callback=obj.callback;
		pageVue.mdmCode=obj.data.mdmCode;
		pageVue.$nextTick(function(){
			pageVue.queryDatasTree();
		});
	};
});