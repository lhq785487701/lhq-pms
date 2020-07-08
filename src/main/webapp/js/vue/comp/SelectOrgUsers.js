/**
 * 
 * 
 * @文件名 orgUserSelects
 * @作者 李浩祺
 * @创建日期 2017-11-17
 * @版本 V 1.0
 */
"use strict";
$(function() {
	// 模版
	
	var tpl=['<row :gutter="5"><i-col :span="6">'];
	tpl.push('<row type="flex" justify="center" align="middle">');
	tpl.push('<i-input placeholder="输入关键字进行过滤" v-model="filterText">');
	tpl.push('</i-input>');
	tpl.push('</row>');
	tpl.push('<ul id="orgTree" class="ztree" style="width: 100%; height: 100%;"></ul>');
	tpl.push('</i-col>');
	tpl.push('<i-col :span="6">');
	tpl.push('<i-form inline :model="params" :label-width="60">');
	tpl.push('<form-item label="用户:">');
	tpl.push('<i-input v-model="params.user_code"  placeholder="输入编码或名称">');
	tpl.push('<i-button @click="queryDatas" icon="android-refresh" title="刷新" slot="append"></i-input>');
	tpl.push('</i-input>');
	tpl.push('</form-item>');	
	tpl.push('</i-form>');
	tpl.push('<i-table :data="datas" :columns="columns" height="400" width="285" border></i-table>');
	tpl.push('<page @on-page-size-change="handleSizeChange" :page-size="page!=null?page.getPageRowCount():20"');
	tpl.push(' @on-change="handleCurrentChange" :current="page!=null?page.getPageNumber():1" size="small"');
	tpl.push(' :total="page!=null?page.totalCount:0"></page>');			
	tpl.push('</i-col>');
	tpl.push('<i-col :span="9">');
	tpl.push('<row><tag v-for="itm in selectUsers" :key="itm" :name="itm.user_code"  closable @on-close="userRemove">{{itm.user_name}}</tag></row>');
	tpl.push('</i-col>');
	tpl.push('</row>');
	
	
	Vue.component('select-org-users', {
		// 外部可传入参数
		props : {
			mdmCode:String,
			selectUsers:{
				type:Array,
				default:[]
			}
		},
		template : tpl.join(''),
		// 组件内使用参数
		data:function(){
			return {
				columns: [
					{
						key : 'checked',
						type : "selection",
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
						width : 120
				}],
				params:{
					org_code:null,
					user_code:null
				},
				datas : [],
				page : null,
				context:null,
				user:null,
				filterText:null,
				datas1:[],
				columns1: [
					{
						title : '用户编码',
						key : 'user_code',
						width : 120
					},
					{
						title : '用户名称',
						key : 'user_name',
						width : 120
					}
				],
				zTree:null,
				org:null,
				curNode:null,
				curRow:null,
				setting:null,
				mdm_code:null,
				nodeList:null
			};
		},
		// 类方法
		methods:{
			userRemove:function(event, code){
				
			},
			queryDatas:function(){
				var g = this;
				var loading = layer.load();
				this.context.clearParam();
				this.context.put(this.params);
				this.user.doQuery(function(data) {
					layer.close(loading);
					g.updateDatas();
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				});
			},
			updateDatas:function(){
				var vs = this.user.$rowSet.$views;
				if (vs.length == 0) {
					this.datas.splice(0, this.datas.length);
				} else {
					this.datas = vs;
				}
			},
			queryDatasTree:function(){
				var loading = layer.load();
				var g=this;
				this.context.clearParam();
				this.context.set("mdm_code",this.mdm_code);
				
				this.org.doQuery(function(data) {
					var d = g.initTreeOrg(g.org.$rowSet.$views);
					g.zTree = $.fn.zTree.init($("#orgTree"), g.setting, d);
					// 展开第一层菜单
					g.$nextTick(function(){
						var nodes = g.zTree.getNodes();
						$.each(nodes,function(index,itm){
							g.zTree.expandNode(itm,true,false,false,false);
						});				
					});
					
					layer.close(loading);
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				});
			},
			initTreeOrg:function(orgs){	
				var arr = [];
				$.each(orgs, function(index, itm) {
					var m={id:itm.org_code,pid:itm.org_pcode,name:itm.org_name,entity:itm};
					arr.push(m);
				});
				return arr;
			},
			onSelect:function(event, treeId, treeNode, clickFlag){
				if(this.curNode!=treeNode){
					this.curNode=treeNode;
		    		this.curRow = this.curNode.entity;
		    		this.params.org_code=this.curRow.org_code;
		    		this.queryDatas();
				}
			},
			handleCurrentChange:function(val){
				this.page.setPageNumber(val);
				if (this.page.getIsChange()) {
					this.queryDatas();
				}
			},
			handleSizeChange:function(val){
				this.page.setPageRowCount(val);
				if (this.page.getIsChange()) {
					this.queryDatas();
				}
			},
			updateNodes:function(highlight){
				if(this.nodeList==null){
					return;
				}
				var node = null;
				var p = null;
				for (var i = 0, l = this.nodeList.length; i < l; i++) {
				    node = this.nodeList[i];
				    node.highlight = highlight;
				    this.zTree.updateNode(node);
				    if (highlight) {
						p = node.getParentNode();
						if (p && p.open == false) {
						    this.zTree.expandNode(p, true, false, false);
						}
						while (p != null) {
						    p = p.getParentNode();
						    if (p && p.open == false) {
						    	this.zTree.expandNode(p, true, false, false);
						    }
						}
				    }
				}
			},
			getFontCss:function(treeId, treeNode){
				return (!!treeNode.highlight) ? {
				    color : "#A60000",
				    "font-weight" : "bold"
				} : {
				    color : "#333",
				    "font-weight" : "normal"
				};
			}
		},
		// 初始化
		mounted:function(){
			this.context = new SDP.SDPContext();
			this.user = this.context.newDataStore("user");
			this.page=this.user.getPage();
			this.page.setPageNumber(1);
			this.page.setPageRowCount(20);
			this.user.$queryUrl = "/api/common/selectList";
			this.user.statement = "SDP-USER-002";
			
			this.org=this.context.newDataStore("org");
			this.org.$queryUrl = "/api/common/selectList";
			this.org.statement = "SDP-ORG-002";
			
			this.setting = {
				view : {
					fontCss : this.getFontCss,
					selectedMulti : false
				},
				callback:{
					onClick : this.onSelect
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
			
			this.$nextTick(function(){
				this.queryDatasTree();
			});	
		},
		watch:{
			mdmCode:function(val){
				this.mdm_code=val;
			},
			filterText:function(val){
				if (val === '') {
				    return;
				}
				this.updateNodes(false);
				
				var node = this.zTree.getNodesByParamFuzzy("name", val);
				if (node === null) {
				    this.nodeList = [];
				} else {
				    this.nodeList = node;
				}

				this.updateNodes(true);
			}
		}
	});
});