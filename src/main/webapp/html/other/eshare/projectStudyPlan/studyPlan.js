"use strict";
$(function() {
	var context = new SDP.SDPContext();
	var stuPlan = context.newDataStore("studyPlan");
	stuPlan.$keyField = "studyPlan_id";
	
	var page = stuPlan.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(5);
	
	stuPlan.$queryUrl = "/api/common/selectList";
	stuPlan.statement = "SDP-STUDYPLAN-003";//查看所有的计划
	
	var numberList = context.newDataStore("numberList");
	numberList.$keyField = "user_id";
	
	numberList.$queryUrl = "/api/common/selectList";
	numberList.statement = "SDP-STUDYPLAN-001";//查看所有的计划
	
	var createPlan = context.newDataStore("creatPlan");
	createPlan.$keyField = "stu_plan_id";
	
	var findProj = context.newDataStore("findProj");
	findProj.$keyField = "proj_code";
	
	findProj.$queryUrl = "/api/common/selectList";
	findProj.statement = "SDP-STUDYPLAN-009";//查看所有的计划
	//日期格式转换
	Date.prototype.Format = function() {
		var o = {
			"M+" : this.getMonth() + 1, //月份   
			"d+" : this.getDate(), //日 
			"h+": this.getHours(), //小时 
	        "m+": this.getMinutes(), //分 
	        "s+": this.getSeconds() //秒 
		};
		var fmt = "yyyy-MM-dd hh:mm:ss";
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
					.substr(4 - RegExp.$1.length));
		for ( var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
						: (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
	
	//学习计划校验规则
	var rulePlanForm = {
			proj_code: [{
				required: true,
				message: '请选择项目名称',
				trigger: 'change'
			}],
			stu_name: [{
				required: true,
				message: '请填写计划名称',
				trigger: 'blur'
			},{
				type: 'string',
				max: 100,
				message: '计划名称不能超过100个字',
				trigger: 'blur'
			}],
			stu_start_date: [{
				validator : validateStartTime,
				trigger: 'blur,change'
			}],
			stu_end_date: [{
				validator : validateEndTime,
				trigger: 'blur,change'
			}],
			stu_details: [{
				required: true,
				message: "请输入计划描述",
				trigger: 'blur,change'
			},{
				type: 'string',
				max: 500,
				message: '计划详情不能超过500字',
				trigger: 'blur'	
			}]
			
	}
	
	//编辑计划校验规则
	var ruleEditPlanForm = {
			stu_end_date: [{
				validator : validateEditTime,
				trigger: 'blur,change'
			}],
			stu_details: [{
				required: true,
				message: "请输入计划描述",
				trigger: 'blur,change'
			},{
				type: 'string',
				max: 500,
				message: '计划详情不能超过500字',
				trigger: 'blur'	
			}]
			
	}
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				proj_name : '',//选择项目名称
				stu_name : '',//名字匹配查询
				user_id : '',//用户的id
				mgr_code:'',
				stu_plan_id:'',
				proj_code:''
			},
			page : page,
			datas:[],
			user : {},//用户信息
			planCreate: false,
			planEdit:false,
			curRow: {},
			rulePlanForm: rulePlanForm,
			ruleEditPlanForm:ruleEditPlanForm,
			stuid:[],
			loadProj:false,
			projList:[],
			NumberLists: {
				dataLists: [],
				targetKeys: [],
				moveKeys: []
			}
			
		}
	};

	var methods_page = page_conf.methods = {};
	
	// 组件创建
	methods_page.created= function() {
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
				g.params.user_id=SDP.loginUser.userId;
				g.queryDatas();
			}
		}, function(data) {
			layer.alert(data.msg);
		});
	};
	
	// 查询
	methods_page.queryDatas = function() {
		var g = this;
		g.params.mgr_code=g.user.userCode;
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		stuPlan.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = stuPlan.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
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
	
	//转化日期格式
	methods_page.changeDateFormat = function(value) {
		var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
		if(value != null && value != ""){
			if(value.toString().match(reg) == null) {
				if(value.getDate()<10){
					return value.getFullYear() + '-' + (value.getMonth() + 1) + '-' +0+ value.getDate();
				}
				return value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate();
			} 
		} else if (value == "") {
			return null;
		}
	}
	// 查看笔记数据
	methods_page.queryRow = function(stu_plan_id) {
		var url="../project/stuPlanDetails.html?uuid="+stu_plan_id;
		/*if(this.params.data_sort != null &&this.params.data_sort != ''){
			url=url+'&dataSort='+this.params.data_sort;
		}
		if(this.params.plan_name != null&&this.params.plan_name != ''){
			url=url+'&noteName='+this.params.plan_name;
		}*/
		window.location.href=url;
	};
	
	// 编辑计划数据
	methods_page.editRow = function(row) {
		var g=this;
		g.curRow = row;
		g.queryProjNumber();
		g.planEdit=true;
	};
	
	// 编辑保存
	methods_page.editDataSave = function() {
		var g = this;
		g.curRow.stu_end_date = g.changeDateFormat(g.curRow.stu_end_date);
		this.$refs['planEditForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				stuPlan.$saveUrl = "/api/common/update";
				stuPlan.$update = 'SDP-STUDYPLAN-006';
				stuPlan.doSave(function() {
					layer.close(loading);
					g.editNumber();
					g.queryDatas();
					layer.msg('数据保存成功');
					g.planEdit = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "update");
			} else {
				return false;
			}
			
		});
	};
	//成员编辑
	methods_page.editNumber=function(){
		var g = this;
		context.doAction({
			statement : 'SDP-STUDYPLAN-010',
			params : {
				stu_plan_id: g.curRow.stu_plan_id
			}
		}, '/api/common/delete', function(data){
			context.doAction({
				statement : 'SDP-STUDYPLAN-002',
				params : {
					stu_plan_id: g.curRow.stu_plan_id,
					uidList: g.NumberLists.targetKeys
				}
			}, '/api/common/insert',function(data){g.queryDatas();}, null, "insert");
		}, null, "delete");
		 
	};
	// 删除计划
	methods_page.deleteRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否删除[' + row.stu_name + ']计划', {
			btn : ['是','否']
		},function(){
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-STUDYPLAN-004',
				params : {
					stu_plan_id : row.stu_plan_id
				}
			}, '/api/common/delete', null, null);
			context.doAction({
				statement : 'SDP-STUDYPLAN-008',
				params : {
					stu_plan_id : row.stu_plan_id
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
	
	//找项目经理的所有项目
	methods_page.findProjName = function() {
		var g = this;
		g.params.mgr_code=g.user.userCode;
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);	
		findProj.doQuery(function(data) {
			g.updateProjList();
			console.log(data);
		}, null);
	};
	//设置项目数组数据
	methods_page.updateProjList=function(){
		var g = this;
		var vs = findProj.$rowSet.$views;
		if (vs.length == 0) {
			g.projList.splice(0, g.datas.length);
		} else {
			g.projList = vs;
		}
	};
	// 点击创建计划
	methods_page.createPlan = function(projdatas) {
		this.$refs['planForm'].resetFields();
		this.NumberLists.dataLists=[];
		this.NumberLists.targetKeys=[];
		this.findProjName();
		var r = createPlan.newRow();
		r.set('proj_code', '');
		r.set('stu_name', '');
		r.set('stu_start_time', '');
		r.set('stu_end_date', '');
		r.set('stu_details', '');
		r.set('user_code', this.params.user_id);
		r.set('create_user', this.user.userName);
		
		r.set('uidList', this.NumberLists.targetKeys);
		this.curRow = r;
		this.planCreate = true;
	};
	//查询成员
	methods_page.queryProjNumber = function() {
		var g = this;
		if(g.curRow.proj_code!=null&&g.curRow.proj_code!=''){
		g.params.proj_code=g.curRow.proj_code;
		var obj = pageVue.params;
		context.clearParam();//清空参数列表
		context.put(obj);
		//源列表数据
		numberList.doQuery(function(data){
			g.updateNumberList();
			g.change();
			//g.updateTargetList(data);
		},function(data){
			layer.alert(data.msg);
		});
		//目标列表数据
		context.doAction({
			statement : 'SDP-STUDYPLAN-007',
			params : {
				stu_plan_id : g.curRow.stu_plan_id,
			}
		}, '/api/common/selectList', function(data) {
			//console.log('TargetList');
			//console.log(data.data);
			g.updateTargetList(data.data);
		}, function(data) {
			layer.alert(data.msg);
		});
		}
	}
	//设置成员数据
	methods_page.updateNumberList = function() {
		var vs = numberList.$rowSet.$views;
		if (vs.length == 0) {
			this.NumberLists.dataLists.splice(0, this.datas.length);
		} else {
			this.NumberLists.dataLists = vs;
		}
	}
	
	methods_page.change = function() {
		for(var i=0;i<this.NumberLists.dataLists.length;i++){
			this.NumberLists.dataLists[i].label=this.NumberLists.dataLists[i].user_name;
			this.NumberLists.dataLists[i].key=this.NumberLists.dataLists[i].user_id;
		}
	}
	
	//目标列表数据格式化
	methods_page.updateTargetList = function(data){
		var tempArr = [];
		for(var n in data){
			tempArr[n] = data[n].user_id;
		}
		this.NumberLists.targetKeys = tempArr;
	}
	//穿梭框显示内容格式
	methods_page.formatList = function(item){
		return item.label;
	}
	//穿梭框功能实现
	methods_page.handleChange = function(newTargetKeys, direction, moveKeys){
		var g=this;
		var tempArr = g.NumberLists.moveKeys;
		if(direction=='left'){
			tempArr = tempArr.concat(moveKeys);
		}else{
			for(var n in moveKeys){
				var index = tempArr.indexOf(moveKeys[n]);
				if(index > -1){
					tempArr.splice(index,1);
				}
			}
		}
		console.log('ID为: ' + newTargetKeys);
		g.NumberLists.targetKeys = newTargetKeys; 
		g.NumberLists.moveKeys = tempArr;
		//console.log('删除ID为: ' + g.NumberLists.moveKeys);
		//console.log('添加ID为: ' + g.NumberLists.targetKeys);
	}
	//保存学习计划
	methods_page.savePlan = function(){
		var g = this;
		g.curRow.stu_start_date = g.changeDateFormat(g.curRow.stu_start_date);
		g.curRow.stu_end_date = g.changeDateFormat(g.curRow.stu_end_date);
		this.$refs['planForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				createPlan.$saveUrl = "/api/common/insert";
				createPlan.$insert = 'SDP-STUDYPLAN-005';
				createPlan.doSave(function() {
					layer.close(loading);
					g.updateStuid();
					g.giveStudyPlan();
					layer.msg('计划创建成功');
					g.queryDatas();
					g.planCreate = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "insert");
			} else {
				return fasle;
			}
		});
	}
	//指派计划
	methods_page.giveStudyPlan = function() {
		var g = this;
		if(g.NumberLists.targetKeys.length>0){
	    context.doAction({
		statement : 'SDP-STUDYPLAN-002',
		params : {
			stu_plan_id: g.stuid[0].stu_plan_id,
			uidList: g.NumberLists.targetKeys
		}
	}, '/api/common/insert', function(data){g.queryDatas();}, null, "insert");
	}
		}
	methods_page.updateStuid = function() {
		var vs = createPlan.$rowSet.$views;
		if (vs.length == 0) {
			this.stuid.splice(0, this.datas.length);
		} else {
			this.stuid = vs;
		}
	};
	//取消创建
	methods_page.closePlan = function(){
		this.$refs['planForm'].resetFields();
		this.planCreate = false;
	}	
	//取消编辑
	methods_page.closePlanEdit = function(){
		this.$refs['planEditForm'].resetFields();
		this.planEdit = false;
		this.queryDatas();
	}
	//学习计划开始时间
	methods_page.startTimeFun = function(date){
		this.curRow.stu_start_time = date.substr(0,10);
	}
	//计划结束日期格式化
	methods_page.endTimeFun = function(date){
		this.curRow.stu_end_time = date;
	}
	

	//按项目名查询
	methods_page.searchByProjName = function(val){
		this.page.setPageNumber(1);
		this.params.proj_name = val;
		this.queryDatas();
	}
	//按计划名称查询
	methods_page.searchByPlanName = function(){
		this.page.setPageNumber(1);
		this.queryDatas();
		this.params={};
	}
	
	// 初始化
	page_conf.mounted = function() {
		// 查询角色数据
		this.$nextTick(function(){
			this.created();
		});	
	};
	var pageVue = new Vue(page_conf);
	
	//验证开始时间
	function validateStartTime(rule, value, callback) {
		if (!value) {
			return callback(new Error('请输入计划开始时间'));
		}
		var today = new Date().Format().substr(0,10);
		if (value < today) {
			return callback(new Error('开始时间不能早于当前时间'));
		}
		return callback();
	}
	//验证结束时间
	function validateEndTime(rule, value, callback) {
		if (!value) {
			return callback(new Error('请输入计划结束时间'));
		}
		if (value <= pageVue.curRow.stu_start_date) {
			return callback(new Error('结束时间不能早于开始时间'));
		}
		return callback();
	}
	//验证结束时间
	function validateEditTime(rule, value, callback) {
		if (value!=null) {
			return callback(new Error('请输入计划结束时间'));
		}
		if (value <= pageVue.curRow.stu_start_date) {
			return callback(new Error('结束时间不能早于开始时间'));
		}
		return callback();
	}
});