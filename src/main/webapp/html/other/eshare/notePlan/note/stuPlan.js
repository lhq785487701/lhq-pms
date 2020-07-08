"use strict";
$(function() {
	var context = new SDP.SDPContext();
	var stuPlan = context.newDataStore("stuPlan");
	stuPlan.$keyField = "stuPlan_id";
	
	var page = stuPlan.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(5);
	
	stuPlan.$queryUrl = "/api/common/selectList";
	stuPlan.statement = "SDP-PLAN-009";//查看所有的计划
	
	var createPlan = context.newDataStore("createPlan");
	createPlan.$keyField = "plan_id";
	
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
			plan_title: [{
				required: true,
				message: '请填写计划名称',
				trigger: 'blur'
			},{
				type: 'string',
				max: 100,
				message: '计划名称不能超过100个字',
				trigger: 'blur'
			}],
			plan_start_time: [{
				validator : validateStartTime,
				trigger: 'blur,change'
			}],
			plan_end_time: [{
				validator : validateEndTime,
				trigger: 'blur,change'
			}],
			plan_remark: [{
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
				data_sort : '',//选择月份
				plan_name : '',//名字匹配查询
				user_id : '',//用户的id
			},
			page : page,
			datas:[],
			user : {},//用户信息
			planCreate: false,
			curRow: {},
			rulePlanForm: rulePlanForm
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
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var g = this;
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
	
	// 查看笔记数据
	methods_page.queryRow = function(plan_id) {
		var url="../plan/planDetails.html?uuid="+plan_id;
		if(this.params.data_sort != null &&this.params.data_sort != ''){
			url=url+'&dataSort='+this.params.data_sort;
		}
		if(this.params.plan_name != null&&this.params.plan_name != ''){
			url=url+'&noteName='+this.params.plan_name;
		}
		console.log(url);
		window.location.href=url;
	};
	
	// 查看笔记是否分享
	methods_page.ifEnd = function(plan_state) {
		if(plan_state=="start"){
			return true;
		}else{
			return false;
		}
	};
	// 查看笔记长度
	methods_page.noteLength = function(text) {
		if( text != null && text.length > 183){          /* 一行大概60个字,5行302*/
			return true;
		}
			return false;
	};
	
	// 编辑计划数据
	methods_page.editRow = function(row) {
		/*this.curRow = row;
		this.dataEdit = true;*/
		window.location.href="../plan/planDetails.html?uuid="+ row.plan_id;
	};
	
	// 删除计划
	methods_page.deleteRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否删除[' + row.plan_title + ']计划', {
			btn : ['是','否']
		},function(){
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-PLAN-010',
				params : {
					plan_id : row.plan_id
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
	
	// 点击创建计划
	methods_page.createPlan = function() {
		this.$refs['planForm'].resetFields();
		var r = createPlan.newRow();
		r.set('plan_title', '');
		r.set('plan_start_time', new Date().Format());
		r.set('plan_end_time', '');
		r.set('plan_remark', '');
		r.set('user_code', this.params.user_id);
		this.curRow = r;
		this.planCreate = true;
	};
	
	//保存学习计划
	methods_page.savePlan = function(){
		var g = this;
		this.$refs['planForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				createPlan.$saveUrl = "/api/common/insert";
				createPlan.$insert = 'SDP-PLAN-011';
				createPlan.doSave(function() {
					layer.close(loading);
					g.queryDatas();
					layer.msg('计划创建成功');
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
	
	//取消创建
	methods_page.closePlan = function(){
		this.$refs['planForm'].resetFields();
		this.planCreate = false;
	}	
	
	//学习计划开始时间
	methods_page.startTimeFun = function(date){
		this.curRow.plan_start_time = date;
	}
	//计划结束日期格式化
	methods_page.endTimeFun = function(date){
		this.curRow.plan_end_time = date;
	}
	

	//按月查询
	methods_page.dateFun = function(val){
		this.page.setPageNumber(1);
		this.params.data_sort = val;
		this.queryDatas();
	}
	//按名称查询
	methods_page.searchByNoteName = function(){
		this.page.setPageNumber(1);
		this.queryDatas();
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
		if (value <= pageVue.curRow.plan_start_time) {
			return callback(new Error('结束时间不能早于开始时间'));
		}
		return callback();
	}
});