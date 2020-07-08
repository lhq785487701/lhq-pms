"use strict";
$(function(){
	//数据字典
	var dicConf = ['sdp_esp_planDetails','sdp_esp_note'];
	//上下文
	var context = new SDP.SDPContext();
	//角色数据
	var planDetails = context.newDataStore("planDetails");
	planDetails.$keyField = "plan_id";
	var note = context.newDataStore("note");
	note.$keyField = "note_id";
	var noteList = context.newDataStore("noteList");
	noteList.$keyField = "note_id";
	
	var page = note.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(5);
	
	planDetails.$queryUrl = "api/common/selectList";
	planDetails.statement = "SDP-PLAN-002";
	note.$queryUrl = "api/common/selectList";
	note.statement = "SDP-PLAN-003";
	noteList.$queryUrl = "api/common/selectList";
	noteList.statement = "SDP-PLAN-005";
	
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
	
	var rulePlanForm = {
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
		el: '#mainContainer',
		data: {
			params: {
				plan_id: '',
			},
			editDatas: false,
			editNotes: false,
			datas : {},
			page : page,
			dicDatas : {},
			dicMaps : {},
			curRow : {},
			dataNotes: [],
			rulePlanForm: rulePlanForm,
			NoteLists: {
				dataLists: [],
				targetKeys: [],
				moveKeys: []
			}
		}
	}
	
	
	var methods_page = page_conf.methods = {};
	
	// 点击查询按钮
	methods_page.queryDatas = function() {
		pageVue.queryPlanDetails();
		pageVue.queryNotes();
	};
	
	//获取计划详细信息
	methods_page.queryPlanDetails = function(){
		var obj = pageVue.params;
		context.clearParam();//清空参数列表
		context.put(obj);
		var g = this;
		var loading = layer.load();//动画加载,2, {time: 3*1000}
		planDetails.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	}
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = planDetails.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
			//this.NoteLists.targetKeys = this.datas[0].note_id;
		}
	};
	//查询相关笔记
	methods_page.queryNotes = function(){
		var obj = pageVue.params;
		context.clearParam();//清空参数列表
		context.put(obj);
		var g = this;
		note.doQuery(function(data){
			g.updateDataNotes();
		},function(data){
			layer.alert(data.msg);
		});
	}
	
	// 设置笔记数据
	methods_page.updateDataNotes = function() {
		var vs = note.$rowSet.$views;
		if (vs.length == 0) {
			this.dataNotes.splice(0, this.datas.length);
		} else {
			this.dataNotes = vs;
		}
	};
	
	//编辑学习计划
	methods_page.editPlanDetails = function(){
		this.$refs['planForm'].resetFields();
		this.curRow = this.datas[0];
		this.editDatas = true;
	}
	// 修改保存
	methods_page.editDataSave = function() {
		var g = this;
		this.$refs['planForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				planDetails.$saveUrl = "/api/common/update";
				planDetails.$update = 'SDP-PLAN-004';
				planDetails.doSave(function() {
					layer.close(loading);
					g.queryPlanDetails();
					layer.msg('数据保存成功');
					g.dataEdit = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "update");
				g.editDatas = false;
			} else {
				return false;
			}
			
		});
	};
	// 修改取消
	methods_page.editDataCancel = function() {
		this.$refs['planForm'].resetFields();
		this.curRow = {};
		pageVue.queryPlanDetails();
		this.editDatas = false;
	}
	
	//完成学习计划
	methods_page.endPlan = function(){
		var g = this;
		var loading = layer.load();
		context.doAction({
			statement : 'SDP-PLAN-012',
			params : {
				plan_id : g.params.plan_id
			}
		}, '/api/common/update', function(data) {
			layer.close(loading);
			g.queryDatas();
			layer.msg("计划完成");
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	}
	
	//去除html标签
	methods_page.delHtmlTag = function(str) {
		var txt = str.replace(/<pre.+?>([\s\S]+)<\/pre>/g,"").replace(/<[^>]+>/g, "");
		//return txt.substring(0,120);
		if(txt.length < 120){
			return txt;
		}else{
			return txt.substring(0,120);
		}
	}
	
	//打开穿梭框
	methods_page.arrangePlanNotes = function(){
		pageVue.queryNoteList();
		this.NoteLists.moveKeys = [];
		this.editNotes = true;
	}
	
	//获取穿梭框数据
	methods_page.queryNoteList = function(){
		var obj = pageVue.params;
		context.clearParam();//清空参数列表
		context.put(obj);
		var g = this;
		var loading = layer.load();//动画加载,2, {time: 3*1000}
		//源列表数据
		noteList.doQuery(function(data) {
			//layer.close(loading);
			g.updateNoteList();
		}, function(data) {
			//layer.close(loading);
			layer.alert(data.msg);
		});
		//目标列表数据
		context.doAction({
			statement : 'SDP-PLAN-006',
			params : {
				plan_id : g.params.plan_id,
			}
		}, '/api/common/selectList', function(data) {
			layer.close(loading);
			g.updateTargetList(data.data);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	}
	//源目标列表数据格式化
	methods_page.updateNoteList = function(){
		var vs = noteList.$rowSet.$views;
		if (vs.length == 0) {
			this.NoteLists.splice(0, this.datas.length);
		} else {
			this.NoteLists.dataLists = vs;
		}
	}
	//目标列表数据格式化
	methods_page.updateTargetList = function(data){
		var tempArr = [];
		for(var n in data){
			tempArr[n] = data[n].note_id;
		}
		this.NoteLists.targetKeys = tempArr;
	}
	
	//穿梭框显示内容格式
	methods_page.formatList = function(item){
		return item.label;
	}
	//穿梭框功能实现
	methods_page.handleChange = function(newTargetKeys, direction, moveKeys){
		var tempArr = this.NoteLists.moveKeys;
		if(direction=='left'){
			console.log('左');
			tempArr = tempArr.concat(moveKeys);
		}else{
			console.log('右');
			for(var n in moveKeys){
				var index = tempArr.indexOf(moveKeys[n]);
				if(index > -1){
					tempArr.splice(index,1);
				}
			}
		}
		this.NoteLists.targetKeys = newTargetKeys; 
		this.NoteLists.moveKeys = tempArr;
		console.log('删除ID为: ' + this.NoteLists.moveKeys);
	}
	
	//整理确认保存
	methods_page.arrangeDataSave = function(){
		var g = this;
		var loading = layer.load();
		//取消计划关联
		if(!(g.NoteLists.moveKeys==''||g.NoteLists.moveKeys.length==0)){
			context.doAction({
				statement : 'SDP-PLAN-008',
				params : {
					moveKeys : this.NoteLists.moveKeys
				}
			}, '/api/common/update', function(data) {
				/*console.log(data);
				g.editNotes = false;*/
			}, function(data) {
				layer.close(loading);
				layer.alert(data.msg);
			});
		}
		if(!(g.NoteLists.targetKeys==''||g.NoteLists.targetKeys.length==0)){
			//添加计划关联
			context.doAction({
				statement : 'SDP-PLAN-007',
				params : {
					plan_id : g.params.plan_id,
					targetKeys : this.NoteLists.targetKeys
				}
			}, '/api/common/update', function(data) {
				/*layer.close(loading);
				console.log(data);
				g.editNotes = false;*/
				/*layer.msg("成功关联笔记");*/
			}, function(data) {
				layer.close(loading);
				layer.alert(data.msg);
			});
		}
		layer.close(loading);
		layer.msg("成功关联笔记");
		g.queryNotes();
		g.editNotes = false;
	}
	
	// 整理取消
	methods_page.arrangeDataCancel = function() {
		/*pageVue.queryNoteList();
		this.NoteLists.moveKeys = [];*/
		this.editNotes = false;
	}
	
	//计划结束日期格式化
	methods_page.editEndTimeFun = function(date){
		this.curRow.plan_end_time = date;
	}
	
	methods_page.toNoteDetails = function(val){
		//alert('传递的内容为：' + val);
		window.location.href="../noteDetail/noteDetail.html?note_id=" + val + "&plan_id=" + this.params.plan_id; 
	};
	
	// 用户状态格式化
	methods_page.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.role_sts;
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
	
	// 初始化
	page_conf.mounted = function() {
		// 查询角色数据
		this.$nextTick(function(){
			this.params.plan_id=getUrlParam("uuid");
			this.queryDatas();
		});	
	};
	
	var pageVue = new Vue(page_conf);

	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});
	
	//验证结束时间
	function validateEndTime(rule, value, callback) {
		if (!value) {
			return callback(new Error('请输入计划结束时间'));
		}
		var today = new Date().Format();
		if (value < today) {
			return callback(new Error('结束时间不能早于当前时间'));
		}
		return callback();
	}
	
	// 获取地址栏参数
	function getUrlParam(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
		var r = window.location.search.substr(1).match(reg); 
		if (r!=null) 
			return unescape(r[2]); 
		return null; 
	} 
	
	
	
	
	
	
})