
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
	
	var ruleForm = {
		note_title:[{
			required: true,
			message: '请输入笔记名称',
			trigger: 'blur,change'
		},{
			type: 'string',
			min: 5,
			max: 100,
			message: '笔记名称应在5-100个字之间',
			trigger: 'blur,change'
		}]
	}
	
	var page_conf = {
		el: '#mainContainer',
		data: {
			user_code: '',
			isShare: false,
			ruleForm: ruleForm,
			editor: '',
			datas: [],
			curRow: {}
		}
	};
	
	var methods_page = page_conf.methods = {};
	
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
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = plan.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};
	
	//新增笔记
	methods_page.addData = function() {
		var r = createNote.newRow();
		r.set('note_title', '');
		r.set('note_share', 'N');
		r.set('plan_id', '');
		r.set('note_text', '');
		r.set('user_code', this.user_code);
		this.curRow = r;
	};
	
	methods_page.resetDatas = function(){
		this.$refs['formNote'].resetFields();
		this.isShare = false;
		this.editor.txt.clear();
	}
	
	methods_page.addDataSave = function(){
		var g = this;
		g.$refs['formNote'].validate(function(valid) {
			if (valid) {
				if (g.editor.txt.text().length==0 || g.editor.txt.text()=='') {
					layer.msg('笔记内容不能为空');
					return false;
				}else{
					var loading = layer.load();
					if(g.isShare){
						g.curRow.set('note_share','Y');
					}
					createNote.$saveUrl = "/api/common/insert";
					createNote.$insert = 'SDP-NOTE-011';
					createNote.doSave(function(data) {
						layer.close(loading);
						layer.msg('数据新增成功');
						createNote.$keyField = data.dataStore.rows[0].note_id;
						window.location.href="myNote.html";
					}, function(data) {
						layer.close(loading);
						layer.alert(data.msg);
					}, "insert");
				}
			} else {
				return false;
			}
		});
	}
	
	
	methods_page.initEditor = function(){
		this.editor = new wangEditor('#editor');
		this.editor.customConfig.onchange = (html) => {
			this.curRow.note_text = html;
		};
		this.editor.create();
	}
	
	// 组件创建
	page_conf.created= function() {
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
			this.queryDatas();
			this.initEditor();
		});	
	};
	
	
	var pageVue = new Vue(page_conf);

	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});
	
})