/**
 * 个人现状数据容器脚本
 * 
 */
"use strict";
$(function() {
	
	// 上下文
	var context = new SDP.SDPContext();
	
	// 个人目标数据
	var target = context.newDataStore("target");
	target.$keyField = "user_id";
	target.$queryUrl = "api/common/selectList";
	target.statement = "SDP-CAREER-001";
	
	// 专业技能数据
	var skill = context.newDataStore("skill");
	skill.$keyField = "user_id";
	skill.$queryUrl = "api/common/selectList";
	skill.statement = "SDP-CAREER-004";
	
	// 当前所有岗位数据
	var currentPost = context.newDataStore("currentPost");
	currentPost.$keyField = "user_id";
	currentPost.$queryUrl = "api/common/selectList";
	currentPost.statement = "SDP-CAREER-005";
	
	// 晋升路线数据
	var post = context.newDataStore("post");
	post.$keyField = "post_code";
	post.$queryUrl = "api/common/selectList";
	post.statement = "SDP-CAREER-006";
	
	// 历史岗位
	var overPost = context.newDataStore("overPost");
	overPost.$keyField = "user_id";
	overPost.$queryUrl = "api/common/selectList";
	overPost.statement = "SDP-CAREER-007";
	
	// 大神履历数据
	var manito = context.newDataStore("manito");
	manito.$queryUrl = "api/common/selectList";
	manito.statement = "SDP-CAREER-008";
	
	// 个人能力分析
	var skillBar = context.newDataStore("skillBar");
	skillBar.$queryUrl = "/api/common/selectList";
	skillBar.statement = "SDP-CAREER-009";
	
	// 编辑校验
	var rulesTarget = {
			personal_goals: [{
			required: true,
			message: '请输入您的目标描述',
			trigger: 'blur'
		}],
		startDate: [{
			required: true,
			type: 'date',
			message: "请选择开始日期",
			trigger: 'change'
		}],
		fetchDate: [{
			required: true,
			type: 'date',
			message: "请选择结束日期",
			trigger: 'change'
		}],
	};
	var rulesCareer = {
		careerOrientation: [{
			required: true,
			message: '请输入您的职业倾向',
			trigger: 'blur'
		}],
	};
	
	// 页面配置初始化
	var page_config = {
		el: "#personalStatus",
		data: {
			manitoValue: "1",
			targetEdit: false,
			careerEdit: false,
			userParams:{
				user_id: '',
			},
			postParams:{
				post_code : '',
				postCodeIndex:'',
			},
			skillMapParams:{
				user_id: '',
				post_code : '',
			},
			rulesTarget: rulesTarget,
			targetPlan: {
				personal_goals: '',
				startDate: '',
				fetchDate: ''
			},
			rulesCareer: rulesCareer,
			careerMassege: {
				careerOrientation: ''
			},
			datas : [],
			targetMassege: [],
			userSkills: [],
			postRoute:[],
			currentPosts:[],
			overPosts:[],
			manitos: [],
			randomManitos:[],
			Datedata:{
				startDate:'',
				fetchDate:''
			},
		}
	};
	
	// 定义全局方法
	var methods_main = page_config.methods = {};
	
	// 格式化日期
	methods_main.fomatStartDate = function(date) {
		this.Datedata.startDate = date;
	};
	methods_main.fomatFetchDate = function(date) {
		this.Datedata.fetchDate = date;
	};
	
	// 目标查询
	methods_main.queryTargetDatas = function() {
		var obj = pageVue.userParams;
		context.clearParam();
		context.put(obj);
		var g = this;
		var loading = layer.load();
		target.doQuery(function(data) {
			layer.close(loading);
			g.updateTargetDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_main.updateTargetDatas = function() {
		var vs = target.$rowSet.$views;
		if (vs.length == 0) {
			this.targetMassege.splice(0, this.targetMassege.length);
		} else {
			this.targetMassege = vs;
		}
	};
	
	// 个人技能查询
	methods_main.querySkillDatas = function() {
		var obj = pageVue.userParams;
		context.clearParam();
		context.put(obj);
		var g = this;
		var loading = layer.load();
		skill.doQuery(function(data) {
			layer.close(loading);
			g.updateSkillDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	methods_main.updateSkillDatas = function() {
		var vs = skill.$rowSet.$views;
		if (vs.length == 0) {
			this.userSkills.splice(0, this.userSkills.length);
		} else {
			this.userSkills = vs;
		}
		this.pushSkillLevel();
	};
	// 根据技能分数匹配技能等级
	methods_main.pushSkillLevel = function () {
		var arr = this.userSkills;
		var	skillScore;
		for (var i = 0,vlen = arr.length;i<vlen;i++) {
			skillScore = arr[i].skill_score/arr[i].skill_totalScore;
			if (skillScore < 0.25) {
				arr[i].skill_level="了解";
			}
			else if (skillScore < 0.50 && skillScore >= 0.25) {
				arr[i].skill_level="熟练"
			}
			else if (skillScore < 0.75 && skillScore >= 0.50) {
				arr[i].skill_level="掌握";
			}
			else if (skillScore <= 1.0 && skillScore >= 0.75) {
				arr[i].skill_level="精通";
			}
		}
		return this.userSkills = arr;
	};
	
	// 当前所有岗位查询
	methods_main.queryCurrentPostDatas = function() {
		var obj = pageVue.userParams;
		context.clearParam();
		context.put(obj);
		var g = this;
		var loading = layer.load();
		currentPost.doQuery(function(data) {
			layer.close(loading);
			g.updateCurrentPostDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_main.updateCurrentPostDatas = function() {
		var vs = currentPost.$rowSet.$views;
		if (vs.length == 0) {
			this.currentPosts.splice(0, this.currentPosts.length);
		} else {
			this.currentPosts = vs;
		}
		// 设置post_code的默认值
		this.postParams.post_code = this.currentPosts[0].post_code;
		this.queryPostDatas();
	};
	
	// 岗位路线查询
	methods_main.queryPostDatas = function() {
		var obj = pageVue.postParams;
		context.clearParam();
		context.put(obj);
		var g = this;
		var loading = layer.load();
		post.doQuery(function(data) {
			layer.close(loading);
			g.updatePostDatas();
			g.getIndex();
			g.$nextTick(function(){
				g.timeline();
			});
			
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_main.updatePostDatas = function() {
		var vs = post.$rowSet.$views;
		if (vs.length == 0) {
			this.postRoute.splice(0, this.postRoute.length);
		} else {
			this.postRoute = vs;
		}
	};
	// 获取当前岗位下标
	methods_main.getIndex = function() {
		var arr = this.postRoute;
		var postCode = this.postParams.post_code;
		for(var i = 0,vlen = arr.length;i<vlen;i++){
			if(arr[i].post_code == postCode){
				return this.postParams.postCodeIndex = i;
			}
		}
	};
	
	// 查询历史岗位
	methods_main.queryOverPostDatas = function() {
		var obj = pageVue.userParams;
		context.clearParam();
		context.put(obj);
		var g = this;
		var loading = layer.load();
		overPost.doQuery(function(data) {
			layer.close(loading);
			g.updateOverPostDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	methods_main.updateOverPostDatas = function() {
		var vs = overPost.$rowSet.$views;
		if (vs.length == 0) {
			this.overPosts.splice(0, this.overPosts.length);
		} else {
			this.overPosts = vs;
		}
	};
	
	// 大神查询
	methods_main.queryManitoDatas = function() {
		var g = this;
		var loading = layer.load();
		manito.doQuery(function(data) {
			layer.close(loading);
			g.updateManitoDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	methods_main.updateManitoDatas = function() {
		var vs = manito.$rowSet.$views;
		if (vs.length == 0) {
			this.manitos.splice(0, this.manitos.length);
		} else {
			this.manitos = vs;
		}
		this.changeLimit();
	};
	// 换一换
	methods_main.changeLimit = function() {
		function getArrayItems(arr, num) {
            const temp_array = [];
            for (var index in arr) {
                temp_array.push(arr[index]);
            }
            const return_array = [];
            for (var i = 0; i<num; i++) {
                if (temp_array.length>0) {
                    const arrIndex = Math.floor(Math.random()*temp_array.length);
                    return_array[i] = temp_array[arrIndex];
                    temp_array.splice(arrIndex, 1);
                } else {
                    break;
                }
            }
            return return_array;
        }
        this.randomManitos = getArrayItems(this.manitos, 4);
	};
	
	// 打开编辑
	methods_main.updatePersonalTarget = function() {
		this.targetEdit = true;
	};
	methods_main.updateCareerOrientation = function() {
		this.careerEdit = true;
	};
	
	// 保存目标数据
	methods_main.targetSave = function() {
		var g = this;
		this.$refs['targetForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				context.doAction({
					statement : 'SDP-CAREER-002',
					params : {
						user_id: g.userParams.user_id,
						personal_goals : g.targetPlan.personal_goals,
						startDate : g.Datedata.startDate,
						fetchDate : g.Datedata.fetchDate,
					}
				}, '/api/common/update', function(data) {
					layer.close(loading);
					g.queryTargetDatas();
					layer.msg("保存成功");
					g.targetEdit = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				});
			} else {
				return false;
			}
		});
	};
	// 取消编辑
	methods_main.targetCancel = function() {
		this.targetPlan.personal_goals = '';
		this.targetPlan.startDate = '';
		this.targetPlan.fetchDate = '';
		this.$Message.info('取消编辑');
		this.targetEdit = false;
	};
	// 保存职业倾向数据
	methods_main.careerSave = function() {
		var g = this;
		this.$refs['careerForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				context.doAction({
					statement : 'SDP-CAREER-003',
					params : {
						user_id: g.userParams.user_id,
						careerOrientation : g.careerMassege.careerOrientation,
					}
				}, '/api/common/update', function(data) {
					layer.close(loading);
					g.queryTargetDatas();
					layer.msg("保存成功");
					g.careerEdit = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				});
			} else {
				return false;
			}
		});
	};
	methods_main.careerCancel = function() {
		this.careerMassege.careerOrientation = '';
		this.$Message.info('取消编辑');
		this.careerEdit = false;
	};
	
	// 根据岗位切换路线
	methods_main.postSelected = function(code) {
		this.postParams.post_code = code;
		console.log(this.postParams.post_code);
		this.queryPostDatas();
	}
	// 鼠标单击调出个人能力分析图	
	methods_main.skillMapShow = function(post_code) {
		this.skillMapParams.post_code = post_code;
		this.skillMapParams.user_id=pageVue.userParams.user_id;
		$("#skillMap").empty();
		pageVue.querySkillMapData();
		$("#skill-map").slideDown(500);
		// 点击其他位置，分析图隐藏
		$(document).click(function(){
			$("#skill-map").slideUp(500);
		});
		// 点击分析图和鼠标悬停点不会隐藏
		$("#skill-map,#hover").click(function(e) { 
		    e.stopPropagation(); 
		});
	}
	// 连接技能图谱
	methods_main.skillMap = function() {
		window.location.href="iviewTestTree.html?user_id="+this.userParams.user_id;
	}
	// 连接晋升申请
	methods_main.promote = function() {
		window.location.href="iviewTestBar.html?post_code="+this.postParams.post_code+"&user_id="+this.userParams.user_id;
	}
	// 大神详情
	methods_main.manitoMassege = function(id) {
		window.location.href="goddetail.html?user_id="+id;
	}
	
	// 个人能力分析图
	methods_main.querySkillMapData = function() {
		var obj = pageVue.skillMapParams;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;
		skillBar.doQuery(function(data) {
			layer.close(loading);
			g.drawBar1();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	methods_main.drawBar1 = function() {
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
			};
			var text = pageDatas[0]['pNext'];
			var myCharts1 = echarts.init(document.getElementById("skillMap"));
			var option1 = {
				tooltip : {
					trigger : 'item' // axis以X轴线触发,item以每一个数据项触发
				},
				legend : {
					data : [ '个人掌握技能', '岗位要求技能' ]
				},
				dataZoom : {
					show : true,
					realtime : true,
					y : 36,
					height : 20,
					handleColor : '#47A447',
					start : 10,
					end : 60
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
					name : '个人掌握技能',
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
					name : '岗位要求技能',
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
	
	// 线路初始化
	methods_main.timeline = function () {
		var timelines = $('.cd-horizontal-timeline'),
			eventsMinDistance = 60;	
		var selectIndex = this.postParams.postCodeIndex;
		(timelines.length > 0) && initTimeline(timelines);	
		// 初始化时间轴
		function initTimeline(timelines) {
			timelines.each(function() {
				var timeline = $(this),
				timelineComponents = {};
				// 缓存时间轴组件
				timelineComponents['timelineWrapper'] = timeline.find('.events-wrapper');
				timelineComponents['eventsWrapper'] = timelineComponents['timelineWrapper'].children('.events');
				timelineComponents['fillingLine'] = timelineComponents['eventsWrapper'].children('.filling-line');
				timelineComponents['timelineEvents'] = timelineComponents['eventsWrapper'].find('a');
				timelineComponents['timelineNavigation'] = timeline.find('.cd-timeline-navigation');

				// 初始化时间轴
				timeline.addClass('loaded');
				// 设置时间轴宽度
				var timelineTotWidth = setTimelineWidth(timelineComponents, eventsMinDistance);
				// 设置时间轴上a标签的位置
				setDatePosition(timelineComponents, eventsMinDistance);
				// 给指定的a标签标记为选中状态
				timelineComponents['timelineEvents'].removeClass('selected');
				timelineComponents['timelineEvents'].eq(selectIndex).addClass('selected');
				// 使时间轴的填充到指定的a标签位置
				updateFilling(timelineComponents['timelineEvents'].eq(selectIndex), timelineComponents['fillingLine'], timelineTotWidth);
				// 检测下一个箭头的点击事件
				timelineComponents['timelineNavigation'].on('mouseover', '.next', function(event) {
					event.preventDefault();//防止事件不执行
					updateSlide(timelineComponents, timelineTotWidth, 'next');//滑动时间轴
				});
				// 检测上一个箭头的点击事件
				timelineComponents['timelineNavigation'].on('mouseover', '.prev', function(event) {
					event.preventDefault();
					updateSlide(timelineComponents, timelineTotWidth, 'prev');
				});
			});
		}
		
		// 左右滑动时间轴
		function updateSlide(timelineComponents, timelineTotWidth, string) {
			var translateValue = getTranslateValue(timelineComponents['eventsWrapper']),
				wrapperWidth = Number(timelineComponents['timelineWrapper'].css('width').replace('px', ''));
			(string == 'next') 
				? translateTimeline(timelineComponents, translateValue - wrapperWidth + eventsMinDistance, wrapperWidth - timelineTotWidth)
				: translateTimeline(timelineComponents, translateValue + wrapperWidth - eventsMinDistance);
		}
		// 调动时间轴
		function translateTimeline(timelineComponents, value, totWidth) {
			var eventsWrapper = timelineComponents['eventsWrapper'].get(0);
			value = (value > 0) ? 0 : value; // 只有负数数值调动
			value = (!(typeof totWidth === 'undefined') &&  value < totWidth) ? totWidth : value; // 调动不能超过时间轴的宽度
			setTransformValue(eventsWrapper, 'translateX', value+'px');
			// 改变箭头的状态（inactive不可用）
			(value == 0) ? timelineComponents['timelineNavigation'].find('.prev').addClass('inactive') : timelineComponents['timelineNavigation'].find('.prev').removeClass('inactive');
			(value == totWidth) ? timelineComponents['timelineNavigation'].find('.next').addClass('inactive') : timelineComponents['timelineNavigation'].find('.next').removeClass('inactive');
		}
		// 更新时间轴的填充
		function updateFilling(selectedEvent, filling, totWidth) {
			// 根据选中状态a标签改变时间轴的填充长度
			var eventStyle = window.getComputedStyle(selectedEvent.get(0), null),
				eventLeft = eventStyle.getPropertyValue("left"),
				eventWidth = eventStyle.getPropertyValue("width");
			eventLeft = Number(eventLeft.replace('px', '')) + Number(eventWidth.replace('px', ''))/2;
			var scaleValue = eventLeft/totWidth;
			setTransformValue(filling.get(0), 'scaleX', scaleValue);
		}
		// 设置时间轴上点的位置
		function setDatePosition(timelineComponents, min) {
			var distance = 60;
			for (var i = 0; i < timelineComponents['timelineEvents'].length; i++) { 
				timelineComponents['timelineEvents'].eq(i).css('left', distance+'px');
				distance = distance+120;
			}
		}
		// 设置时间轴的宽度
		function setTimelineWidth(timelineComponents, width) {
			var totalWidth=0;
			totalWidth = (timelineComponents['timelineEvents'].length+1)*120
			timelineComponents['eventsWrapper'].css('width', totalWidth+'px');
			return totalWidth;
		}
		// 获取调动数值
		function getTranslateValue(timeline) {
			var timelineStyle = window.getComputedStyle(timeline.get(0), null),
				timelineTranslate = timelineStyle.getPropertyValue("-webkit-transform") ||
	         		timelineStyle.getPropertyValue("-moz-transform") ||
	         		timelineStyle.getPropertyValue("-ms-transform") ||
	         		timelineStyle.getPropertyValue("-o-transform") ||
	         		timelineStyle.getPropertyValue("transform");
	        if (timelineTranslate.indexOf('(') >=0) {
	        	var timelineTranslate = timelineTranslate.split('(')[1];
	    		timelineTranslate = timelineTranslate.split(')')[0];
	    		timelineTranslate = timelineTranslate.split(',');
	    		var translateValue = timelineTranslate[4];
	        } else {
	        	var translateValue = 0;
	        }
	        return Number(translateValue);
		}
		// 设置变化数据
		function setTransformValue(element, property, value) {
			element.style["-webkit-transform"] = property+"("+value+")";
			element.style["-moz-transform"] = property+"("+value+")";
			element.style["-ms-transform"] = property+"("+value+")";
			element.style["-o-transform"] = property+"("+value+")";
			element.style["transform"] = property+"("+value+")";
		}
	}
	
	// 获取地址栏数据
	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r!=null) {
			return unescape(r[2]);
		}
		return null;
	}
	
	//获取用户信息
	methods_main.getUserInfo= function() {
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
				//g.params.user_id=SDP.loginUser.userId;
				g.userParams.user_id='52';
				g.queryTargetDatas();
				g.querySkillDatas();
				g.queryOverPostDatas();
				g.queryManitoDatas();
				g.queryCurrentPostDatas();
			}
		}, function(data) {
			layer.alert(data.msg);
		});
	};
	
	// 初始化数据
	page_config.mounted = function() {
		this.$nextTick(function(){
			// this.userParams.user_id = getUrlParam("user_id");
			this.getUserInfo();
//			setTimeout(() => {
//		      }, 20);
			
		});	
	};
		
	// 实例化vue
	var pageVue = new Vue(page_config);
});