"use strict";
$(function(){
	//上下文
	var context = new SDP.SDPContext();
	//角色数据
	var createHard = context.newDataStore("createHard");
	createHard.$keyField = "problem_id";
	
	var plan = context.newDataStore('plan');
	plan.$keyField = "plan_id;"
	plan.$queryUrl = "api/common/selectList";
	plan.statement = "SDP-PLAN-001";
	//项目选择
	var proj_code = context.newDataStore('proj_code');
	proj_code.$keyField = "proj_code_id";
	proj_code.$queryUrl = "api/common/selectList";
	proj_code.statement = "SDP-Hard-001";
	
	var tags = context.newDataStore('tags');
	tags.$keyField = "tags_id";
	tags.$queryUrl = "api/common/selectList";
	tags.statement = "SDP-Hard-009";
	
	//疑难修改
	var hardDetail = context.newDataStore('hardDetail');
	hardDetail.$keyField = "problem_id";
	hardDetail.$queryUrl = "api/common/selectList";
	hardDetail.statement = "SDP-Hard-004";;
	
	var noteTags = context.newDataStore('noteTags');
	noteTags.$keyField = "tags_id";
	noteTags.$queryUrl = "api/common/selectList";
	noteTags.statement = "SDP-NOTEDETAIL-015";
	
	var ruleNoteForm = {
			problem_name: [{
			required: true,
			type: 'string',
			message: "笔记名称不能为空",
			trigger: 'blur,change'
		},{
			type: 'string',
			max: 40,
			message: '笔记名称不能超过40个字',
			trigger: 'blur'
		}]
	}
	
	var page_conf = {
		el: '#mainContainer',
		data: {
			isShare: false,
			datasPlan: [],
			datasNote: [],
			noteTagList: [],
			projList: [],
			curRow: {},
			ruleNoteForm: ruleNoteForm,
			user_code: '',
			user_id: '',
			params: {
				problem_id: '',
				problem_name : '',
				problem_detail :'',
				tags_type:'hard'
			},
			addingNewTag: false,
			newTagName: '',
			datasNoteTags: []
		}
	};
	
	var methods_page = page_conf.methods = {};
	
	//查询标签
	methods_page.queryTagDatas = function(){
		var g = this;
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		tags.doQuery(function(data){
			layer.close(loading);
			g.updateTagDatas();
		},function(data){
			layer.close(loading);
			layer.alert(data.msg);
		});
	}
	//查询项目
	methods_page.queryProDatas = function(){
		var g = this;
		var loading = layer.load();
		proj_code.doQuery(function(data){
			layer.close(loading);
			g.updateProDatas();
		},function(data){
			layer.close(loading);
			layer.alert(data.msg);
		});
	}
	// 设置标签数据
	methods_page.updateTagDatas = function() {
		var vs = tags.$rowSet.$views;
		if (vs.length == 0) {
			this.noteTagList .splice(0, this.noteTagList.length);
		} else {
			this.noteTagList = vs;
		}
	};
	// 设置项目数据
	methods_page.updateProDatas = function() {
		var vs = proj_code.$rowSet.$views;
		if (vs.length == 0) {
			this.projList .splice(0, this.projList.length);
		} else {
			this.projList = vs;
		}
	};
	
	//新建标签
	methods_page.handleAddNewTag = function(){
		this.addingNewTag = !this.addingNewTag;
	}
	
	//创建标签
	methods_page.createNewTag = function(){
		var g = this;
		var regex = new RegExp("[^A-Za-z0-9_\u4e00-\u9fa5]");
		if($.trim(g.newTagName).length !== 0 && !(regex.test(g.newTagName))) {
			var loading = layer.load();
			var flag = false;
			debugger;
			$.each(g.noteTagList,function(index,itm){
				if(g.newTagName.toLowerCase() == itm.tags_name.toLowerCase()){
					flag = true;
					return false;
				}
			});
			if(flag){		
				this.$Message.error('该标签已存在,请勿重复添加');
				g.addingNewTag = false;
				layer.close(loading);
				layer.alert(data.msg);
				return false;
			}
			else{
			context.doAction({
				statement : 'SDP-Hard-010',
				params : {
					tags_name : g.newTagName,
					tags_type:'hard'
				}
			}, '/api/common/insert', function(data) {
				layer.close(loading);
				g.queryTagDatas();
				layer.msg("标签创建成功");
				g.addingNewTag = false;
			}, function(data) {
				layer.close(loading);
				layer.alert(data.msg);
			});}
		} else {
			this.$Message.error('请输入合法的标签名');
			return false;
		}
	}
	
	methods_page.cancelCreateNewTag = function(){
		this.newTagName = '';
		this.addingNewTag = false;
	}
	
	//查询学习计划
	methods_page.queryDatas = function(){
		var g = this;
		var loading = layer.load();
		plan.doQuery(function(data){
			layer.close(loading);
			g.updateDatas();
		},function(data){
			layer.close(loading);
			layer.alert(data.msg);
		});
	}
	// 设置学习计划数据
	methods_page.updateDatas = function() {
		var vs = plan.$rowSet.$views;
		if (vs.length == 0) {
			this.datasPlan .splice(0, this.datasPlan.length);
		} else {
			this.datasPlan = vs;
		}
	};
	methods_page.editDataSave = function() {
		var g = this;
		debugger;
		this.$refs['noteForm'].validate(function(valid) {
			if (valid) {
				var text = $.trim(tinyMCE.get('noteEditor').getBody().innerText);
				if(text.length == 0 || text == ''){
					layer.msg('操作失败，内容不能为空！');
					tinyMCE.get('noteEditor').focus();
					return false;
				}else{
					var loading = layer.load();
					
					var problem_id =g.params.problem_id;
					if(problem_id !== ''  || problem_id !== undefined){
						context.doAction({
							statement : 'SDP-Hard-007',
							params : {
								problem_id : g.params.problem_id,
								problem_name : g.curRow.problem_name,
								problem_detail : tinyMCE.get('noteEditor').getContent(),
							}
						}, '/api/common/update', function(data) {							
							layer.msg("笔记修改成功");
							window.location.href="hardDetail.html?uuid="+g.params.problem_id;
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

	
	//新增疑难
	methods_page.addData = function() {
		var r = createHard.newRow();
		r.set('problem_name', '');
		r.set('projTagSelected', '');
		r.set('hardTagSelected', '');
		r.set('proj_code', '');
		r.set('problem_detail', '');		
		r.set('user_code', this.user_code);
		r.set('user_id', this.user_id);
		this.curRow = r;
	};
	
	
	//数据保存
	methods_page.addDataSave = function(){
		/*
		 * 获取文本内容:  tinyMCE.get('noteEditor').getBody().innerText;
		 * 获取html内容: tinyMCE.get('noteEditor').getContent();
		 */
		var g = this;
		this.$refs['noteForm'].validate(function(valid) {
			if (valid) {
				var text = $.trim(tinyMCE.get('noteEditor').getBody().innerText);
				if(text.length == 0 || text == ''){
					layer.msg('笔记内容不能为空');
					tinyMCE.get('noteEditor').focus();
					return false;
				}else{
					var loading = layer.load();
					g.curRow.set('problem_detail',tinyMCE.get('noteEditor').getContent());	
					g.curRow.set('proj_code',g.curRow.projTagSelected);
					g.curRow.set('proj_tag',g.curRow.hardTagSelected);
					createHard.$saveUrl = "/api/common/insert";
					createHard.$insert = 'SDP-Hard-002';
					createHard.doSave(function(data) {
						createHard.$keyField = data.dataStore.rows[0].problem_id;
						if(g.curRow.hardTagSelected!== 0){
							layer.close(loading);
							layer.msg('数据新增成功');
							window.location.href="hardDetail.html?uuid="+createHard.$keyField;
						}else{
							context.doAction({
								statement : 'SDP-Hard-002',
								params : {
									problem_id : createHard.$keyField,
									tags: g.curRow.hardTagSelected
								}
							}, '/api/common/insert', function(data) {
								layer.close(loading);
								layer.msg('数据新增成功');
								window.location.href="hardDetail.html?uuid="+createHard.$keyField;
							}, function(data) {
								layer.close(loading);
								layer.alert(data.msg);
							});
						}
					}, function(data) {
						layer.close(loading);
						layer.alert(data.msg);
					}, "insert");
				}
			}
		});
	}
	
	//查询笔记信息
	methods_page.queryHardDetail = function(){
		var obj = pageVue.params;
		context.clearParam();//清空参数列表
		context.put(obj);
		var g = this;
		var loading = layer.load();
		hardDetail.doQuery(function(data) {
			layer.close(loading);
			g.updatehardDetail();
		}, function(data) {
			layer.alert(data.msg);
		});
		
	}
	//修改疑难信息
	methods_page.editData = function(){
		var r = hardDetail.newRow();		
			r.set('problem_name', this.datasNote[0].problem_name);		
			r.set('user_id', this.datasNote[0].user_id);
			r.set('problem_detail', '');
			this.curRow = r;
		
			$('#noteEditor').text(this.datasNote[0].problem_detail);
		
	}
	//设置笔记数据
	methods_page.updatehardDetail = function(){
		var vs = hardDetail.$rowSet.$views;
		if (vs.length == 0) {
			this.datasNote .splice(0, this.datasNote.length);
		} else {
			this.datasNote = vs;
			this.editData();
		}
	}
	
	//查询笔记相关标签
	methods_page.queryNoteTags = function(){
		var obj = pageVue.params;
		context.clearParam();//清空参数列表
		context.put(obj);
		var g = this;
		var loading = layer.load();
		noteTags.doQuery(function(data) {
			layer.close(loading);
			g.updateNoteTags();
		}, function(data) {
			layer.alert(data.msg);
		});
	}	
	//设置相关标签
	methods_page.updateNoteTags = function(){
		var vs = noteTags.$rowSet.$views;
		if (vs.length == 0) {
			this.datasNoteTags .splice(0, this.datasNoteTags.length);
		} else {
			this.datasNoteTags = vs;
		}
	}

	methods_page.initEditor = function(){
		tinymce.init({
			selector: '#noteEditor',
			branding: false,
			elementpath: false,
			height: 450,
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
			codesample_dialog_width: 500,
			codesample_dialog_height: 400
		});
	}
	
	// 获取用户信息
	methods_page.getUserInfo= function() {
		var g = this;
		var url = "/api/user/getUserInfo?t=" + new Date().getTime();
		context.doAction({}, url, function(data) {
			if (data.data != null) {
				SDP.loginUser = data.data;
				debugger;
			/*	$.each(data.data.attrs, function(index, itm) {
					for ( var n in itm) {
						SDP.loginUser[n] = itm[n];
					} 
				});
				debugger;*/
				g.user_code=SDP.loginUser.userName;
				g.user_id=SDP.loginUser.userId;
				g.addData();
			}
		}, function(data) {
			layer.alert(data.msg);
		});
	};
	
	// 初始化
	page_conf.mounted = function() {
		this.$nextTick(function(){
			this.initEditor();
			this.queryDatas();
			this.queryTagDatas();
			this.queryProDatas();
			this.params.problem_id = getUrlParam("uuid");
			if(this.params.problem_id==null || this.params.problem_id==""){
				debugger;
				this.getUserInfo();
			}else{
				this.queryHardDetail();
				this.queryNoteTags();
				
			}
		});	
	};
	
	var pageVue = new Vue(page_conf);
/*
	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});
	*/
	//解析url参数
	function getUrlParam(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
		var r = window.location.search.substr(1).match(reg); 
		if (r!=null) 
			return unescape(r[2]); 
		return null; 
	}
})