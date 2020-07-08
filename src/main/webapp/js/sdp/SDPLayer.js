/**
 * 开发平台弹出选择窗口
 * 
 * @文件名 SDPLayer
 * @作者 李浩祺
 * @创建日期 2017-11-18
 * @版本 V 1.0
 */
$(function() {
	SDP.layer = new function() {
		/**
		 * conf layer配置参数; data 传入参数; isParent true 在父窗口弹出 false 本地窗口弹出;
		 * callBack 回调函数
		 */
		this.open = function(conf, data, callBack, isParent) {
			conf.success = function(layero, index) {
				// 得到iframe页的窗口对象，执行iframe页的方法：
				var obj = (isParent == false ? window : parent)
				var iframeWin = obj.frames[layero.find('iframe')[0]['name']];
				var tmp = {
					data : data,
					callback : callBack
				};
				setTimeout(function() {
					iframeWin.$.sendParams(tmp);
				}, 150);
				/*if (iframeWin.$.sendParams) {
					iframeWin.$.sendParams(tmp);
				} else {
					setTimeout(function() {
						iframeWin.$.sendParams(tmp);
					}, 150);
				}*/
			};
			var $index = -1;
			if (isParent == false) {
				$index = layer.open(conf);
			} else {
				$index = parent.layer.open(conf);
			}

			return $index;
		};
	};
});