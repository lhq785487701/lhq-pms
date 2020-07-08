/**
 * 我的项目数据容器脚本
 * 
 */
"use strict";
$(function() {
	//建立高度
	$(".heightStyle").css('height', window.innerHeight-500);
	//数据字典
	var dicConf = ['sdp_esp_proj'];
	// 上下文
	var context = new SDP.SDPContext();
	
	var curProj = context.newDataStore("curProj");
	curProj.$keyField = "user_id";
	curProj.$queryUrl = "api/common/selectList";
	curProj.statement = "SDP-MYPROJECT-001";
	
	var hisProj = context.newDataStore("hisProj");
	hisProj.$keyField = "user_id";
	hisProj.$queryUrl = "api/common/selectList";
	hisProj.statement = "SDP-MYPROJECT-002";
	
	var curProjDetail = context.newDataStore("curProjDetail");
	curProjDetail.$keyField = "proj_code";
	curProjDetail.$queryUrl = "api/common/selectList";
	curProjDetail.statement = "SDP-MYPROJECT-003";
	
	var projProbSol = context.newDataStore("projProbSol");
	projProbSol.$keyField = "proj_code";
	projProbSol.$queryUrl = "api/common/selectList";
	projProbSol.statement = "SDP-MYPROJECT-004";
	
	var editProbSol = context.newDataStore("editProbSol");
	editProbSol.$keyField = "problum_id";
	
	var studyPlan = context.newDataStore("studyPlan");
	studyPlan.$keyField = "user_id";
	studyPlan.$queryUrl = "api/common/selectList";
	studyPlan.statement = "SDP-MYPROJECT-008";
	
	var stuPlanDetail = context.newDataStore("stuPlanDetail");
	stuPlanDetail.$keyField = "plan_id";
	stuPlanDetail.$queryUrl = "api/common/selectList";
	stuPlanDetail.statement = "SDP-MYPROJECT-009";
	
	var stuDatePlan = context.newDataStore("stuDatePlan");
	stuDatePlan.$keyField = "plan_id";
	stuDatePlan.$queryUrl = "api/common/selectList";
	stuDatePlan.statement = "SDP-MYPROJECT-010";
	
	var inteMess = context.newDataStore("inteMess");
	inteMess.$keyField = "user_id";
	inteMess.$queryUrl = "api/common/selectList";
	inteMess.statement = "SDP-MYPROJECT-014";
	
	var page1 = hisProj.getPage();
	page1.setPageNumber(1);
	page1.setPageRowCount(5);
	
	var page2 = studyPlan.getPage();
	page2.setPageNumber(1);
	page2.setPageRowCount(5);
	
	var page3 = inteMess.getPage();
	page3.setPageNumber(1);
	page3.setPageRowCount(10);
	
	// 编辑校验
	var ruleProbForm = {
		problem_name: [{
			required: true,
			type: 'string',
			message: "疑难问题标题不能为空",
			trigger: 'blur'
		},{
			type: 'string',
			max: 40,
			message: '疑难问题标题不能超过40个字',
			trigger: 'blur'
		}],
	};
	// 编辑校验
	var ruleInteForm = {
			problem_code: [{
				required: true,
				type: 'string',
				message: "请选择项目编号",
				trigger: 'blur'
			}],
			inter_date: [{
				required: true,
				type: 'date',
				message: "面试日期不能为空",
				trigger: 'blur,change'
			}],
			inter_addr: [{
				required: true,
				type: 'string',
				message: "面试地址不能为空",
				trigger: 'blur'
			}],
			question_direction: [{
				required: true,
				type: 'string',
				message: "面试领域不能为空",
				trigger: 'blur'
			}],
			inter_name: [{
				required: true,
				type: 'string',
				message: "面试标题不能为空",
				trigger: 'blur'
			}],
			inter_question: [{
				required: true,
				type: 'string',
				message: "面试题目不能为空",
				trigger: 'blur'
			}],
			inter_answer: [{
				required: true,
				type: 'string',
				message: "面试答案不能为空",
				trigger: 'blur'
			}],
	};
	
	var colsCur = [{
		title : '项目编号',
		key : 'proj_code',
		align : 'center',
		width : 240
	},{
		title : '项目名称',
		align : 'center',
		key : 'proj_name',
		width : 240
	},{
		title : '项目状态',
		align : 'center',
		key : 'proj_state',
		width : 200,
		type:'render',
		render : function(h, row, column, index) {
			var ele = h('span', pageVue.stsFormat('sdp_esp_proj', row,
					'proj_state'));
			return ele;
		}
	},{
		title : '项目经理',
		align : 'center',
		key : 'proj_mgr',
		width : 200
	},{
		title : '操作',
		key : 'action',
		align : 'center',
		type:'render',
		width : 200 ,
		render : actionRender
	} ];
	
	var colsHis = [{
			title : '项目编号',
			key : 'proj_code',
			align : 'center',
			width : 240
		},{
			title : '项目名称',
			align : 'center',
			key : 'proj_name',
			width : 240
		},{
			title : '项目状态',
			align : 'center',
			key : 'proj_state',
			width : 200,
			type:'render',
			render : function(h, row, column, index) {
				var ele = h('span', pageVue.stsFormat('sdp_esp_proj', row,
						'proj_state'));
				return ele;
			}
		},{
			title : '项目经理',
			align : 'center',
			key : 'proj_mgr',
			width : 200
		},{
			title : '操作',
			key : 'action',
			align : 'center',
			type:'render',
			width : 200 ,
			render : queryRender
		} ];
	
	var colInte = [{
        type: 'expand',
        width: 50,
        render: function(h, params) {
            return h(expandRow, {
                props: {
                    row: params
                }
            })
        }
    },{
		title : '面试小标题',
		key : 'inter_name',
		align : 'center',
		_expanded: true,
		width : 190
	},{
		title : '所属项目',
		align : 'center',
		key : 'proj_name',
		width : 190
	},{
		title : '面试时间',
		align : 'center',
		key : 'inter_date',
		width : 160
	},{
		title : '面试地点',
		align : 'center',
		key : 'inter_addr',
		width : 170
	},{
		title : '面试领域',
		align : 'center',
		key : 'question_direction',
		width : 170
	},{
		title : '面试经理',
		align : 'center',
		key : 'interviewer',
		width : 160
	},];
	
	//页面配置初始化
	var page_config = {
		el: "#myProject",
		expandRow: expandRow,
		data: {
			page1 : page1,
			page2 : page2,
			page3 : page3,
			params: {
				user_id: '',
				proj_code: '',
				proj_name: '',
				problem_id: '',
				plan_id: '',
				stu_name: '',
				section_dateStart: '',
				section_dateEnd: '',
				inter_answer: ''
			},
			dateDatas:{
				inter_date:'',
			},
			//项目信息
			dataCur : [],
			dataHis : [],
			dataDetail: [],
			dataProbSol:[],
			columnsCur : colsCur,
			columnsHis : colsHis,
			dicDatas : {},
			dicMaps : {},
			projLearnedEditor: false,
			projProbEditor: false,
			probData:{},
			learnedData:{},
			ruleProbForm: ruleProbForm,
			//学习计划
			stuPlanEditor: false,
			addStuDetail: false,
			stuDetails:{},
			stuDateDetail:{},
			stuData: [],
			stuPlanData: [],
			stuDateData: [],
			dataStuNote:[
			             {stu_noteName:'笔记名称，点击下载'},
			             {stu_noteName:'笔记名称，点击下载'},
			             {stu_noteName:'笔记名称，点击下载'}
			],
			//面试信息
			columnsInte : colInte,
			ruleInteForm: ruleInteForm,
			addInteMess:false,
			inteMessData: [],
			inteInfo:{},
		}
	};
	
	var methods_main = page_config.methods = {};
	
	// 展开问题及答案
	var expandRow = new Vue({
		el:"#aaa",
		props: {
			row: Object
		}
	});
	
	//标签选择
	methods_main.menuSelect = function(code) {
		showMess(code);
	}
	
	// 格式化日期
	methods_main.fomatDates = function(daterange) {
		this.params.section_dateStart = daterange[0];
		this.params.section_dateEnd = daterange[1];
	}
	methods_main.inteDateChange = function(date) {
		this.dateDatas.inter_date = date;
	}
	

/*---------------------------------------------------项目信息----------------------------------------*/
	
	// 查询当前项目数据
	methods_main.queryCurProjData = function() {
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;
		curProj.doQuery(function(data) {
			layer.close(loading);
			g.updateCurProjData();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置当前项目数据
	methods_main.updateCurProjData = function() {
		var vs = curProj.$rowSet.$views;
		if (vs.length == 0) {
			this.dataCur.splice(0, this.dataCur.length);
		} else {
			this.dataCur = vs;
		}
	};
	
	// 查询历史项目数据
	methods_main.queryHisProjData = function() {
		page1.setPageNumber(page1.getPageNumber());
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;
		hisProj.doQuery(function(data) {
			layer.close(loading);
			g.updateHisProjData();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置主列表数据
	methods_main.updateHisProjData = function() {
		var vs = hisProj.$rowSet.$views;
		if (vs.length == 0) {
			this.dataHis.splice(0, this.dataHis.length);
		} else {
			this.dataHis = vs;
		}
	};
	
	// 查询当前项目明细数据
	methods_main.queryCurProjDetail = function() {
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;
		curProjDetail.doQuery(function(data) {
			layer.close(loading);
			g.updateCurProjDetail();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_main.updateCurProjDetail = function() {
		var vs = curProjDetail.$rowSet.$views;
		if (vs.length == 0) {
			this.dataDetail.splice(0, this.dataDetail.length);
		} else {
			this.dataDetail = vs;
		}
	};
	
	// 查询疑难突破的数据
	methods_main.queryProbData = function() {
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;
		projProbSol.doQuery(function(data) {
			layer.close(loading);
			g.updateProbDate();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_main.updateProbDate = function() {
		var vs = projProbSol.$rowSet.$views;
		if (vs.length == 0) {
			this.dataProbSol.splice(0, this.dataProbSol.length);
		} else {
			this.dataProbSol = vs;
		}
	};
	//去除html标签
	methods_main.delHtmlTag = function(str) {
		return str.replace(/<[^>]+>/g, "");
	}
	
	// 保存项目心得数据
	methods_main.projLearnedSave = function() {
		var g = this;
		this.$refs['projLearnedForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				context.doAction({
					statement : 'SDP-MYPROJECT-005',
					params : {
						user_id: g.params.user_id,
						user_code: g.dataCur[0].user_code,
						proj_code: g.params.proj_code,
						proj_learned: g.learnedData.proj_learned,
					}
				}, '/api/common/update', function(data) {
					layer.close(loading);
					g.queryCurProjDetail();
					layer.msg("保存成功");
					g.projLearnedEditor = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				});
			} else {
				return false;
			}
		});
	};
	// 取消编辑
	methods_main.projLearnedCancel = function() {
		this.learnedData.proj_learned='';
		this.$Message.info('取消编辑');
		this.projLearnedEditor = false;
	};
	
	// 保存疑难突破数据
	methods_main.projProbSave = function() {
		var g = this;
		this.$refs['probSolForm'].validate(function(valid) {
			if (valid) {
				var text = $.trim(tinyMCE.get('projProbEditor').getBody().innerText);
				if(text.length == 0 || text == ''){
					layer.msg('操作失败，内容不能为空！');  
					tinyMCE.get('projProbEditor').focus();
					return false;
				}else{
					var loading = layer.load();
					var problem_id = g.probData.problem_id;
					if(problem_id == '' || problem_id == 0 || problem_id == undefined){
						context.doAction({
							statement : 'SDP-MYPROJECT-006',
							params : {
								user_id : g.params.user_id,
								user_code: g.dataCur[0].user_code,
								proj_code : g.dataDetail[0].proj_code,
								problem_name : g.probData.problem_name,
								problem_detail : tinyMCE.get('projProbEditor').getContent(),
							}
						}, '/api/common/insert', function(data) {
							layer.close(loading);
							g.queryProbData();
							layer.msg("保存成功");
							tinymce.remove('textarea');
							g.projProbSol = false;
						}, function(data) {
							layer.close(loading);
							layer.alert(data.msg);
						});
					}else{
						context.doAction({
							statement : 'SDP-MYPROJECT-007',
							params : {
								user_id : g.params.user_id,
								user_code: g.dataCur[0].user_code,
								problem_id : g.probData.problem_id,
								problem_name : g.probData.problem_name,
								problem_detail : tinyMCE.get('projProbEditor').getContent(),
							}
						}, '/api/common/update', function(data) {
							layer.close(loading);
							g.queryProbData();
							layer.msg("更新成功");
							g.probData.problem_id='';
							tinymce.remove('textarea');
							g.projProbSol = false;
						}, function(data) {
							layer.close(loading);
							layer.alert(data.msg);
						});
					}
				}
			} else {
				return false;
			}
		});
	};
	// 取消编辑
	methods_main.projProbCancel = function() {
		this.probData.problem_id='';
		this.probData.problem_name='';
		tinymce.remove('textarea');
		this.$Message.info('取消编辑');
		this.projProbSol = false;
	};
	
	//进入当前项目详细
	methods_main.toCurProj = function(row){
 	   this.params.proj_code = row.proj_code;
 	   this.queryCurProjDetail();
 	   this.queryProbData();
 	   showCurProj();
	}
	
	// 打开项目心得编辑
	methods_main.updateProjLearned = function(data) {
		this.learnedData.proj_learned = data;
		this.projLearnedEditor = true;
	};
	
	// 添加疑难突破
	methods_main.addProbSol = function() {
		this.initEditor();
		this.projProbEditor = true;
	};
	
	// 编辑疑难突破
	methods_main.editorProbSol = function(id,name,detail) {
		this.probData.problem_id=id;
		this.probData.problem_name=name;
		$('#projProbEditor').text(detail);
		this.initEditor();
		this.projProbEditor = true;
	};
	
	//连接历史项目基本信息
	methods_main.toHisProDetail = function(row){
		window.location.href="projectInformation.html?proj_code="+row.proj_code;
	}
	
	// 角色状态格式化(表格)
	methods_main.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.proj_state;
	};
	// 角色状态格式化(页面)
	methods_main.stsFormatDetail = function(col) {
		var m = this.dicMaps[table];
		if (typeof(col) !="undefined" && m[col] != null && m[col] != "") {
			return m[col];
		}
		return "";
	};
	
	// 改变当前页号
	methods_main.handleCurrentChange1 = function(val) {
		page1.setPageNumber(val);
		if (page1.getIsChange()) {
			this.queryHisProjData();
		}
	};
	// 改变页大小
	methods_main.handleSizeChange1 = function(val) {
		page1.setPageRowCount(val);
		if (page1.getIsChange()) {
			this.queryHisProjData();
		}
	};
	
/*---------------------------------------------------学习计划----------------------------------------*/	
	
	//进入学习计划明细页面
	methods_main.planDetail = function(id) {
		this.params.plan_id=id;
		this.queryStuPlanDetail();
		this.queryStuDatePlan();
		planDetailShow();
	}

	//编辑学习计划内容
	methods_main.editStuDetail = function(details){
		this.stuDetails.stu_details = details;
		this.stuPlanEditor = true;
	}
	//添加每天学习内容
	methods_main.addDateStu = function(){
		this.addStuDetail = true;
	}
	//下载笔记
	methods_main.downloadNote = function(){
		//editDetailShow();
	}
	
	// 查询学习计划数据
	methods_main.queryStuPlan = function() {
		page2.setPageNumber(page2.getPageNumber());
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;
		studyPlan.doQuery(function(data) {
			layer.close(loading);
			g.updateStuPlan();
			g.params.proj_code='';
			g.params.section_dateStart='';
			g.params.section_dateEnd='';
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_main.updateStuPlan = function() {
		var vs = studyPlan.$rowSet.$views;
		if (vs.length == 0) {
			this.stuData.splice(0, this.stuData.length);
		} else {
			this.stuData = vs;
		}
	};
	
	// 查询学习计划明细数据
	methods_main.queryStuPlanDetail = function() {
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;
		stuPlanDetail.doQuery(function(data) {
			layer.close(loading);
			g.updateStuPlanDetail();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_main.updateStuPlanDetail = function() {
		var vs = stuPlanDetail.$rowSet.$views;
		if (vs.length == 0) {
			this.stuPlanData.splice(0, this.stuPlanData.length);
		} else {
			this.stuPlanData = vs;
		}
	};
	
	// 查询每天学习情况数据
	methods_main.queryStuDatePlan = function() {
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;
		stuDatePlan.doQuery(function(data) {
			layer.close(loading);
			g.updateStuDatePlan();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_main.updateStuDatePlan = function() {
		var vs = stuDatePlan.$rowSet.$views;
		if (vs.length == 0) {
			this.stuDateData.splice(0, this.stuDateData.length);
		} else {
			this.stuDateData = vs;
		}
	};
	
	// 编辑学习内容
	methods_main.stuPlanDetailsSave = function() {
		var g = this;
		this.$refs['stuPlanDetailsForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				context.doAction({
					statement : 'SDP-MYPROJECT-012',
					params : {
						plan_id: g.stuDateData[0].plan_id,
						stu_details: g.stuDetails.stu_details,
						user_code: g.dataCur[0].user_code,
					}
				}, '/api/common/update', function(data) {
					layer.close(loading);
					g.queryStuPlanDetail();
					layer.msg("保存成功");
					g.stuPlanEditor = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				});
			} else {
				return false;
			}
		});
	};
	// 取消编辑
	methods_main.stuPlanDetailsCancel = function() {
		this.stuDetails.stu_details = "";
		this.$Message.info('取消编辑');
		this.stuPlanEditor = false;
	}
	
	// 新增每天学习内容
	methods_main.addStuDetailSave = function() {
		var g = this;
		this.$refs['stuDateDetailForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				context.doAction({
					statement : 'SDP-MYPROJECT-013',
					params : {
						plan_id: g.stuDateData[0].plan_id,
						stu_time: g.stuDateDetail.stu_time,
						stu_detail: g.stuDateDetail.stu_detail,
						user_code: g.dataCur[0].user_code,
					}
				}, '/api/common/insert', function(data) {
					layer.close(loading);
					g.queryStuDatePlan();
					layer.msg("保存成功");
					g.addStuDetail = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				});
			} else {
				return false;
			}
		});
	};
	// 新增取消
	methods_main.addStuDetailCancel = function() {
		this.stuDateDetail.stu_time = '';
		this.stuDateDetail.stu_detail = '';
		this.$Message.info('取消编辑');
		this.addStuDetail = false;
	}
	
	// 改变当前页号
	methods_main.handleCurrentChange2 = function(val) {
		page2.setPageNumber(val);
		if (page2.getIsChange()) {
			this.queryStuPlan();
		}
	};
	// 改变页大小
	methods_main.handleSizeChange2 = function(val) {
		page2.setPageRowCount(val);
		if (page2.getIsChange()) {
			this.queryStuPlan();
		}
	};
	
/*---------------------------------------------------面试信息----------------------------------------*/	
	
	// 面试信息查询
	methods_main.queryInteMess = function() {
		page3.setPageNumber(page3.getPageNumber());
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;
		inteMess.doQuery(function(data) {
			layer.close(loading);
			g.updateInteMess();
			g.params.section_dateStart='';
			g.params.section_dateEnd='';
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	methods_main.updateInteMess = function(){
		var vs = inteMess.$rowSet.$views;
		if (vs.length == 0) {
			this.inteMessData.splice(0, this.inteMessData.length);
		} else {
			this.inteMessData = vs;
		}
	}
	
	// 打开新增面试信息页面
	methods_main.addData = function() {
		this.addInteMess = true;
	};
	// 新增保存
	methods_main.addDataSave = function() {
		var g = this;
		this.$refs['inteForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				context.doAction({
					statement : 'SDP-MYPROJECT-015',
					params : {
						proj_code: g.inteInfo.proj_code,
						inter_date: g.dateDatas.inter_date,
						inter_addr: g.inteInfo.inter_addr,
						interviewer: g.inteInfo.interviewer,
						question_direction: g.inteInfo.question_direction,
						inter_name: g.inteInfo.inter_name,
						inter_question: g.inteInfo.inter_question,
						inter_answer: g.inteInfo.inter_answer,
						user_id: g.params.user_id,
						user_code: g.dataCur[0].user_code,
					}
				}, '/api/common/insert', function(data) {
					layer.close(loading);
					g.queryInteMess();
					layer.msg("保存成功");
					g.addInteMess = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				});
			} else {
				return false;
			}
		});
	};
	// 新增取消
	methods_main.addDataCancel = function() {
		this.inteInfo = {};
		this.$Message.info('取消编辑');
		this.addInteMess = false;
	}
	
	// 改变当前页号
	methods_main.handleCurrentChange3 = function(val) {
		page3.setPageNumber(val);
		if (page3.getIsChange()) {
			this.queryInteMess();
		}
	};
	// 改变页大小
	methods_main.handleSizeChange3 = function(val) {
		page3.setPageRowCount(val);
		if (page3.getIsChange()) {
			this.queryInteMess();
		}
	};
	
	//初始化文本编辑器
	methods_main.initEditor = function(){
		tinymce.init({
			selector: 'textarea',
			branding: false,
			elementpath: false,
			height: 400,
			language: 'zh_CN',
			menubar: 'edit insert view format tools',
			theme: 'modern',
			plugins: [
				'advlist autolink lists link charmap print preview hr anchor pagebreak imagetools',
				'searchreplace visualblocks visualchars code fullscreen fullpage',
				'insertdatetime nonbreaking save contextmenu directionality',
				'paste textcolor colorpicker textpattern imagetools codesample'
			],
			toolbar1: ' newnote fullscreen preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link codesample',
			/*autosave_interval: '20s',*/
			image_advtab: true,
			table_default_styles: {
				width: '100%',
				borderCollapse: 'collapse'
			},
			//代码框大小
			codesample_dialog_width: 480,
			codesample_dialog_height: 400
		});
	}
	
	//改变标签
	function showMess(code) {
		var projMess = "projMess";
		var stuMess = "stuMess";
		var inteMess = "inteMess";
		var curProj = "curProj";
		var planDetail = "planDetail";
		$("." + projMess).hide();
		$("." + stuMess).hide();
		$("." + inteMess).hide();
		$("." + curProj).hide();
		$("." + planDetail).hide();
		if(projMess == code) {
			$("." + projMess).show();
			pageVue.queryCurProjData();
			pageVue.queryHisProjData();
		} else if (stuMess == code) {
			$("." + stuMess).show();
			pageVue.queryStuPlan();
		} else if (inteMess == code) {
			$("." + inteMess).show();
			pageVue.queryInteMess();
		}
	}
	
	//打开当前项目页面
	function showCurProj() {
		var projMess = "projMess";
		var curProj = "curProj";
		$("." + projMess).hide();
		$("." + curProj).show();
	}
	//打开学习计划页面
	function planDetailShow(){
		var planDetail = "planDetail";
		var stuMess = "stuMess";
		$("." + stuMess).hide();
		$("." + planDetail).show();
	}
	
	// 获取地址栏数据
	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r!=null) {
			return unescape(r[2]);
		}
		return null;
	}
	
	//获取用户信息
	methods_main.getUserInfo= function() {
		var g = this;
		var url = "/api/user/getUserInfo?t=" + new Date().getTime();
		context.doAction({}, url, function(data) {
			if (data.data != null) {
				SDP.loginUser = data.data;
				$.each(data.data.attrs, function(index, itm) {
					for ( var n in itm) {
						SDP.loginUser[n] = itm[n];
					} 
				});
				g.user = SDP.loginUser;
				//g.params.user_id=SDP.loginUser.userId;
				g.params.user_id='52';
				g.queryCurProjData();
				g.queryHisProjData();
			}
		}, function(data) {
			layer.alert(data.msg);
		});
	};
	
	// 初始化查询
	page_config.mounted = function() {
		this.$nextTick(function(){
		//  this.params.user_id = getUrlParam("user_id");
			this.getUserInfo();
		});	
	};

	//实例化vue
	var pageVue = new Vue(page_config);
	
	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});
	
	// 表格内行操作
	function actionRender(h, row, column, index) {
		return h('div', [
		          h('i-button', {
		        	  attrs: {
		                    type: 'info',
		                    size: 'small',
		               },
		               on: {
		                   click: () => {
		                	   pageVue.toCurProj(row);
		                  }
		               }
		         }, '进入项目'),
		  ])
	}
	function queryRender(h, row, column, index) {
		return h('div', [
		          h('i-button', {
		        	  attrs: {
		                    type: 'info',
		                    size: 'small',
		               },
		               on: {
		                   click: () => {
		                   pageVue.toHisProDetail(row);
		                  }
		               }
		         }, '明细信息'),
		  ])
	}
	
});