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
    
    var columnsYear = [
		{
			title : '序号',
			key : 'line_no',
			width : 60
		}, {
			title : '年度',
			key : 'date',
			width : 120,
			filters: [
                {
                    label: '2007~2012',
                    value: 1
                },
                {
                    label: '2013~2018',
                    value: 2
                }
            ],
            filterMultiple: false,
		}, {
			title : '立项名称',
			key : 'proj_name',
			width : 140
		} , {
			title : '立项时间',
			key : 'create_date',
			width : 140,
			filters: [
                {
                    label: '2007~2012',
                    value: 1
                },
                {
                    label: '2013~2018',
                    value: 2
                }
            ],
            filterMultiple: false,
		},  {
			title : '结项时间',
			key : 'finish_date',
			width : 140,
			filters: [
                {
                    label: '2007~2012',
                    value: 1
                },
                {
                    label: '2013~2018',
                    value: 2
                }
            ],
            filterMultiple: false,
		},{
			title : '项目分类',
			key : 'proj_sort',
			width : 140,
			filters: [
                {
                    label: '国级',
                    value: 1
                },
                {
                    label: '省级',
                    value: 2
                }
            ],
            filterMultiple: false,
		},{
			title : '项目等级',
			key : 'proj_level',
			width : 140,
			filters: [
                {
                    label: '特级',
                    value: 1
                },
                {
                    label: '一级',
                    value: 2
                }
            ],
            filterMultiple: false,
		},{
			title : '项目责任人',
			key : 'proj_res',
			width : 140
		},{
			title : '主导单位',
			key : 'corr_dept',
			width : 150,
			filters: [
                {
                    label: '百度公司',
                    value: 1
                },
                {
                    label: '阿里巴巴',
                    value: 2
                }
            ],
            filterMultiple: false,
		},{
			title : '申报公司',
			key : 'declare_comp',
			width : 150,
			filters: [
                {
                    label: '百度公司',
                    value: 1
                },
                {
                    label: '阿里巴巴',
                    value: 2
                }
            ],
            filterMultiple: false,
		},{
			title : '项目总目标',
			key : 'proj_goal',
			width : 150
		},{
			title : '项目激励',
			key : 'proj_exc',
			width : 140
		},{
			title : '操作',
			key : 'action',
			align : 'left',
			width : 80,
			type:'render',
//				render : actionRender
		}
	];
	
	var columnsSatisfy = [
		{
			title : '序号',
			key : 'line_no',
			width : 60
		}, {
			title : '年度',
			key : 'date',
			width : 120,
			filters: [
                {
                    label: '2007~2012',
                    value: 1
                },
                {
                    label: '2013~2018',
                    value: 2
                }
            ],
            filterMultiple: false,
		}, {
			title : '项目组人员',
			key : 'proj_person',
			width : 140
		} , {
			title : '项目总个数',
			key : 'proj_total',
			width : 140
		},  {
			title : '个人总激励',
			key : 'per_exc',
			width : 140
		},{
			title : '个人项目成功率',
			key : 'per_present',
			width : 140
		},{
			title : '操作',
			key : 'action',
			align : 'left',
			width : 80,
			type:'render',
//				render : actionRender
		}
	];
	
	var columnsUnfinished = [
		{
			title : '序号',
			key : 'line_no',
			width : 60
		}, {
			title : '年度',
			key : 'date',
			width : 120
		}, {
			title : '立项名称',
			key : 'proj_name',
			width : 140
		} , {
			title : '立项时间',
			key : 'create_date',
			width : 140
		},  {
			title : '结项时间',
			key : 'finish_date',
			width : 140
		},{
			title : '项目分类',
			key : 'proj_sort',
			width : 140
		},{
			title : '项目等级',
			key : 'proj_level',
			width : 140
		},{
			title : '参与项目岗位',
			key : 'attend_proj',
			width : 140
		},{
			title : '主导单位',
			key : 'corr_dept',
			width : 150
		},{
			title : '申报公司',
			key : 'declare_comp',
			width : 150
		},{
			title : '项目总目标',
			key : 'proj_goal',
			width : 150
		},{
			title : '项目激励',
			key : 'proj_exc',
			width : 140
		},{
			title : '操作',
			key : 'action',
			align : 'left',
			width : 80,
			type:'render',
//				render : actionRender
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
			datasYear:[],
			satisfyDatas:[],
			unfinishedDatas:[],
			params : {
				
			},
			page:page,
			columnsYear:columnsYear,
			columnsSatisfy:columnsSatisfy,
			columnsUnfinished:columnsUnfinished,
			
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
	

	
	