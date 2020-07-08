$(function() {
	$(".addRight").css('height', window.innerHeight);
	$(".dataAddStyle").css('height', window.innerHeight-140);
	
	var context = new SDP.SDPContext();
	
	var project = context.newDataStore("project");
	var customer=context.newDataStore("customer");
	var project_usernumber=context.newDataStore("project_usernumber");
	var user=context.newDataStore("user");
	var role=context.newDataStore("role");
	var interview_info=context.newDataStore("interview_info");
	var study_plan=context.newDataStore("study_plan");
	var plan_detail=context.newDataStore("plan_detail");
	
	
	//project
	project.$keyField = "proj_code";
	project.$queryUrl = "/api/common/selectList";
	project.statement = "SDP-PROJECT-001";
	project.$insert = 'SDP-PROJECT-002';
	project.$update = 'SDP-PROJECT-010'
	
	//project分页
	var page = project.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(10);
	
	//customer
	customer.$keyField = "cust_id";
	customer.$queryUrl = "/api/common/selectList";
	customer.statement = "SDP-CUSTOMER-001";
	
	//project_usernumber
	project_usernumber.$keyField = "user_id";
	project_usernumber.setParentDS(project);
	project_usernumber.$queryUrl = "/api/common/selectList";
	project_usernumber.statement = 'SDP-PROJECT-006';
	project_usernumber.$insert = 'SDP-PROJECT-003';
	project_usernumber.$update = 'SDP-PROJECT-011';
	project_usernumber.$parentKeys = {
		'proj_code' : 'proj_code'
	};
	
	//user
	user.$keyField = "user_id";
	user.$queryUrl = "/api/common/selectList";
	user.statement = "SDP-USER-002";
	
	//role
	role.$keyField = "role_id";
	role.$queryUrl = "/api/common/selectList";
	role.statement = "SDP-ROLE-001";
	
	//interview_info
	interview_info.$keyField = "inter_id";
	interview_info.setParentDS(project);
	interview_info.$queryUrl = "/api/common/selectList";
	interview_info.statement = "SDP-PROJECT-007";
	interview_info.$insert = 'SDP-PROJECT-004';
	interview_info.$update = 'SDP-PROJECT-012';
	interview_info.$parentKeys = {
		'proj_code' : 'proj_code'
	};
	
	
	//interview_info问题分页
	var inter_page = interview_info.getPage();
	inter_page.setPageNumber(1);
	inter_page.setPageRowCount(5);
	
	//study_plan
	study_plan.$keyField = "plan_id";
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
		'plan_id' : 'plan_id'
	};
	
	//设置学习计划列表
	var plan_page = study_plan.getPage();
	plan_page.setPageNumber(1);
	plan_page.setPageRowCount(5);
	
	//项目列表	
	var cols = [{
		title : '项目编号',
		key : 'proj_code',
		align : 'center',
		width : 120,
		ellipsis : true
	},{
		title : '项目名称',
		align : 'center',
		key : 'proj_name',
		width : 120
	},{
		title : '项目周期(月)',
		align : 'center',
		key : 'proj_scale',
		width : 120,	
	},{
		title : '项目开始时间',
		align : 'center',
		key : 'start_date',
		width : 140
	},{
		title : '项目结束时间',
		align : 'center',
		key : 'end_date',
		width : 140
	},{
		title : '项目上线时间',
		align : 'center',
		key : 'online_date',
		width : 140
	},{
		title : '项目状态',
		align : 'center',
		key : 'proj_state',
		width : 120
	},{
		title : '项目经理',
		align : 'center',
		key : 'proj_mgr',
		width : 100,		
	},{
		title : '项目描述',
		align : 'center',
		key : 'proj_intro',
		width : 200,
	},{
		title : '操作',
		key : 'action',
		align : 'center',
		type:'render',
		width : 155,
		render : actionRender
	} ];
	
	//客户列表
	var colsCust = [{
		title : '客户名称',
		align : 'center',
		key : 'cust_name',
		width : 150
	},{
		title : '客户类型',
		align : 'center',
		key : 'cust_nature',
		width : 100
	},{
		title : '客户电话',
		align : 'center',
		key : 'cust_phone',
		width : 150
	},{
		title : '客户地址',
		align : 'center',
		key : 'cust_addr',
		width : 150
	},{
		title : '客户简介',
		align : 'center',
		key : 'cust_introduce',
		width : 200
	}];
	
	//用户列表
	var colsUser = [{
		title : '用户名',
		align : 'center',
		key : 'user_code',
		width : 150
	},{
		title : '用户姓名',
		align : 'center',
		key : 'user_name',
		width : 150
	},{
		title : '用户电话',
		align : 'center',
		key : 'user_phone',
		width : 200
	},{
		title : '用户email',
		align : 'center',
		key : 'user_email',
		width : 200
	}];
	
	//项目成员列表	
	var colsUsernumber = [{
		      				title : '姓名',
		      				key : 'user_name',
		      				align : 'center',
		      				width : 160,	      				
		      			},
		      			{
		      				title : '项目角色',
		      				align : 'center',
		      				key : 'role_name',
		      				width : 160,
		      			},
		      			{
		      				title : '联系电话',
		      				align : 'center',
		      				key : 'user_mobile',
		      				width : 180,								
		      			}, 
		      			{
		      				title : '任务',
		      				align : 'center',
		      				key : 'proj_task',
		      				width : 350
		      			}]		
	var pre_limit=2
	
	//验证是否为数字
	var validateNumber  = (rule, value, callback) => {
		//debugger;
		if (value == null || value == "") {
			   callback('输入不能为空！');
        }
		else if (!Number.isInteger(parseInt(value)) ) {
            callback(new Error('请输入数字值！'));
        }else{
        	callback();
        }
    };
	
	//新增项目校验
	var ruleAddProject={
			proj_name : [ {
				required : true,
				message : '项目名不能为空！',
				trigger : 'blur'
			}, {
				min : 2,
				max : 50,
				message : '请输入2-50个字符！',
				trigger : 'blur'
			} ],
			proj_mgr : [ {
				required : true,
				message : '项目经理不能为空！',
				trigger : 'blur'
			}, {
				min : 2,
				max : 50,
				message : '请输入2-50个字符！',
				trigger : 'blur'
			} ],	
			start_date : [ {
				required : true,
				message : '项目开始时间不能为空！',
				trigger : 'blur'
			} ],
			end_date : [ {
				required : true,
				message : '项目结束时间不能为空！',
				trigger : 'blur'
			} ],
			online_date : [ {
				required : true,
				message : '项目上线时间不能为空！',
				trigger : 'blur'
			} ],
			proj_state : [ {
				required : true,
				message : '项目状态不能为空！',
				trigger : 'blur'
			} ],
			proj_scale : [{
				required : true,
				validator: validateNumber,
				trigger : 'blur'
			} ],
			cust_name : [{
				required : true,
				message : '客户不能为空！',
				trigger : 'blur'
			} ]
	}
	
	//编辑项目校验
	var ruleEditProject={
			proj_name : [ {
				required : true,
				message : '项目名不能为空！',
				trigger : 'blur'
			}, {
				min : 2,
				max : 50,
				message : '请输入2-50个字符！',
				trigger : 'blur'
			} ],
			proj_mgr : [ {
				required : true,
				message : '项目经理不能为空！',
				trigger : 'blur'
			}, {
				min : 2,
				max : 50,
				message : '请输入2-50个字符！',
				trigger : 'blur'
			} ],	
			start_date : [ {
				required : true,
				message : '项目开始时间不能为空！',
				trigger : 'blur'
			} ],
			end_date : [ {
				required : true,
				message : '项目结束时间不能为空！',
				trigger : 'blur'
			} ],
			online_date : [ {
				required : true,
				message : '项目上线时间不能为空！',
				trigger : 'blur'
			} ],
			proj_state : [ {
				required : true,
				message : '项目状态不能为空！',
				trigger : 'blur'
			} ],
			proj_scale : [{
				required : true,
				validator: validateNumber,
				trigger : 'blur'
			} ],
			cust_name : [{
				required : true,
				message : '客户不能为空！',
				trigger : 'blur'
			} ]
	}
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			columns : cols,
			params : {proj_code : ''},
			datas:[],
			dataCusts:[],
			dataUsers:[],
			dataRoles:[],
			dataProjectNumber:[],
			dataQuestion:[],
			dataStudyPlan:[],
			dataPlanDetail:[],
			//dataReduceStudyPlan:[],
			//userPlanDetails:[],
			page:page,
			inter_page:inter_page,
			plan_page:plan_page,
			curRow:{},
			curUserInfo:{},
			curStudyPlan:{},
			curUsernumber:{},
			curQuestion:{},
			//custRow:{},
			columnCust:colsCust,
			columnUser:colsUser,
			columnUsernumber:colsUsernumber,			
			//NumberCurRow:{},			
			dataAdd:false,
			dataEdit:false,
			dataDetail:false,
			custGet:false,
			userNumberGet:false,
			baseMessAdd:"1",
			baseMessEdit:"1",
			interviewMessAdd:"1",
			interviewMessEdit:"1",
			collapseDetail1 : "1",
			collapseDetail2 : "1",
			collapseDetail3 : "1",	
			dataAddMenuMess:"light",
			dataDetailMenuMess : "light",
			dataEditMenuMess :"light",
			limit:pre_limit,	
			pre_limit:pre_limit,	
			ruleAddProject:ruleAddProject,
			ruleEditProject:ruleEditProject
		}
	}
	
	var methods_page = page_conf.methods = {};
	
	// 点击查询按钮
	methods_page.queryDatas = function() {
		page.setPageNumber(page.getPageNumber());
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;
		project.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
		
	// 设置主列表数据
	methods_page.updateDatas = function() {
		var vs = project.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};
	
	//设置新增项目成员数据
	methods_page.updateDatasUsernumber = function() {
		var vs = project_usernumber.$rowSet.$views;
		if (vs.length == 0) {
			this.dataProjectNumber.splice(0, this.dataProjectNumber.length);
		}
		this.dataProjectNumber = vs;
	};
	
	//设置新增面试问题数据
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
		debugger;
		this.dataPlanDetail = vs;
		//this.planDetailGroupByUser(this.dataPlanDetail);
	};
	
	//将同一个学习成员的明细放在同一个数组中
	/*methods_page.planDetailGroupByUser=function(val){
		$.each(val, function(index, item) {
			this.userPlanDetails=item.items
		});
	}*/
	
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
	
	// 新增项目
	methods_page.addData = function() {
		//debugger;
		var pro = project.newRow();
		pro.set('create_user',this.curUserInfo.userCode);
		pro.set('proj_mgr',this.curUserInfo.userName);
		pro.set('mgr_code',this.curUserInfo.userCode);
		this.curRow = pro;
		/*pro.set('proj_name', '');
		pro.set('proj_code', '');
		pro.set('cust_id','');
		pro.set('proj_intro', '');
		pro.set('start_date', '');
		pro.set('end_date', '');
		pro.set('online_date', '');
		pro.set('proj_scale', '');
		pro.set('proj_state', "1");
		pro.set('proj_mgr', '');
		pro.set('create_user', '');
		pro.set('create_date', '');
		pro.set('proj_scale', '');
		pro.set('remark', '');
		pro.set('proj_step', '');
		pro.set('inter_date','');
		pro.set('inter_addr','');
		pro.set('question_direction','');*/
		//this.custRow={};		
		
		this.updateDatasUsernumber();
		this.updateDatasQuestion();	
		
		/*this.dataQuestion = [];
		this.dataProjectNumber=[];*/
		this.dataAdd = true;    	
	};	
	
	//获取用户信息
	methods_page.getUserInfo= function() {
		var g = this;
		var url = "/api/user/getUserInfo?t=" + new Date().getTime();
		context.doAction({}, url, function(data) {
			if (data.data != null) {
				//debugger;
				SDP.loginUser = data.data;
				$.each(data.data.attrs, function(index, itm) {
					for ( var n in itm) {
						SDP.loginUser[n] = itm[n];
					} 
				});
				g.curUserInfo = SDP.loginUser;				
			}
		}, function(data) {
			layer.alert(data.msg);
		});
	};
	
	// 新增项目保存
	methods_page.addDataSave = function() {	
		var g=this;
		console.log(this.$refs['dataAddForm']);
		this.$refs['dataAddForm'].validate(function(valid) {
			//debugger;
			if (valid) {
				var loading = layer.load();				
				g.changeDates();
				project.$saveUrl = "/api/common/insert";				
				project.doSave(function(data) {
					//debugger;					
					//插入项目成员
					project_usernumber.set("proj_code", data.dataStore.rows[0].proj_code);
					project_usernumber.$saveUrl = "/api/common/insert";					
					project_usernumber.doSave(null, function(data) {layer.msg('无项目成员数据');}, "insert");						
					layer.close(loading);
					
					//插入问题与答案
					interview_info.set("proj_code", data.dataStore.rows[0].proj_code);
					interview_info.$saveUrl = "/api/common/insert";					
					interview_info.doSave(null, function(data) {layer.msg('无面试问题数据');}, "insert");			
					
					g.queryDatas();
					layer.msg('数据新增成功');
					g.dataAdd = false;
					g.recover('Add');
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "insert");						
			} else {				
				layer.msg('数据新增失败!');
			}
		});		
	};
		
	// 新增取消
	methods_page.addDataCancel = function() {		
		this.curRow = {};
		//this.custRow={};
		this.dataProjectNumber=[];
		this.dataQuestion=[];
		this.recover('Add');
		this.$refs.dataAddForm.resetFields();
		this.dataAdd=false;
		this.queryDatas();
	}
	
	//编辑项目
	methods_page.editData = function(row) {
		this.dataEdit = true;
		row.set('update_user',this.curUserInfo.userCode);
		this.curRow = row;
		project.setCurRow(row);	
		this.queryUsernumber(row);
		this.queryInterviewInfo(row);
	};
	
	//编辑项目保存
	methods_page.editDataSave = function(){
		var g=this;
		console.log(this.$refs['dataEditForm']);
		this.$refs['dataEditForm'].validate(function(valid) {
			debugger;
			if (valid) {
				var loading = layer.load();
				g.changeDates();
				
				//添加更新人
				//this.addUpdateUser();
				
				//更新从表的数据
				project_usernumber.$saveUrl = "/api/common/save";
				project_usernumber.doSave(null, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "save");
				
				interview_info.$saveUrl = "/api/common/save";
				interview_info.doSave(null, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "save");
				
				//更新主表的数据
				project.$saveUrl = "/api/common/update";
				project.doSave(function() {
					g.queryDatas();
					layer.msg('数据保存成功!');
					g.dataEdit = false;
					g.recover('Edit');
				}, function(data) {
					layer.alert(data.msg);
				}, "update");		
				layer.close(loading);
			}else{
				layer.msg('数据修改失败!');
			}
		})
	};
			
	//编辑项目取消
	methods_page.editDataCancel = function(){
		debugger;
		this.$refs.dataEditForm.resetFields();
		this.curRow = {};
		this.dataProjectNumber=[];
		this.dataQuestion=[];
		this.recover('Edit');
		this.dataEdit=false;
		this.queryDatas();
	}
	
	//恢复页面
	methods_page.recover = function(action) {
		var baseMessAction = "baseMess"+action;
		if(action == "Add") {
			this.$refs.iMenuAdd.currentActiveName = baseMessAction;		
		} else if (action == "Detail") {
			this.$refs.iMenuDetail.currentActiveName = baseMessAction;
		} else if (action == "Edit") {
			this.$refs.iMenuEdit.currentActiveName = baseMessAction;		
		}
		
		$(".baseMess" + action).show();
        $(".interviewMess" + action).hide();
        $(".studyPlanMess" + action).hide();
        $(".otherMess" + action).hide();
        $(".studyPlanNumber" + action).hide();
    }
	
	//查询从表project_usernumber
	methods_page.queryUsernumber = function(action) {
		var g=this;	
		var loading = layer.load();
		project_usernumber.clearParam();
		project_usernumber.set('proj_code', action.proj_code);
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
		interview_info.set('proj_code', action.proj_code);
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
		study_plan.set('proj_code', action.proj_code);
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
		plan_detail.set('plan_id', action.plan_id);
		plan_detail.doQuery(function(data) {
			g.updatePlanDetail();
			layer.close(loading);
		}, function(data) {
			layer.alert(data.msg);
			layer.close(loading);
		});	
	}
	
	//改变所有日期类型的格式
	methods_page.changeDates = function() {		
		this.curRow.start_date = this.changeDateFormat(this.curRow.start_date);
		this.curRow.end_date = this.changeDateFormat(this.curRow.end_date);
		this.curRow.online_date = this.changeDateFormat(this.curRow.online_date);
		
		//转化面试时间		
		for(var i = 0; i < this.dataQuestion.length; i++) {
			this.dataQuestion[i].inter_date = this.changeDateFormat(this.dataQuestion[i].inter_date);
		}
	}
	
	//转化日期格式
	methods_page.changeDateFormat = function(value) {
		var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
		if(value != null && value != ""){
			if(value.toString().match(reg) == null) {
				return value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate();
			} 
		} else if (value == "") {
			return null;
		}
	}
	
	//新增项目从表数据
	methods_page.handleAdd = function(action) {
		var g=this;
		if(action == 'ProjectNumber') {
			if(g.dataProjectNumber.length != 0 && g.dataProjectNumber[g.dataProjectNumber.length-1].user_name == "") {
				if(g.dataProjectNumber[g.dataProjectNumber.length-1].status==1){
					layer.msg("成员名称为空，无法新增");
					return;
				}
			}			
			/*var r=new Object();*/
			var c=project_usernumber.newRow();
			c.number=g.dataProjectNumber.length+1;
			c.user_name='';
			c.role_name='';
			c.user_mobile='';
			c.proj_task='';
			c.status=1;
			//g.dataProjectNumber.push(c);
		}else if(action=='Question'){
			if(g.dataQuestion.length != 0 && g.dataQuestion[g.dataQuestion.length-1].inter_question == "") {
				if(g.dataQuestion[g.dataQuestion.length-1].status==1){
					layer.msg("问题为空，无法新增");
					return;
				}
			}									
			var i=interview_info.newRow();			
			var number = interview_info.$rowSet.findByMaxValue('number')+1;
			i.set('number', number);		
			i.set('inter_question', '');
			i.set('inter_answer', '');
			i.set('status', 1);
			i.set('inter_date','');
			i.set('inter_addr','');
			i.set('question_direction','');	
			i.set('interviewer','');	
			i.set('interviewee','');	
			i.set('create_user',this.curUserInfo.userCode);
			//g.dataQuestion.push(i);
		}
    }; 
    
    //移除
    methods_page.handleRemove =  function(index, action) {    	
    	var g=this;
    	if(action == 'ProjectNumber') {
    		if(g.dataProjectNumber[index].status == 1) {
    			//g.dataProjectNumber[index].status=0;
    			project_usernumber.$rowSet.delRow(g.dataProjectNumber[index]);   			
    		} else{
    			context.doAction({
    				statement : "SDP-PROJECT-013",
    				params : {
    					user_id : this.dataProjectNumber[index].user_id
    				}
    			}, '/api/common/delete', function(data) {
    				g.dataProjectNumber.splice(index, 1);
    				layer.msg("删除成功");
    			}, function(data) {
    				layer.close(tindex);
    				layer.alert(data.msg);
    			});
    		}    		
    	}else if(action == 'Question') {
    		if(g.dataQuestion[index].status == 1) {
    			//g.dataQuestion[index].status=0; 
    			interview_info.$rowSet.delRow(g.dataQuestion[index]);
    		} else{
    			context.doAction({
    				statement : "SDP-PROJECT-014",
    				params : {
    					inter_id : this.dataQuestion[index].inter_id
    				}
    			}, '/api/common/delete', function(data) {
    				g.dataQuestion.splice(index, 1);
    				layer.msg("删除成功");
    			}, function(data) {
    				layer.close(tindex);
    				layer.alert(data.msg);
    			});    		    			
    		}
    	}
    };
	
    //客户选择弹出框
	methods_page.selectCust = function(index) {
		this.custGet = true;
		var loading = layer.load();
		var g = this;
		customer.clearParam();
		customer.doQuery(function(data) {
			layer.close(loading);
			g.updateDataCust();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});		
	}
	
	//设置客户列表数据
	methods_page.updateDataCust = function() {
		var vs = customer.$rowSet.$views;
		if (vs.length == 0) {
			this.dataCusts.splice(0, this.dataCusts.length);
		} else {
			this.dataCusts = vs;
		}
	};
	
	//选中一个客户，回传一个当前行
	methods_page.selectOneCust = function(val) {
		this.custCurrentRow = val;
	}
	
	//确定客户
	methods_page.custGetOk = function() {
		this.curRow.set("cust_id",this.custCurrentRow.item.cust_id);
		this.curRow.set("cust_name",this.custCurrentRow.item.cust_name);
		this.curRow.set("cust_nature",this.custCurrentRow.item.cust_nature);
		this.curRow.set("cust_phone",this.custCurrentRow.item.cust_phone);
		this.curRow.set("cust_addr",this.custCurrentRow.item.cust_addr);
		this.curRow.set("cust_introduce",this.custCurrentRow.item.cust_introduce);
		//虽然ok可以关闭，但是双击事件不会关闭，所以执行关闭
		this.custGet = false;
	}
	
	//客户弹出框取消
	methods_page.custGetCancel = function() {
		this.custCurrentRow="";			
	}
	
	//项目成员选择弹出框
	methods_page.selectUserNumber = function(index) {
		this.userNumberGet = true;
		var loading = layer.load();
		var g = this;
		user.clearParam();
		user.doQuery(function(data) {
			layer.close(loading);
			g.updateUsers();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});		
	}
	
	//设置用户列表数据
	methods_page.updateUsers = function() {
		var vs = user.$rowSet.$views;
		if (vs.length == 0) {
			this.dataUsers.splice(0, this.dataUsers.length);
		} else {
			this.dataUsers = vs;
		}
	};
	
	//选中一个项目成员，回传一个当前行
	methods_page.selectOneUserNumber = function(val) {
		this.UserNumberCurrentRow = val;
	}
	
	//确定项目成员
	methods_page.userNumberGetOk = function() {
		var g=this;
		this.user=g.UserNumberCurrentRow.item;
		var c=project_usernumber.newRow();
		
		var number = project_usernumber.$rowSet.findByMaxValue('number')+1;
		c.set('number', number);
		c.set('user_name', this.user.user_name);
		c.set('role_name', '');
		c.set('user_mobile', this.user.user_mobile);
		c.set('user_id', this.user.user_id);
		c.set('proj_task', '');
		c.set('status', 1);
		c.set('create_user',this.curUserInfo.userCode);
						
		//g.dataProjectNumber.push(c);
		//虽然ok可以关闭，但是双击事件不会关闭，所以执行关闭
		this.userNumberGet = false;
	}
	
	//项目成员弹出框取消
	methods_page.userNumberGetCancel = function() {
		this.UserNumberCurrentRow="";			
	}
	
	//项目角色下拉框
	methods_page.roleSelect = function() {
		var g=this;
		role.doQuery(function(data) {
			g.updateDataRole();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});		
	}
    
	methods_page.updateDataRole = function() {
		var vs = role.$rowSet.$views;
		if (vs.length == 0) {
			this.dataRoles.splice(0, this.dataCusts.length);
		} else {
			this.dataRoles = vs;
		}
	};
	
	// 初始化
	page_conf.mounted = function() {
		this.$nextTick(function(){
			this.queryDatas();
			this.roleSelect();
			this.getUserInfo();
		});	
	};
	
	// 标签选择新增
	methods_page.dataAddMenuSelect = function(code) {
		showMess(code, "Add");		
	}
	
	// 标签选择编辑
	methods_page.dataEditMenuSelect = function(code) {
		showMess(code, "Edit");
	}
	
	// 标签选择明细
	methods_page.dataDetailMenuSelect = function(code) {
		showMess(code, "Detail");
	}

	//给从表加上更新人（通过status做判定，为0，且执行了修改的说明更新了）
	/*methods_page.addUpdateUser = function(){
		//给userNumber增加
		debugger;
		for(var i=0;i<this.dataProjectNumber;i++){
			if(this.dataProjectNumber[i].hasOwnProperty('status') || this.dataProjectNumber[i].status != 1){
				this.dataProjectNumber[i].update_user = this.curUserInfo.userCode;
			}
		}		
		//给question增加
		for(var i=0;i<this.dataQuestion;i++){
			if(this.dataQuestion[i].status !== undefined || this.dataQuestion[i].status != 1){
				this.dataQuestion[i].update_user = this.curUserInfo.userCode;
			}
		}	
	}*/
	
	
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
	
	//删除项目
	methods_page.deleteRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否删除[' + row.proj_name + ']', {
			btn : ['是','否']
		},function(){
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-PROJECT-005',
				params : {
					proj_code : row.proj_code
				}
			}, '/api/common/delete', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas();
				layer.msg("成功删除");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	

	// 显示更多
	methods_page.getMoreMess=function(action){	
		if($(".moreBut"+action).text()=="收起"){
			this.limit=this.pre_limit;
			$(".moreBut"+action).text("更多");
		}else{			
			this.limit=this.dataProprams.length;
			$(".moreBut"+action).text("收起");
		}		
	}
	
	// 详情确定和取消一样
	methods_page.detailDataCancel = function() {
		this.curRow = {};
		//this.custRow={};
		this.dataProjectNumber=[];
		this.dataQuestion=[];
		this.recover('Detail');
		this.curRow = {};
		this.dataDetail = false;
		this.queryDatas();
	}
	
	//查看项目详情数据
	methods_page.detailRow = function(row) {
		this.dataDetail = true;
		this.curRow = row;
		project.setCurRow(row);			
		this.queryUsernumber(row);
		this.queryInterviewInfo(row);
		this.queryStudyPlan(row);
	};
				
	var pageVue = new Vue(page_conf);	
	
	// 表格内行操作
	function actionRender(h, row, column, index) {
		var arr = [];
		arr.push(initBtn(h, "详情", "fa fa-clipboard", function() {
			pageVue.detailRow(row);
			//window.location.href='projectInformation.html';
		}));
		arr.push(initBtn(h, "编辑", "fa fa-edit", function() {
			pageVue.editData(row);
		}));
		arr.push(initBtn(h, "删除", "fa fa-remove", function() {
			pageVue.deleteRow(row);
		}));
		return h('button-group', {
		attrs : {size : 'small'}
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
	
});
