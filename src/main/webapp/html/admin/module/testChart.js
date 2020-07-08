/**
 * 门户脚本
 * 
 * @文件名 testChart
 * @作者 李浩祺
 * @创建日期 2017-11-17
 * @版本 V 1.0
 */
"use strict";
$(function() {
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {}
	};

	var methods_page = page_conf.methods = {};

	// 初始化
	page_conf.mounted = function() {
		var chart = echarts.init($("#testUser")[0]);
		var option = {
			title : {
				text : '某地区蒸发量和降水量',
				subtext : '纯属虚构'
			},
			tooltip : {
				trigger : 'axis'
			},
			legend : {
				data : [ '蒸发量', '降水量' ]
			},
			toolbox : {
				show : true,
				feature : {
					mark : {
						show : true
					},
					dataView : {
						show : true,
						readOnly : false
					},
					magicType : {
						show : true,
						type : [ 'line', 'bar' ]
					},
					restore : {
						show : true
					},
					saveAsImage : {
						show : true
					}
				}
			},
			calculable : true,
			xAxis : [ {
				type : 'category',
				data : [ '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月',
						'10月', '11月', '12月' ]
			} ],
			yAxis : [ {
				type : 'value'
			} ],
			series : [
					{
						name : '蒸发量',
						type : 'bar',
						data : [ 2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2,
								32.6, 20.0, 6.4, 3.3 ],
						markPoint : {
							data : [ {
								type : 'max',
								name : '最大值'
							}, {
								type : 'min',
								name : '最小值'
							} ]
						},
						markLine : {
							data : [ {
								type : 'average',
								name : '平均值'
							} ]
						}
					},
					{
						name : '降水量',
						type : 'bar',
						data : [ 2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2,
								48.7, 18.8, 6.0, 2.3 ],
						markPoint : {
							data : [ {
								name : '年最高',
								value : 182.2,
								xAxis : 7,
								yAxis : 183,
								symbolSize : 18
							}, {
								name : '年最低',
								value : 2.3,
								xAxis : 11,
								yAxis : 3
							} ]
						},
						markLine : {
							data : [ {
								type : 'average',
								name : '平均值'
							} ]
						}
					} ]
		};
		chart.setOption(option);
	};

	var pageVue = new Vue(page_conf);
	
	
	$.testCallFromTab = function() {
		//在别人关闭的时候被调用的,隐藏
		document.getElementById('testUser').style.display='none';
	};
});