$(function() {
	$(".dataDetailStyle").css('height', window.innerHeight);
	
	var context = new SDP.SDPContext();
	
	var project = context.newDataStore("project");
	var project_usernumber=context.newDataStore("project_usernumber");
	var interview_info=context.newDataStore("interview_info");
	var study_plan=context.newDataStore("study_plan");
	var plan_detail=context.newDataStore("plan_detail");
	
	
	//project
	project.$keyField = "proj_code";
	project.$queryUrl = "/api/common/selectList";
	project.statement = "SDP-PROJECT-015";
	
	//project_usernumber
	project_usernumber.$keyField = "proj_user_id";
	project_usernumber.setParentDS(project);
	project_usernumber.$queryUrl = "/api/common/selectList";
	project_usernumber.statement = 'SDP-PROJECT-006';
	project_usernumber.$parentKeys = {
		'proj_code' : 'proj_code'
	};
	
	//interview_info
	interview_info.$keyField = "inter_id";
	interview_info.setParentDS(project);
	interview_info.$queryUrl = "/api/common/selectList";
	interview_info.statement = "SDP-PROJECT-007";
	interview_info.$parentKeys = {
		'proj_code' : 'proj_code'
	};
	
	
	//interview_info问题分页
	var inter_page = interview_info.getPage();
	inter_page.setPageNumber(1);
	inter_page.setPageRowCount(5);
	
	//study_plan
	study_plan.$keyField = "stu_plan_id";
	study_plan.setParentDS(project);
	study_plan.$queryUrl = "/api/common/selectList";
	study_plan.statement = "SDP-PROJECT-008";
	study_plan.$parentKeys = {
		'proj_code' : 'proj_code'
	};
	
	//plan_detail
	plan_detail.$keyField = "plan_detail_id";
	plan_detail.setParentDS(study_plan);
	plan_detail.$queryUrl = "/api/common/selectList";
	plan_detail.statement = "SDP-PROJECT-009";
	plan_detail.$parentKeys = {
		'stu_plan_id' : 'stu_plan_id'
	};
	
	//设置学习计划列表
	var plan_page = study_plan.getPage();
	plan_page.setPageNumber(1);
	plan_page.setPageRowCount(5);
	
	//项目成员列表	
	var colsUsernumber = [{
		      				title : '姓名',
		      				key : 'user_name',
		      				align : 'center',
		      				width : 250,	      				
		      			},
		      			{
		      				title : '项目角色',
		      				align : 'center',
		      				key : 'role_name',
		      				width : 250,
		      			},
		      			{
		      				title : '联系电话',
		      				align : 'center',
		      				key : 'user_mobile',
		      				width : 300,								
		      			}, 
		      			{
		      				title : '任务',
		      				align : 'center',
		      				key : 'proj_task',
		      				width : 400
		      			}]		
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {			
			dataProject:[],
			dataProjectNumber:[],
			dataQuestion:[],
			dataStudyPlan:[],
			dataPlanDetail:[],
			inter_page:inter_page,
			plan_page:plan_page,
			curRow:{},
			curUserInfo:{},
			curStudyPlan:{},				
			columnUsernumber:colsUsernumber,			
			NumberCurRow:{},						
			collapseDetail1 : 1,
			collapseDetail2 : 1,
			collapseDetail3 : 1,
			dataDetailMenuMess : "light",			
		}
	}
	
	var methods_page = page_conf.methods = {};
		
	//设置项目数据
	methods_page.updateProjectDatas = function() {
		var vs = project.$rowSet.$views;
		if (vs.length == 0) {
			this.dataProject.splice(0, this.dataProject.length);
		}
		this.curRow = vs[0];
	};

	//设置用户成员数据
	methods_page.updateDatasUsernumber = function() {
		var vs = project_usernumber.$rowSet.$views;
		if (vs.length == 0) {
			this.dataProjectNumber.splice(0, this.dataProjectNumber.length);
		}
		this.dataProjectNumber = vs;
	};

	//设置面试问题数据
	methods_page.updateDatasQuestion = function() {	
		var vs = interview_info.$rowSet.$views;
		if (vs.length == 0) {
			this.dataQuestion.splice(0, this.dataQuestion.length);
		}
		this.dataQuestion = vs;		
	};
	
	//设置学习计划数据
	methods_page.updateStudyPlan = function() {	
		var vs = study_plan.$rowSet.$views;
		if (vs.length == 0) {
			this.dataStudyPlan.splice(0, this.dataStudyPlan.length);
		}
		this.dataStudyPlan = vs;
	};
	
	//设置plan_detail数据
	methods_page.updatePlanDetail = function() {	
		var vs = plan_detail.$rowSet.$views;
		if (vs.length == 0) {
			this.dataPlanDetail.splice(0, this.dataPlanDetail.length);
		}
		//debugger;
		this.dataPlanDetail = vs;
		//this.planDetailGroupByUser(this.dataPlanDetail);
	};
	
	
	// 改变项目当前页号
	methods_page.handleCurrentChange = function(val) {
		page.setPageNumber(val);
		if (page.getIsChange()) {
			this.queryDatas();
		}
	};
	
	// 改变项目页大小
	methods_page.handleSizeChange = function(val) {
		page.setPageRowCount(val);
		if (page.getIsChange()) {
			this.queryDatas();
		}
	};
	
	// 改变面试信息当前页号
	methods_page.handleInterCurrentChange = function(val) {
		inter_page.setPageNumber(val);
		if (inter_page.getIsChange()) {
			this.queryInterviewInfo(this.curRow);
		}
	};
	
	// 改变面试信息页大小
	methods_page.handleInterSizeChange = function(val) {
		inter_page.setPageRowCount(val);
		if (inter_page.getIsChange()) {
			this.queryInterviewInfo(this.curRow);
		}
	};
	
	// 改变学习计划当前页号
	methods_page.handlePlanCurrentChange = function(val) {
		plan_page.setPageNumber(val);
		if (plan_page.getIsChange()) {
			this.queryStudyPlan(this.curRow);
		}
	};
		
	// 改变学习计划页大小
	methods_page.handlePlanSizeChange = function(val) {
		plan_page.setPageRowCount(val);
		if (plan_page.getIsChange()) {
			this.queryStudyPlan(this.curRow);
		}
	};
	
	//查询项目信息
	methods_page.queryProject= function(action) {
		var g=this;	
		var loading = layer.load();
		project.clearParam();
		project.set('proj_code', action);
		project.doQuery(function(data) {
			g.updateProjectDatas();	
			layer.close(loading);
		}, function(data) {
			layer.alert(data.msg);
			layer.close(loading);
		});					
	}
	
	//查询从表project_usernumber
	methods_page.queryUsernumber = function(action) {
		var g=this;	
		var loading = layer.load();
		project_usernumber.clearParam();
		project_usernumber.set('proj_code', action);
		project_usernumber.doQuery(function(data) {
			g.updateDatasUsernumber();	
			layer.close(loading);
		}, function(data) {
			layer.alert(data.msg);
			layer.close(loading);
		});					
	}
	
	//查询从表interview_info
	methods_page.queryInterviewInfo = function(action) {
		var g=this;
		var loading = layer.load();
		interview_info.clearParam();
		interview_info.set('proj_code', action);
		interview_info.doQuery(function(data) {
			g.updateDatasQuestion();
			layer.close(loading);
		}, function(data) {
			layer.alert(data.msg);
			layer.close(loading);
		});	
	}

	//查询从表study_plan
	methods_page.queryStudyPlan = function(action) {
		var g=this;
		var loading = layer.load();
		study_plan.clearParam();
		study_plan.set('proj_code', action);
		study_plan.doQuery(function(data) {
			g.updateStudyPlan();
			layer.close(loading);
		}, function(data) {
			layer.alert(data.msg);
			layer.close(loading);
		});	
	}
	
	//查询从表plan_detail
	methods_page.queryPlanDetail = function(action) {
		var g=this;
		var loading = layer.load();
		//debugger;
		plan_detail.clearParam();
		plan_detail.set('stu_plan_id', action.stu_plan_id);
		plan_detail.doQuery(function(data) {
			g.updatePlanDetail();
			layer.close(loading);
		}, function(data) {
			layer.alert(data.msg);
			layer.close(loading);
		});	
	}
	

	
	// 初始化
	page_conf.mounted = function() {
		this.$nextTick(function(){				
			this.detailRow('comproj001');
		});	
	};
	
	// 标签选择明细
	methods_page.dataDetailMenuSelect = function(code) {
		showMess(code, "Detail");
	}	
	
	// 改变标签
	function showMess(code, action) {
		var baseMessClass = "baseMess" + action;
		var interviewMessClass = "interviewMess" + action;	
		var studyPlanMessClass="studyPlanMess"+action;
		var studyPlanNumberDetail="studyPlanNumber"+action;
		$("." + baseMessClass).hide();
		$("." + interviewMessClass).hide();	
		$("." + studyPlanMessClass).hide();
		$("." + studyPlanNumberDetail).hide();
		if (baseMessClass == code) {
			$("." + baseMessClass).show();
		} else if (interviewMessClass == code) {
			$("." + interviewMessClass).show();
		} else if (studyPlanMessClass == code) {
			$("." + studyPlanMessClass).show();
		}
	}
	
	//跳转到显示学习成员学习具体进度
	methods_page.studyNumberDetail = function(val){
		$(".studyPlanMessDetail").hide();
		$(".studyPlanNumberDetail").show();	
		
		this.curStudyPlan=val;
		//debugger;
		this.queryPlanDetail(val);
	}		
	
	// 详情确定和取消一样
	methods_page.detailDataCancel = function() {
		//this.recover('Detail');
		this.curRow = {};
		this.dataDetail = false;
	}
	
	//查看项目详情数据
	methods_page.detailRow = function(row) {
		this.queryProject(row);
		this.queryUsernumber(row);
		this.queryInterviewInfo(row);
		this.queryStudyPlan(row);
	};
				
	var pageVue = new Vue(page_conf);	
	
});
