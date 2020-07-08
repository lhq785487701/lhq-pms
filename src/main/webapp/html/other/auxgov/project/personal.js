"use strict";
$(function() {
	//数据字典
	var dicConf = [ 'gpm_department','gpm_prj_type','gpm_prj_level'];
	
	
	
	
	
	
	  //项目列表信息
  /*  var cols = [
		{
			title : '全选',
			type:'selection',
			width : 60
		},
		{
			title : '项目编号',
			key : 'prj_code',
			width : 120
		},
		{
			title : '项目名称',
			key : 'prj_name',
			width : 120
		},
		{
			title : '版本号',
			key : 'prj_version',
			width : 120
		},
		{
			title : '立项年份',
			key : 'prj_year',
			width : 120
		},
		{
			title : '立项月份',
			key : 'prj_month',
			width : 120
		},
		{
			title : '项目类别',
			key : 'prj_type',
			width : 120
		},
		{
			title : '项目级别',
			key : 'prj_level',
			width : 120
		},
		{
			title : '项目开始时间',
			key : 'prj_start_time',
			width : 150
		},
		{
			title : '项目结项时间',
			key : 'prj_end_time',
			width : 150
		}
		];
    */
    

  

	var page_conf = {
		el : "#mainContainer",
		data : {
			dicDatas : {},
			dicMaps : {},
			curRow : {},
			/*columns : cols,*/
			datas:[],
			params : {
			
			},
		/*	page:page,*/
		
		}
	};
	
	
	
	
	var methods_page = page_conf.methods = {};
	
	
	
	




	

	
	
	
	
	
	// 初始化
	page_conf.mounted = function() {
		// 查询项目数据
	
	};
	

	//项目查询
	methods_page.searchDatas = function() {
		
	}
	
	var pageVue = new Vue(page_conf);
	
	
	
	
	
	
	
	

	
	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});	

});	
	

	
	