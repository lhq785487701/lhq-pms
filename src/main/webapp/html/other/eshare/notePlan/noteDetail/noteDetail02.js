"use strict";
$(function() {
	var context = new SDP.SDPContext();
	
	var noteDetail = context.newDataStore("noteDetail");
	noteDetail.$keyField = "noteDetail_id";
	noteDetail.$queryUrl = "/api/common/selectList";
	noteDetail.statement = "SDP-NOTEDETAIL-001";//查看笔记详情
	
	
	var enshrine = context.newDataStore("enshrine");
	enshrine.$keyField = "enshrine_id";
	enshrine.$queryUrl = "/api/common/selectList";
	enshrine.statement = "SDP-NOTEDETAIL-002";// 查询是否收藏
	
	var personScore = context.newDataStore("personScore");
	personScore.$keyField = "personScore_id";	
	personScore.$queryUrl = "/api/common/selectList";
	personScore.statement = "SDP-NOTEDETAIL-006";
	
	
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
				user_comment:'',//用户对文章的评论
			},
			page : page,
			datas:[],//笔记数据集
			commentDatas:[],//评论数据集
			user : {},//用户信息
			ifcollect: false,//判断是否收藏
			collectNum:'',//收藏数
			ifScore: false,//判断是否打分
			pScore : 0,
			commentNums :0,
			textarea:'',
		}
	};

	var methods_page = page_conf.methods = {};
	
	//获取用户信息
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
				g.getReferUrl();
				g.queryDatas();//查询文章数据
			}
		}, function(data) {
			layer.alert(data.msg);
		});
	};
	
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
			g.queryCollect();//查询是否收藏
			g.queryIfScore();//查询是否打分
			g.queryComment();//查询评论列表
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
			this.commentDatas = pageVue.commentDatas;
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
	
	//判断由哪个页面跳转到当前页面，便于获取不同的上下篇
	methods_page.getReferUrl = function(){
		let url = document.referrer;
		if(url==''||url==null){
			return null;
		}
		//http://localhost:8080/sdp/html/note_plan/note/myNote.html
		if(url.indexOf("myNote")!= -1){
			this.params.action = "myNote";
		}
		if(url.indexOf("noteCollect")!= -1){
			this.params.action = "noteCollect";
		}
		if(url.indexOf("noteShare")!= -1){
			this.params.action = "noteShare";
		}
		if(url.indexOf("planDetails")!= -1){
			this.params.plan_id = getUrlParam("plan_id");
			this.params.action = "planDetails";
		}
	}
	
	
	// 初始化
	page_conf.mounted = function() {
		// 查询角色数据
		this.$nextTick(function(){
			console.log('上一个页面URL:' + document.referrer);
			this.params.note_id=getUrlParam("uuid");
			console.log("传入地址2"+window.location.href);
			this.created();
		});	
	};
	var pageVue = new Vue(page_conf);

	// 获取地址栏参数
	function getUrlParam(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
		var r = window.location.search.substr(1).match(reg); 
		if (r!=null) 
			return unescape(r[2]); 
		return null; 
	} 
	
	
});