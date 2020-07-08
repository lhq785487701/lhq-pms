/**
 * 技能图谱-树图
 */
"use strict";

$(function() {
	var context = new SDP.SDPContext();
	var skillTree = context.newDataStore("skillTree");
	// var skillClick = context.newDataStore("skillClick");

	skillTree.$queryUrl = "/api/common/selectList";
	skillTree.statement = "SDP-SKILLTREE-001";

	// skillClick.$queryUrl = "/api/common/selectList";
	// skillClick.statement = "SDP-SKILLCLICK-001";

	// 头部配置
	var page_conf = {
		el : "#app",
		data : {
			params : {
				skill_pcode : '0',
//				user_id : ''
			},
			clickParams : {
				skill_pcode : [],
				user_id : ''
			},
			datas : []
		}
	};
	var methods_page = page_conf.methods = {};

	page_conf.mounted = function() {
		this.$nextTick(function() {
			this.queryData();
		});
	};

	methods_page.queryData = function() {
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;
		skillTree.doQuery(function(data) {
			layer.close(loading);
			g.drawTree();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	methods_page.drawTree = function() {
		var g = this;
		var vs = skillTree.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
			var pageDatas = this.datas;
//			 console.log(pageDatas[0].isLeaf);
		};
		var result = new Array();
		for(var n in pageDatas){
			var color;
			var isLeaf = pageDatas[n].isLeaf;
			var isLearned = pageDatas[n].isLearned;
//			if(!"".equals(isLeaf)&& isLeaf != null){
			if(isLeaf != null){
				if(isLeaf == "0"){//有子节点
					color = "#06BE3A";
				}else if(isLearned != "-1"){//学过
					color = "#F19F04";
				}else{//未学
					color = "#44acbb";
				}
			}else{//报错
//				console.log("error");
				color = "black";
			};
			result[n] = {
				name : pageDatas[n].skillName,
				value : pageDatas[n].description,
				score : pageDatas[n].pScore,
				skillCode : pageDatas[n].skillCode,
				isLeaf : pageDatas[n].isLeaf,
				itemStyle : {
					normal : {
						color : color,
					}
				}
			};
		};
//		console.log(result);
		var myCharts = echarts.init(document.getElementById("tree"));
		var option = {
			title : {
				text : '技能图谱',
//				subtext : '随你添加副标题'
				textStyle : {
					fontSize : 24,
					color:'#009F95'
				}
			},
			legend: {
				orient: 'horizontal',
				data: [{
						name: '已学',
						icon: 'image://../../img/learn.jpeg',
						textStyle: {
							color: '#F19F04'
						}
					},
					{
						name: '未学',
						icon: 'image://../../img/nostudy.jpeg',
						textStyle: {
							color: '#44acbb'
						}
					}, 
					{
						name: '过渡',
						icon: 'image://../../img/transition.jpeg',
						textStyle: {
							color: '#06BE3A'
						}
					},
				]
			},
			tooltip : {
				show : true,
				trigger : 'item',
				position : function(p) {
					return [ p[0] + 10, p[1] - 10 ];
				},
				// formatter: '{b}:{c}'
				formatter : function(params, ticket, callback) {
					console.log(params);
					var res = params[0] + '详细信息 : <br/>';
					if(params.data.score==null||params.data.score==''){
						res += params.data.name + ' : ' + params.data.value;
					}else{
						res += params.data.name + '个人得分 : ' + params.data.score; 
					}
					setTimeout(function() {
						// 仅为了模拟异步回调
						callback(ticket, res);
					}, 200)
					return 'loading';
				}
			},
			series : [ {
				name : '技能点',
				type : 'tree',
				orient : 'horizontal', // vertical horizontal
				rootLocation : {
					x : 50,
					y : 300
				}, // 根节点位置 {x: 100, y: 'center'}
				nodePadding : 50,
				roam : true,
				itemStyle : {
					normal : {
						color : '#44acbb',
						label : {
							show : true,
							position : 'top',
							formatter : "{b}",
							textStyle : {
								color : 'darkblue',
								fontSize : 15
							}
						},
						lineStyle : {
							color : '#44acbb',
							shadowColor : '#000',
							shadowBlur : 3,
							shadowOffsetX : 3,
							shadowOffsetY : 5,
							type : 'curve' // 'curve'|'broken'|'solid'|'dotted'|'dashed'

						}
					}
				},
				data : [ {
					name : '技能图谱',
					value : '技能图谱',
					skillCode : '0',
					isLeaf : '0',
					itemStyle : {
						normal : {
//							color : '#FF7F50'
							color : '#06BE3A'
						}
					},
					children : result
				}]
			} ]
		};
		myCharts.setOption(option);
		myCharts.on('click', clickNode);
		function clickNode(param) {
			pageVue.clickParams.skill_pcode = param.data.skillCode;
			var obj = pageVue.clickParams;
			context.clearParam();
			context.put(obj);
			var loading = layer.load();
			var g = this;
			skillTree.doQuery(function(data) {
					layer.close(loading);
//					console.log(data);
					var vs = skillTree.$rowSet.$views;
					if (vs.length == 0) {
						pageVue.datas.splice(0,pageVue.datas.length);
					} else {
						pageVue.datas = vs;
						var pageDatas = pageVue.datas;
						// console.log(pageDatas);
						if (!(param.data.children && param.data.children.length > 0)) { // 原节点上没有子节点，后台获取子节点添加
						    //展开
//							console.log('open');
							// console.log(param.data.children);
							if (param.data.bak) {// 备份存在着子节点,添加子节点
								param.data.children = param.data.bak;
							} else {
								// 初始化children
								param.data.children = [];
								addNode(param, pageDatas);
							}
						} else {// 关闭
						// console.log('close');
						// param.data.bak = param.data.children;
						// children转存在bak里面,可以保存所有子节点
							param.data.children = []; // 根节点会在refresh时读children的length
						}
//						console.log(param);
						myCharts.refresh(); // 一定要refresh，否则不起作用
					}
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				});
		};
	}
	var pageVue = new Vue(page_conf);
	
	//获取地址栏数据
	function getUrlParam(name){
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null)
			return unescape(r[2]);
		return null;
	}
	
	// 异步加载子节点
	function addNode(param, result) {
//		console.log(result);
		for (var i = 0; i < result.length; i++) {
			var color;
			var isLeaf = result[i].isLeaf;
			var isLearned = result[i].isLearned;
			if(isLeaf != null){
				if(isLeaf == "0"){//有子节点
					color = "#06BE3A";
				}else if(isLearned != "-1"){//学过
					color = "#F19F04";
				}else{//未学
					color = "#44acbb";
				}
			}else{//报错
//				console.log("error");
				color = "black";
			};
			param.data.children[i] = {
				name : result[i].skillName,
				value : result[i].description,
				score : result[i].pScore,
				skillCode : result[i].skillCode,
				itemStyle : {
					normal : {
						color : color,
					}
				}
			}
		}
	}
});