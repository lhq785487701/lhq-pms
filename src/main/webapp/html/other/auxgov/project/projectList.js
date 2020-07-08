"use strict";
$(function() {
	//数据字典
	var dicConf = [ 'gpm_prj_class','gpm_prj_type'];
	
	
	//项目
	var context = new SDP.SDPContext();
	var project_list = context.newDataStore("project_list");
	var page = project_list.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);
	project_list.$queryUrl = "/api/common/selectList";
	project_list.statement = "SDP-RYPROJECT-001";
	//project_list.$saveUrl = "/api/common/insert";
	project_list.$insert = "SDP-RYPROJECT-004";
	project_list.$update = "SDP-RYPROJECT-005";
	
	
	
	
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
			width : 120,
			format : function(row, val) {
				return  pageVue.stsFormat('gpm_prj_type', row,
						'prj_type');
			}
		},
		{
			title : '项目级别',
			key : 'status',
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
				prj_class:'',
				prj_name:''
			},
			page:page,
			projectType:false,
			prj_type:'项目类项目立项',


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
		project_list.doQuery(function(data) {
			g.updateDatas();
			layer.close(loading);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	}



// 设置项目数据
	methods_page.updateDatas = function() {
		var vs = project_list.$rowSet.$views;
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
	
	//选择
	methods_page.searchUserSave = function(){
		if(this.prj_type == '项目类项目立项'){
			window.location.href="XMProjectApproval.html";
		}else{
			window.location.href="approvalRYproject.html";
		}
	}
	//选择表格中的一行事触发
	methods_page.selectTableRow = function(rows){
		   if(rows.length>0){
			   this.curRow = rows[0];
		   }else{
			   this.curRow = {};
		   }
			
	}
	
	
	//把立项数据插入数据库
	methods_page.insertDate = function(){
		/*var r = project_list.newRow();
		var g=this;
			var loading = layer.load();
			var old_version = g.curRow.prj_version;
			g.curRow.from_prj_id = g.curRow.prj_id;
			g.curRow.prj_version = (parseInt(g.curRow.prj_version)+1)+'';
			g.curRow.newest_flag = 'Y';
			context.clearParam();
			context.put(g.curRow);
			project_list.$saveUrl = "/api/common/insert";
			project_list.$insert = 'SDP-RYPROJECT-004';
			project_list.doSave(function(data) {
				data.dataStore.rows[0].$index = 1;
				context.doAction({
					statement : 'SDP-RYPROJECT-005',
					params : {
						prj_id : g.curRow.prj_id
					}
				}, '/api/common/update', function(data) {
					layer.msg("成功更改版本号");
				}, function(data) {
					layer.alert(data.msg);
				});
				layer.close(loading);
				layer.msg('项目立项保存成功');
			}, function(data) {
				layer.close(loading);
				layer.alert(data.msg);
			}, "insert");*/
		//级联
		var r = project_list.newRow();
		var g=this;
			var loading = layer.load();
			var old_version = g.curRow.prj_version;
			g.curRow.from_prj_id = g.curRow.prj_id;
			g.curRow.prj_version = (parseInt(g.curRow.prj_version)+1)+'';
			g.curRow.newest_flag = 'Y';
			context.clearParam();
			context.put(g.curRow);
			context.doDataStores("/api/common/save", function() {
			}, function(data) {
				layer.close(loading);
				layer.alert(data.msg);
			}, "save");
			layer.close(loading);
			layer.msg('项目立项保存成功');
	}			

	
	//项目变更
	methods_page.projectChange = function(){
		if(this.curRow.prj_id){
			this.insertDate();
			if(this.curRow.prj_class=="1"){
				window.location.href="XMProjectApproval_change.html?prj_id="+this.curRow.prj_id;
			}else{
				window.location.href="approvalRYproject_change.html?prj_id="+this.curRow.prj_id;
			}
			
		}else{
			layer.alert('请选择一条单据！')
		}
	}
	
	//项目延期
	methods_page.projectChangePostpone = function(){
		if(this.curRow.prj_code){
			this.insertDate();
			if(this.curRow.prj_class=="1"){
				window.location.href="XMproject_delay.html?prj_code="+this.curRow.prj_code;
			}else{
				window.location.href="RYproject_delay.html?prj_code="+this.curRow.prj_code;
			}
			
		}else{
			layer.alert('请选择一条单据！')
		}
	}
	
	
	//货架数据字典状态格式化
	methods_page.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.shelf_status;
	};

	
	
	var pageVue = new Vue(page_conf);
	
	
	
	
	
	
	
	

	
	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});	

});	
	

	
	