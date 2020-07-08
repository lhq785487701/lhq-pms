"use strict";
$(function(){
	//数据字典
	var dicConf = ['sdp_esp_createNote','sdp_esp_plan'];
	//上下文
	var context = new SDP.SDPContext();
	//角色数据
	var createNote = context.newDataStore("createNote");
	createNote.$keyField = "note_id";
	
	var plan = context.newDataStore('plan');
	plan.$keyField = "plan_id;"
	plan.$queryUrl = "api/common/selectList";
	plan.statement = "SDP-PLAN-001";
	
	var tags = context.newDataStore('tags');
	tags.$keyField = "tags_id";
	tags.$queryUrl = "api/common/selectList";
	tags.statement = "SDP-NOTE-009";
	
	//笔记修改
	var noteDetail = context.newDataStore('note');
	noteDetail.$keyField = "note_id";
	noteDetail.$queryUrl = "api/common/selectList";
	noteDetail.statement = "SDP-NOTEDETAIL-001";
	
	var noteTags = context.newDataStore('noteTags');
	noteTags.$keyField = "tags_id";
	noteTags.$queryUrl = "api/common/selectList";
	noteTags.statement = "SDP-NOTEDETAIL-015";
	
	var ruleNoteForm = {
		note_title: [{
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
			curRow: {},
			ruleNoteForm: ruleNoteForm,
			user_code: '',
			params: {
				note_id: ''
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
		var loading = layer.load();
		tags.doQuery(function(data){
			layer.close(loading);
			g.updateTagDatas();
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
			$.each(g.noteTagList,function(index,itm){
				if(g.newTagName.toLowerCase() == itm.tags_name.toLowerCase()){
					flag = true;
					return false;
				}
			});
			if(flag){
				this.$Message.error('该标签已存在,请勿重复添加');
				return false;
			}
			context.doAction({
				statement : 'SDP-NOTE-010',
				params : {
					tags_name : g.newTagName
				}
			}, '/api/common/insert', function(data) {
				layer.close(loading);
				g.queryTagDatas();
				layer.msg("标签创建成功");
				g.addingNewTag = false;
			}, function(data) {
				layer.close(loading);
				layer.alert(data.msg);
			});
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
	
	
	//新增笔记
	methods_page.addData = function() {
		var r = createNote.newRow();
		r.set('note_title', '');
		r.set('noteTagSelected', []);
		r.set('note_share', 'N');
		r.set('plan_id', '');
		r.set('note_text', '');
		r.set('user_code', this.user_code);
		this.curRow = r;
	};
	
	//数据保存
	methods_page.addDataSave = function(){
		/*
		 * 获取文本内容:  tinyMCE.get('noteEditor').getBody().innerText;
		 * 获取html内容: tinyMCE.get('noteEditor').getContent();
		 */
		debugger;
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
					g.curRow.set('note_text',tinyMCE.get('noteEditor').getContent());
					if(g.isShare){
						g.curRow.set('note_share','Y');
					}
					createNote.$saveUrl = "/api/common/insert";
					createNote.$insert = 'SDP-NOTE-011';
					createNote.doSave(function(data) {
						createNote.$keyField = data.dataStore.rows[0].note_id;
						if(g.curRow.noteTagSelected.length == 0){
							layer.close(loading);
							layer.msg('数据新增成功');
							window.location.href="../noteDetail/noteDetail.html?uuid="+createNote.$keyField;
						}else{
							context.doAction({
								statement : 'SDP-NOTE-012',
								params : {
									note_id : createNote.$keyField,
									tags: g.curRow.noteTagSelected
								}
							}, '/api/common/insert', function(data) {
								layer.close(loading);
								layer.msg('数据新增成功');
								window.location.href="../noteDetail/noteDetail.html?uuid="+createNote.$keyField;
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
	methods_page.queryNoteDetail = function(){
		var obj = pageVue.params;
		context.clearParam();//清空参数列表
		context.put(obj);
		var g = this;
		var loading = layer.load();
		noteDetail.doQuery(function(data) {
			layer.close(loading);
			g.updateNoteDetail();
		}, function(data) {
			layer.alert(data.msg);
		});
		
	}
	
	//设置笔记数据
	methods_page.updateNoteDetail = function(){
		var vs = noteDetail.$rowSet.$views;
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
	
	//修改笔记
	methods_page.editData = function(){
		var r = createNote.newRow();
		r.set('note_title', this.datasNote[0].note_title);
		r.set('note_share', this.datasNote[0].note_share);
		r.set('plan_id', this.datasNote[0].plan_id);
		r.set('note_text', '');
		r.set('user_code', this.user_code);
		this.curRow = r;
		$('#noteEditor').text(this.datasNote[0].note_text);
		console.log($('#noteEditor'));
	}
	//完成修改
	methods_page.editDataSave = function(){
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
					g.curRow.set('note_text',tinyMCE.get('noteEditor').getContent());
					if(g.isShare){
						g.curRow.set('note_share','Y');
					}
					createNote.$saveUrl = "/api/common/update";
					createNote.$update = 'SDP-NOTEDETAIL-014';
					createNote.doSave(function(data) {
						layer.close(loading);
						layer.msg('笔记修改成功');
						createNote.$keyField = this.datasNote[0].note_id;
						window.location.href="../noteDetail/noteDetail.html?uuid="+createNote.$keyField;
					}, function(data) {
						layer.close(loading);
						layer.alert(data.msg);
					}, "update");
				}
			}
		});
		
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
				$.each(data.data.attrs, function(index, itm) {
					for ( var n in itm) {
						SDP.loginUser[n] = itm[n];
					} 
				});
				g.user_code=SDP.loginUser.userId;
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
			this.params.note_id = getUrlParam("uuid");
			if(this.params.note_id==null || this.params.note_id==""){
				this.getUserInfo();
			}else{
				this.queryNoteTags();
				this.queryNoteDetail();
			}
		});	
	};
	
	var pageVue = new Vue(page_conf);

	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});
	
	//解析url参数
	function getUrlParam(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
		var r = window.location.search.substr(1).match(reg); 
		if (r!=null) 
			return unescape(r[2]); 
		return null; 
	}
})