"use strict";
$(function() {
	//项目
	var context = new SDP.SDPContext();
	var project = context.newDataStore("project");
	var page = project.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);
	project.$queryUrl = "/api/common/selectList";
	project.statement = "AUX-GOV-PRJ-CLOSE-006";
	
	//数据字典
	var dicConf = [ 'gpm_prj_class','gpm_phase','gpm_close_status'];
	
	  //项目列表信息
    var cols = [
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
			title : '项目类型',
			key : 'prj_class',
			width : 120,
			format : function(row,val) {
				return  pageVue.stsFormat('gpm_prj_class', row,
						'prj_class');
			}
		},
		{
			title : '结项年份',
			key : 'close_year',
			width : 120
		},
		{
			title : '结项类型',
			key : 'prj_close_status',
			width : 120,
			format : function(row,val) {
				return  pageVue.stsFormat('gpm_close_status', row,
						'prj_close_status');
			}
		},
		{
			title : '项目负责人',
			key : 'prj_leader',
			width : 120
		},
		{
			title : '对应部门',
			key : 'prj_org',
			width : 120
		},
		{
			title : '结项入账公司',
			key : 'close_account_company',
			width : 200
		},
		{
			title : '状态',
			key : 'prj_status',
			width : 120,
			format : function(row,val) {
				return  pageVue.stsFormat('gpm_status', row,
						'prj_status');
			}
		},
		{
			title : '操作',
			key : 'action',
			align : 'center',
			width : 110,
			fixed : 'right',
			type:'render',
			render : actionRender
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
	
	// 数据字典格式化
	methods_page.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.col;
	};
	
	//跳入结项申请页面
	methods_page.goProjectClose = function(currentRow , action) {
		var row;
		if(action == 'action'){
			row = currentRow;
		}else{
			row = currentRow.item;
		}
		if(row.prj_class == '1'){
			window.location.href="XMProjectCompleteApply.html?prj_id="+row.prj_id;
		}else{
			window.location.href="RYProjectCompleteApply.html?prj_id="+row.prj_id;
		}
	};
	
	// 初始化
	page_conf.mounted = function() {
		// 查询项目数据
		this.$nextTick(function(){
			this.queryDatas();
		});
	};
	
	var pageVue = new Vue(page_conf);
	
	// 操作
	function actionRender(h, row, column, index) {
		var arr = [];
		
		arr.push(initBtn(h, "结项", "fa fa-check", function(e) {
			pageVue.goProjectClose(row ,'action');
			e.stopPropagation();
		}));

		/*arr.push(initBtn(h, "延期", "fa fa-user-times", function() {
		}));

		arr.push(initBtn(h, "废弃", "fa fa-remove", function() {
		}));*/

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
	
	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});	

});	
	

	
	