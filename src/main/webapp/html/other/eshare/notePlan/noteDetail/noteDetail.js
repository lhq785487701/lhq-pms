"use strict";
$(function(){
	//数据字典
	var dicConf = ['sdp_esp_noteDetail'];
	//上下文
	var context = new SDP.SDPContext();
	//角色数据
	var noteDetail = context.newDataStore("noteDetail");
	noteDetail.$keyField = "note_id";
	noteDetail.$queryUrl = "/api/common/selectList";
	noteDetail.statement = "SDP-NOTEDETAIL-001"; //查看笔记详情
	
	var noteTags = context.newDataStore('tags');
	noteTags.$keyField = "tags_id";
	noteTags.$queryUrl = "api/common/selectList";
	noteTags.statement = "SDP-NOTEDETAIL-015"; //笔记相关标签
	
	var enshrine = context.newDataStore("enshrine");
	enshrine.$keyField = "enshrine_id";
	enshrine.$queryUrl = "/api/common/selectList";
	enshrine.statement = "SDP-NOTEDETAIL-002";// 查询是否收藏
	
	var personScore = context.newDataStore("personScore");
	personScore.$keyField = "personScore_id";	
	personScore.$queryUrl = "/api/common/selectList";
	personScore.statement = "SDP-NOTEDETAIL-006";//查询当前用户评论的分数
	
	var upAndDown = context.newDataStore("upAndDown");
	upAndDown.$keyField = "note_id";
	upAndDown.$queryUrl = "/api/common/selectList";
	upAndDown.statement = "SDP-NOTEDETAIL-012"//笔记上下篇
		
	var otherNote = context.newDataStore("otherNote");
	otherNote.$keyField = "note_id";
	otherNote.$queryUrl = "api/common/selectList";
	otherNote.statement = "SDP-NOTEDETAIL-013"; //作者相关笔记
	var note_page = otherNote.getPage();
	note_page.setPageNumber(1);
	note_page.setPageRowCount(5);
	
	var comments = context.newDataStore("replyDetail");
	comments.$keyField = "replyDetail_id";
	comments.$queryUrl = "/api/common/selectList";
	comments.statement = "SDP-NOTEDETAIL-009";// 查看评论
	var page = comments.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(5);
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				user_id : '',//用户的id
				note_id :'',//文章id
				user_comment:'',//用户对文章的评论,
				action: '', //不同页面进来 笔记的上下篇不同
				plan_id: ''
			},
			page : page,
			datas:[],//笔记数据集
			datasUpAndDown: [], //上下篇
			datasNoteTags: [], //标签
			commentDatas:[],//评论数据集
			user : {},//用户信息
			ifcollect: false,//判断是否收藏
			collectNum:'',//收藏数
			ifScore: false,//判断是否打分
			pScore : 0,
			textarea:'',
			otherNoteDatas: []
		}
	};
	
	var methods_page = page_conf.methods = {};
	
	// 查询
	methods_page.queryDatas = function() {
		var obj = pageVue.params;
		context.clearParam();//清空参数列表
		context.put(obj);
		var g = this;
		var loading = layer.load();//动画加载,2, {time: 3*1000}
		noteDetail.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
			g.queryNoteTags(); //查询文章相关标签
			g.queryUpAndDown(); //查询文章上下篇
			g.queryCollect(); //查询是否收藏
			g.queryIfScore(); //查询是否打分
			g.queryComment(); //查询评论列表
			g.queryOtherNotes(); //查询作者相关笔记
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = noteDetail.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
			this.params.note_id=this.datas[0].note_id;
			this.collectNum=this.datas[0].note_collect;
		}
	};
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
	//设置标签
	methods_page.updateNoteTags = function(){
		var vs = noteTags.$rowSet.$views;
		if (vs.length == 0) {
			this.datasNoteTags .splice(0, this.datasNoteTags.length);
		} else {
			this.datasNoteTags = vs;
		}
	}
	
	//文章上下篇查询
	methods_page.queryUpAndDown = function(){
		var obj = pageVue.params;
		context.clearParam();//清空参数列表
		context.put(obj);
		var g = this;
		upAndDown.doQuery(function(data) {
			g.updateUpAndDown();
		}, function(data) {
			layer.alert(data.msg);
		});
	}
	//设置上下篇的数据
	methods_page.updateUpAndDown = function(){
		var vs = upAndDown.$rowSet.$views;
		if (vs.length == 0) {
			this.datasUpAndDown.splice(0, this.upAndDown.length);
		} else {
			this.datasUpAndDown = vs;
		}
	}
	
	
	// 查询是否收藏
	methods_page.queryCollect = function() {
		var obj = pageVue.params;
		context.clearParam();// 清空参数列表
		context.put(obj);
		var g = this;
		var loading = layer.load();// 动画加载,2, {time: 3*1000}
		enshrine.doQuery(function(data) {
			layer.close(loading);
			g.updateCollect();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	// 设置收藏数据
	methods_page.updateCollect = function() {
		var vs = enshrine.$rowSet.$views;
		if (vs.length == 0) {
			this.ifcollect=false;
		} else {
			this.ifcollect=true;
		}
	};
	
	// 收藏笔记
	methods_page.collect = function(){
		var g = this;
		var tindex = layer.confirm('是否收藏[' + g.datas[0].note_title + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-NOTEDETAIL-003',
				params : {
					note_id : g.params.note_id,
					user_id : g.params.user_id
				}
			}, '/api/common/insert', function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.msg("收藏成功");
				g.collectNum=g.collectNum+1;//笔记表收藏数增加1
				pageVue.updateNoteTab();
				pageVue.queryCollect();
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	
	// 取消收藏
	methods_page.cancelCollect = function(collectNum){
		var g = this;
		var tindex = layer.confirm('是否取消收藏[' + g.datas[0].note_title + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-NOTEDETAIL-005',
				params : {
					note_id : g.params.note_id,
					user_id : g.params.user_id
				}
			}, '/api/common/delete', function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.msg("取消收藏成功");
				g.collectNum=g.collectNum-1;//笔记表收藏数减一
				pageVue.updateNoteTab();
				pageVue.queryCollect();
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};

	// 点击收藏对收藏数的影响
	methods_page.updateNoteTab = function(){
		var g = this;
		context.doAction({
			statement : 'SDP-NOTEDETAIL-004',
			params : {
				note_id : g.params.note_id,
				note_collect:g.collectNum,
			}
		}, '/api/common/update', function(data) {
			/* layer.msg("收藏成功"); */
		}, function(data) {
			layer.alert(data.msg);
		});
	};
	
	
	// 查询是否打分
	methods_page.queryIfScore = function() {
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var g = this;
		var loading = layer.load();// 动画加载,2, {time: 3*1000}
		personScore.doQuery(function(data) {
			layer.close(loading);
			g.ifScoreNote();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	//设置是否显示打分
	methods_page.ifScoreNote = function() {
		var vs = personScore.$rowSet.$views;
		if (vs.length == 0) {
			this.ifScore=false;
		} else {
			this.ifScore=true;
			this.pScore=vs[0].score_num;
		}
	};
	
	
	//打分
	methods_page.doScore = function(val) {
		var g = this;
		var tindex = layer.confirm('是否打[' + val + ']分', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-NOTEDETAIL-007',
				params : {
					note_id : g.params.note_id,
					user_id : g.params.user_id,
					score_num:val
				}
			}, '/api/common/insert', function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.msg("打分成功");
				pageVue.updateByScore(val);
				pageVue.queryDatas();
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	
	// 打分对笔记表的修改
	methods_page.updateByScore = function(val){
		var g = this;
		var newscore=(g.datas[0].note_score*g.datas[0].score_num+val)/(g.datas[0].score_num+1);
		context.doAction({
			statement : 'SDP-NOTEDETAIL-008',
			params : {
				note_id : g.params.note_id,
				note_score:newscore,
				score_num:g.datas[0].score_num+1
			}
		}, '/api/common/update', function(data) {
		}, function(data) {
			layer.alert(data.msg);
		});
	};
	
	
	// 查询评论列表
	methods_page.queryComment = function() {
		var obj = pageVue.params;
		context.clearParam();// 清空参数列表
		context.put(obj);
		var g = this;
		var loading = layer.load();// 动画加载,2, {time: 3*1000}
		comments.doQuery(function(data) {
			layer.close(loading);
			g.updateComments();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	// 设置留言列表数据
	methods_page.updateComments = function() {
		var vs = comments.$rowSet.$views;
		if (vs.length == 0) {
			this.commentDatas.splice(0, this.datas.length);
		} else {
			this.commentDatas = vs;
			this.commentNums=vs[0].comment_num;
		}
	};
	// 提交评论文本框
	methods_page.submitText = function() {
		var g = this;
		var loading = layer.load();
        if($.trim(pageVue.textarea) !=''){
        	var newtextarea=$.trim(pageVue.textarea);
    		var tindex = layer.confirm('确定提交评论?', {
    			btn : [ '确定', '取消' ]
    		}, function() {
    			context.doAction({
    				statement : 'SDP-NOTEDETAIL-010',
    				params : {
    					note_id : g.params.note_id,
    					user_code : g.params.user_id,
    					comment_text : newtextarea
    				}
    			}, '/api/common/insert', function(data) {
    				layer.close(loading);
    				layer.close(tindex);
    				layer.msg("评论成功");
    				pageVue.changeCommentNum();
    			}, function(data) {
    				layer.close(loading);
    				layer.close(tindex);
    				layer.alert(data.msg);
    			});
    		});
        }else{
			layer.close(loading);
			layer.msg("请输入文本");
			this.queryComment();
        }
	};
	// 评论后对笔记表评论数进行修改
	methods_page.changeCommentNum = function() {
		var g = this;
		var loading = layer.load();
		context.doAction({
			statement : 'SDP-NOTEDETAIL-011',
			params : {
				note_id :g.params.note_id,
			}
		}, '/api/common/update', function(data) {
			layer.close(loading);
			g.textarea='';
			g.queryComment();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	// 改变当前页号
	methods_page.handleCurrentChange = function(val) {
		page.setPageNumber(val);
		if (page.getIsChange()) {
			this.queryComment();
		}
	};
	// 改变页大小
	methods_page.handleSizeChange = function(val) {
		page.setPageRowCount(val);
		if (page.getIsChange()) {
			this.queryComment();
		}
	};
	
	// 编辑笔记数据
	methods_page.editRow = function(row) {
		console.log('编辑数据'+row.note_id);
		if(row.note_share=="N"){
			window.location.href="../createNote/createNote.html?uuid="+ row.note_id;
			return false;
		}
		//$('#edit_content').append('<textarea style="width:100%"></textarea>')
	};
	
	// 删除笔记数据
	methods_page.deleteRow = function(row) {
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
				layer.msg("成功删除");
				window.location.href="../note/myNote.html";
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	
	// 分享笔记数据
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
	
	//获取作者相关文章
	methods_page.queryOtherNotes = function(){
		var obj = pageVue.params;
		context.clearParam();//清空参数列表
		context.put(obj);
		var g = this;
		var loading = layer.load();//动画加载,2, {time: 3*1000}
		otherNote.doQuery(function(data) {
			layer.close(loading);
			g.updateOtherNotes();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	}
	
	//设置相关文章数据
	methods_page.updateOtherNotes = function(){
		var vs = otherNote.$rowSet.$views;
		if (vs.length == 0) {
			this.otherNoteDatas.splice(0, this.otherNoteDatas.length);
		} else {
			this.otherNoteDatas = vs;
		}
	}
	
	//刷新作者相关笔记列表
	methods_page.refreshNoteList = function(){
		note_page.setPageNumber(Math.floor(Math.random()*20));
		this.queryOtherNotes();
	}
	
	//上下篇跳转
	 methods_page.redirect = function(id){
		 window.location.href="noteDetail.html?uuid="+ id + "&action=" + this.params.action;
	 }
	 
	 
	
	//获取用户信息
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
				g.user = SDP.loginUser;
				g.params.user_id=SDP.loginUser.userId;
				g.getReferUrl();
				g.queryDatas();//查询文章数据
			}
		}, function(data) {
			layer.alert(data.msg);
		});
	};
	
	//判断由哪个页面跳转到当前页面，便于获取不同的上下篇
	methods_page.getReferUrl = function(){
		var g = this;
		let url = document.referrer;
		if(url==''||url==null){
			return false;
		}
		var action = getUrlParam("action");
		if(!(action == null || action == '')){
			g.params.action = action;
			return false;
		}else{
			if(url.indexOf("myNote")!= -1 || url.indexOf('createNote') != -1){
				g.params.action = "myNote";
			}
			if(url.indexOf("noteCollect")!= -1){
				g.params.action = "noteCollect";
			}
			if(url.indexOf("noteShare")!= -1){
				g.params.action = "noteShare";
			}
			if(url.indexOf("planDetails")!= -1){
				g.params.plan_id = getUrlParam("plan_id");
				g.params.action = "planDetails";
			}
		}
		
	}
	

	// 初始化
	page_conf.mounted = function() {
		// 查询角色数据
		this.$nextTick(function(){
			this.params.note_id=getUrlParam("uuid");
			this.getUserInfo();
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