"use strict";
$(function(){
	//数据字典
	var dicConf = ['sdp_esp_planDetails','sdp_esp_note'];
	//上下文
	var context = new SDP.SDPContext();
	//角色数据
	var planDetails = context.newDataStore("planDetails");
	planDetails.$keyField = "stu_plan_id";
	
	
	planDetails.$queryUrl = "api/common/selectList";
	planDetails.statement = "SDP-STUDYPLAN-012";
	
	var stuPlan = context.newDataStore("stuPlan");
	stuPlan.$keyField = "stu_plan_id";
	
	
	stuPlan.$queryUrl = "api/common/selectList";
	stuPlan.statement = "SDP-STUDYPLAN-011";
	// 头部配置
	var page_conf = {
		el: '#mainContainer',
		data: {
			params: {
				stu_plan_id: '',
			},
			datas : [],
			planDetail:[],
			dicDatas : {},
			dicMaps : {},
			curRow : {}
		}
	}
	
	
	var methods_page = page_conf.methods = {};
	
	// 查询
	methods_page.queryDatas = function() {
		pageVue.queryStuPlan();
		pageVue.queryPlanDetails();
	};
	
	//获取计划详细信息
	methods_page.queryStuPlan = function(){
		var obj = pageVue.params;
		context.clearParam();//清空参数列表
		context.put(obj);
		var g = this;
		var loading = layer.load();//动画加载,2, {time: 3*1000}
		stuPlan.doQuery(function(data) {
			layer.close(loading);
			g.updateStuPlanDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	}
	// 设置数据
	methods_page.updateStuPlanDatas = function() {
		var vs = stuPlan.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};
	
	//获取计划详细信息
	methods_page.queryPlanDetails = function(){
		var obj = pageVue.params;
		context.clearParam();//清空参数列表
		context.put(obj);
		var g = this;
		var loading = layer.load();//动画加载,2, {time: 3*1000}
		planDetails.doQuery(function(data) {
			layer.close(loading);
			g.updatePlanDetailsDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	}
	// 设置数据
	methods_page.updatePlanDetailsDatas = function() {
		var vs = planDetails.$rowSet.$views;
		if (vs.length == 0) {
			this.planDetail.splice(0, this.datas.length);
		} else {
			this.planDetail = vs;
		}
	};
	
	
	
	// 初始化
	page_conf.mounted = function() {
		// 查询角色数据
		this.$nextTick(function(){
			this.params.stu_plan_id=getUrlParam("uuid");
			this.queryDatas();
		});	
	};
	
	var pageVue = new Vue(page_conf);

	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});
	
	
	// 获取地址栏参数
	function getUrlParam(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
		var r = window.location.search.substr(1).match(reg); 
		if (r!=null) 
			return unescape(r[2]); 
		return null; 
	} 
	
	
	
	
	
	
})