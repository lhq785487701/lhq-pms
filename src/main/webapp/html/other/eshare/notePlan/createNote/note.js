
"use strict";
$(function(){
	
	//数据字典
	var dicConf = ['sdp_esp_note'];
	//上下文
	var context = new SDP.SDPContext();
	//角色数据
	var note = context.newDataStore("note");
	note.$keyField = "note_id";
	var page = note.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(5);
	
	note.$queryUrl = "api/common/selectList";
	note.statement = "SDP-NOTE-001";
	
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
	
	var cols = [{
	        title: '文章标题',
	        key: 'note_title',
	        width: 705,
	        type: 'render',
	        render: function(h,row, column, index){
	        	return h('a',{
	        		style: {
	        			fontWeight: 'bold'
	        		},
	        		attrs: {
	        			href: '#'
	        		}
	        	},row.note_title);
	        }
	    },
	    {
	        title: '阅读数',
	        key: 'read_num',
	        align: 'center',	
	        sortable: true,
	        width: 100
	    },
	    {
	        title: '评论数',
	        key: 'total_score',
	        align: 'center',
	        sortable: true,
	        width: 100
	    },
	    {
	        title: '收藏数',
	        key: 'note_collect',
	        align: 'center',
	        sortable: true,
	        width: 100
	    },
	    {
	        title: '评分',
	        key: 'score_num',
	        align: 'center',
	        sortable: true,
	        width: 90
	    },
	    {
	        title: '操作',
	        key: 'action',
	        align: 'center',
	        width: 270,
	        type: 'render',
	        render: actionRender
	    }];
	
	
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
				trigger : 'blur,change'
			}],
			plan_end_time: [{
				validator : validateEndTime,
				trigger : 'blur,change'
			}],
			plan_remark: [{
				type: 'string',
				max: 500,
				message: '计划详情不能超过500字',
				trigger: 'blur'
			}]
			
	}

	//页面配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				sequence: '',
				create_date: '',
				note_title: ''
			},
			datas : [],
			page : page,
			dicDatas : {},
			dicMaps : {},
			curRow : {},
			columns: cols,
			planCreate: false,
			planForm: {
				plan_title: '',
				plan_start_time: '2017-10-16 08:29:40',
				plan_end_time: "",
				plan_remark: ''
			},
			rulePlanForm: rulePlanForm
			
		} 
	}
	
	var methods_page = page_conf.methods = {};
	
	// 点击查询按钮
	methods_page.queryDatas = function() {
		var obj = pageVue.params;
		context.clearParam();//清空参数列表
		context.put(obj);
		var g = this;
		var loading = layer.load();//动画加载,2, {time: 3*1000}
		note.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = note.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};
	
	
	//导航栏点击跳转
	methods_page.toMenu = function(name){
		switch(name){
			case 'share': 
				console.log('查看分享');
				break;
			case 'plan-create': 
				console.log('创建计划');
				this.createPlan();
				break;
			case 'plan-show': 
				console.log('查看计划');
				break;
			case 'note-create' : 
				console.log('创建笔记');
				break;
			case 'note-show' : 
				console.log('查看笔记');
				break;
			case 'collection': 
				console.log('查看收藏');
				break;
			default: 
				console.log('......');
		}
	}
	
	
	//笔记查询、排序条件
	methods_page.selectFun = function(val){
		console.log('排序方式为：' + val);
		/*this.params.sequence = val;
		this.queryDatas();*/
	}
	methods_page.dateFun = function(val){
		console.log('显示的月份为：' + val);
		this.params = {};
		this.params.create_date = val;
		this.queryDatas();
	}
	
	//查看笔记详情
	methods_page.detailRow = function(row) {
		console.log('row的内容为：' + row.note_id);
		console.log('跳转到笔记页面');
		/*
		 * 跳转到笔记详情页面，同时将笔记id发送过去。
		 */
		window.location.href="#";
	};
	// 分享笔记
	methods_page.shareRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否分享[' + row.note_title + ']',{
			btn : ['是' , '否']
		},function(){
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-NOTE-002',
				params : {
					note_id : row.note_id
				}
			},'/api/common/update',function(data){
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas();
				layer.msg("成功分享");
			},function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	
	//删除笔记
	methods_page.deleteRow = function(row){
		var g = this;
		var tindex = layer.confirm('是否删除[' + row.note_title + ']', {
			btn : ['是','否']
		},function(){
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-NOTE-003',
				params : {
					note_id : row.note_id
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
	
	// 角色状态格式化
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
	
	
	
	//创建学习计划
	methods_page.createPlan = function(){
		this.planCreate = true;
	}
	//取消创建
	methods_page.closePlan = function(){
		this.$refs['planForm'].resetFields();
		this.planForm.plan_start_time = new Date().Format();
		this.planCreate = false;
	}
	//保存学习计划
	methods_page.savePlan = function(){
		this.$refs['planForm'].validate(function(valid) {
			if (valid) {
				alert('成功');
			} else {
				alert('失败');
			}
		});
	}
	//学习计划开始时间
	methods_page.startTimeFun = function(date){
		this.planForm.plan_start_time = date;
	}
	//学习计划结束时间
	methods_page.endTimeFun = function(date){
		this.planForm.plan_end_time = date;
	}
	
	
	//测试方法
	methods_page.test = function(str){
		alert('传递的内容为：' + str);
	}
	
	
	// 初始化
	page_conf.mounted = function() {
		// 查询角色数据
		this.$nextTick(function(){
			this.queryDatas();
		});	
	};
	
	var pageVue = new Vue(page_conf);
	
	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});
	
	
	//渲染按钮组
	function actionRender(h, row, column, index) {
		var arr = [];
		if(row.note_share == 'Y'){
			arr.push(initBtn(h, 'detailBtn'+index, "详情", function() {
				pageVue.detailRow(row);
			}));
		}else{
			arr.push(initBtn(h, 'detailBtn'+index, "详情", function() {
				pageVue.detailRow(row);
			}));
			arr.push(initBtn(h,'deleteBtn'+index,'删除',function(){
				pageVue.deleteRow(row);
			}))
			arr.push(initBtn(h, 'collectionBtn'+index, '未分享', function() {
				pageVue.shareRow(row,index);
			}));
		}
		return h('button-group', {
		attrs : {
				size : 'small'
			}
		}, arr);
	}
	
	// 初始化按钮
	function initBtn(h, id, title, click) {
		var flag = false;
		var ele = h('i-button', {
			attrs : {
				id: id,
				type : 'text'
			},
			on : {
				click : click
			}
		},title);
		return ele;
	}
	
	function validateStartTime(rule, value, callback){
		if (!value) {
			return callback(new Error('请选择计划开始时间'));
		}
		var today = new Date().Format();
		if(value < today){
			return callback(new Error('开始时间不能早于当前时间'));
		}
		if(value >= this.planForm.plan_end_time){
			return callback(new Error('开始时间不能晚于结束时间'));
		}
		return callback();
	}
	
	function validateEndTime(rule, value, callback){
		if (!value) {
			return callback(new Error('请选择计划结束时间'));
		}
		return callback();
	}
	
	
});
