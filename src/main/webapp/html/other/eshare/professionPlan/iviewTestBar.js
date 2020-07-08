/**
 * 个人能力图谱-柱状图
 */
"use strict";
$(function() {
	// 数据字典
	var context = new SDP.SDPContext();
	// 柱状图数据
	var skillBar = context.newDataStore("skillBar");
	// 角色数据
	var rise = context.newDataStore("rise_no");

	skillBar.$queryUrl = "/api/common/selectList";
	skillBar.statement = "SDP-SKILLBAR-001";
	rise.$queryUrl = "/api/common/selectList";
	rise.statement = "SDP-Rise-002";

	// 头部配置
	var page_conf = {
		el : "#app",
		data : {
			dataList : [],
			params : {
				post_code : '',
				resume_id : '',
				user_id : '',
				name : '',
				cur_post : '',
				department : '',
				apply_post : '',
			},
			formValidate : {
				post_code : '',
				user_id : '',
				create_user : 'fdf',
				department : '',
				cur_post : '',
				apply_post : '',
				rise_remark : ''

			},
			ruleValidate : {
				rise_remark : [ {
					required : true,
					message : '请输入晋级说明',
					trigger : 'blur'
				}, {
					type : 'string',
					min : 10,
					message : '介绍不能少于50字',
					trigger : 'blur'
				} ]
			},
			 datas: [],
			curRow : {},
			rigRow : [],
			dataAdd : false
		}
	};
	var methods_page = page_conf.methods = {};

	page_conf.mounted = function() {
		this.$nextTick(function() {
			this.queryData();
			this.queryRise();
			this.formValidate.cur_post = getUrlParam("post_code");
			this.formValidate.user_id = getUrlParam("user_id");
		/*	this.params.user_id = getUrlParam("user_id");*/
		});
	};

	methods_page.queryData = function() {
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;
		skillBar.doQuery(function(data) {
			layer.close(loading);
			var post_code = pageVue.params.post_code;
			console.log(post_code);
			g.drawBar1();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	//查询个人信息
	methods_page.queryRise = function(){
		var obj = pageVue.formValidate;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;
		rise.doQuery(function(data) {
			layer.close(loading);
			g.updategodDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
		};
	// 新增角色
	methods_page.addData = function() {
		var r = rise.newRow();
		r.set('create_user', this.formValidate.create_user);
		r.set('department', this.formValidate.department);
		r.set('cur_post', this.formValidate.cur_post);
		r.set('apply_post', this.formValidate.apply_post);
		r.set('rise_remark', this.formValidate.rise_remark);
		this.curRow = r;
		this.dataAdd = true;

	};
	// 设置数据
	methods_page.updategodDatas = function() {
		var vs = rise.$rowSet.$views;
		if (vs.length == 0) {
			this.rigRow.splice(0, this.rigRow.length);
		} else {
			this.rigRow = vs;
			var rig=this.rigRow;		
			this.formValidate.create_user=rig[0].name;
			this.formValidate.department=rig[0].department;
			this.formValidate.cur_post=rig[0].post_code;
			this.formValidate.apply_post=rig[0].post_next;
		}
	};
	// 新增保存
	methods_page.handleSubmit = function() {
		var g = this;

		this.$refs['formValidate'].validate(function(valid) {
			if (valid) {			
				var loading = layer.load();
				rise.$saveUrl = "/api/common/insert";
				rise.$insert = 'SDP-Rise-001';
				rise.doSave(function(data) {
					layer.close(loading);
					layer.msg('数据新增成功');
					g.dataAdd = false;
				}, function() {
					layer.close(loading);
					layer.alert('失败了');
					// layer.alert(data.msg);
				}, "insert");
			} else {
				return false;
			}
		});
	};

	methods_page.drawBar1 = function() {
		var g = this;
		var vs = skillBar.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
			var pageDatas = this.datas;
			var xData = new Array();
			var sData = new Array();
			var sfData = new Array();
			var ssData = new Array();
			for ( var i in pageDatas) {
				xData[i] = pageDatas[i]['skillName'];
				sfData[i] = pageDatas[i]['pScore'];
				ssData[i] = pageDatas[i]['tScore'];
			}
			;
			var text = pageDatas[0]['pNext'];
			var myCharts1 = echarts.init(document.getElementById("main1"));
			var option1 = {
				title : {
					text : text,
					textStyle : {
						color : 'red',
						fontSize : 15,
						fontWeight : 'bold'
					}
				},
				tooltip : {
					trigger : 'item' // axis以X轴线触发,item以每一个数据项触发
				},
				legend : {
					data : [ '当前个人技能', '目标技能' ]
				},
				dataZoom : {
					show : true,
					realtime : true,
					y : 36,
					height : 20,
					handleColor : '#47A447',
					start : 10,
					end : 90
				},
				xAxis : [ {
					type : 'category',
					axisLabel : {
						interval : 0,
						rotate : -30
					},
					axisTick : { // 轴标记
						show : true,
						length : 10,
						lineStyle : {
							color : 'green',
							type : 'solid',
							width : 1
						}
					},
					splitLine : {
						show : true,
						lineStyle : {
							color : 'darkblue',
							type : 'dashed',
							width : 1
						}
					},
					data : xData
				} ],
				grid : { // 控制图的大小，调整下面这些值就可以，
					x : 80,
					x2 : 100,
					y2 : 120
				// y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
				},
				yAxis : [ {
					type : 'value',
					axisLabel : {
						formatter : '{value}'
					},
					axisLine : { // 轴线
						show : true,
						lineStyle : {
							color : 'purple',
							type : 'dashed',
							width : 2
						}
					},
					splitLine : {
						show : true,
						lineStyle : {
							color : '#483d8b',
							type : 'dotted',
							width : 2
						}
					},
				} ],
				series : [ {
					name : '当前个人技能',
					type : 'bar',
					data : sfData,
					markPoint : {
						data : [ {
							type : 'max',
							name : '评分最大值'
						}, {
							type : 'min',
							name : '评分最小值'
						} ]
					},
					markLine : {
						data : [ {
							type : 'average',
							name : '个人平均值'
						} ]
					}
				}, {
					name : '目标技能',
					type : 'bar',
					data : ssData,
					markPoint : {
						data : [ {
							type : 'max',
							name : '评分最大值'
						}, {
							type : 'min',
							name : '评分最小值'
						} ]
					},
					markLine : {
						data : [ {
							type : 'average',
							name : '技能平均值'
						} ]
					}
				} ]
			};
			myCharts1.setOption(option1);
		};
	};
	var pageVue = new Vue(page_conf);
	function getUrlParam(name){
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null)
			return unescape(r[2]);
		return null;
	}
});
