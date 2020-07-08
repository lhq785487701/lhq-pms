"use strict";
$(function() {
	//数据字典
	//数据字典
	var dicConf = [ 'gpm_department','gpm_prj_type','gpm_prj_level'];
	
	
	
	//项目
	var context = new SDP.SDPContext();
	var project = context.newDataStore("project");
	var page = project.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);
	project.$queryUrl = "/api/common/selectList";
	project.statement = "SDP-RYPROJECT-001";
	
	
	
	
	  //项目列表信息
    var cols = [
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
    
    

  

	var page_conf = {
		el : "#mainContainer",
		data : {
			dicDatas : {},
			dicMaps : {},
			curRow : {},
			columns : cols,
			datas:[],
			params : {
				
			},
			page:page,
			
		}
	};
	
	
	
	
	var methods_page = page_conf.methods = {};
	
	
	
	//项目信息查询
	methods_page.queryDatas = function() {
		var loading = layer.load();
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var g=this;
		project.doQuery(function(data) {
			g.updateDatas();
			layer.close(loading);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	}



// 设置项目数据
	methods_page.updateDatas = function() {
		var vs = project.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};
	
	
	//项目查询
	methods_page.searchDatas = function() {
		this.queryDatas();
	}

	//项目选择
	methods_page.searchCancel=function() {
		
	}


	
	
	//使用者改变当前页号
	methods_page.handleCurrentChange = function(val) {
		page.setPageNumber(val);
		if (page.getIsChange()) {
			this.queryDatas();
		}
	};
	// 使用者改变页大小
	methods_page.handleSizeChange = function(val) {
		page.setPageRowCount(val);
		if (page.getIsChange()) {
			this.queryDatas();
		}
	};
	
	
	
	
	// 初始化
	page_conf.mounted = function() {
		// 查询项目数据
		this.$nextTick(function(){
			this.queryDatas();
		});
	};
	
	//显示选择立项项目类型
	methods_page.selectProjectType = function(){
		this.projectType = true;
	}
	
	//取消选择
	methods_page.searchUserCancel = function(){
		this.projectType = false;
	}
	
	
	//选择表格中的一行事触发
	methods_page.selectTableRow = function(rows){
		   if(rows.length>0){
			   this.curRow = rows[0];
		   }else{
			   this.curRow = {};
		   }
			
	}
	//项目变更
	methods_page.projectChange = function(){
		if(this.curRow.prj_code){
			window.location.href="approvalRYproject_change.html?prj_code="+this.curRow.prj_code;
		}else{
			layer.alert('请选择一条单据！')
		}
	}
	
	
	var pageVue = new Vue(page_conf);
	
	
	
	
	
	
	
	

	
	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});	

});	
	

	
	