/**
 * 用户登录日志脚本
 * 
 * @文件名 loginLogAnaly
 * @作者 李浩祺
 * @创建日期 2017-10-27
 * @版本 V 1.0
 */
"use strict";
$(function() {
	// 数据字典
	var dicConf = [ 'sdp_system' ];
	// 上下文
	var context = new SDP.SDPContext();

	var page = context.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);

	var cols = [
			{
				title : '帐号',
				key : 'userId',
				width : 120,
				format:function(row,val){
					if(row.userName!=null && row.userName!=''){
						return row.userName;
					}
					return val;
				}
			},
			{
				title : '发生时间',
				key : 'create',
				width : 150
			},
			{
				title : '类型',
				key : 'type',
				width : 80
			}, {
				title : '访问IP',
				key : '$client_ip',
				width : 120
			}, {
				title : '服务IP',
				key : 'serverIp',
				width : 160
			}, {
				title : '系统',
				key : 'system',
				width : 180,
				format : function(row, val) {
					return pageVue.systemFormat('sdp_system', row,
							'system');
				}
			} , {
				title : '信息',
				key : 'message',
				width : 200
			}  ];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				type : '',
				system:'',
				userId:'',
				dateTime :[moment(new Date()).subtract(1,"days"),moment(new Date()).add(1,"days")]
			},
			isAdmin:parent?parent.SDP.loginUser.systemAdmin:false,
			datas : [],
			page : page,
			dicDatas : {},
			dicMaps : {},
			curRow : {},
			columns : cols
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
		var dateTime=obj.dateTime;
		if(dateTime==null || dateTime.length<2){
			layer.alert("查询条件时间必填!");
			return;
		}
		var loading = layer.load();
		var g = this;
		var must={"create":{"gte":dateTime[0],"lt":dateTime[1]}};
		if(obj.system!=null && obj.system!=""){
			must["system"]=obj.system;
		}
		if(obj.type!=null && obj.type!=""){
			must["type"]=obj.type;
		}
		var matchMulti=null;
		if(obj.userId!=null && obj.userId!=''){
			must["userId"]=obj.userId;
			matchMulti={};
			matchMulti[obj.userId]=['userId','userName'];
		}
		var order={"create":"desc"};
		var where={"must":must};
		if(matchMulti!=null){
			where['matchMulti']=matchMulti;
		}
		
		context.doAction({"params":{"order":order,"where":where},page:page.toObject()},"/api/loginLog/queryLog",function(data) {
			layer.close(loading);
			var arr=data.data;
			$.each(arr,function(index,itm){
				itm["create"]=moment(itm["create"]).format("YYYY-MM-DD hh:mm:ss");
			});
			page.$initData(data['page']);
			g.datas=arr;
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
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
		// 查询角色数据
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