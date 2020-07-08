/**
 * 文件上传脚本
 * 
 * @文件名 ajaxfileupload
 * @作者 李浩祺
 * @创建日期 2017-04-29
 * @版本 V 1.0
 */
$(function() {
	var upload = {
		createUploadIframe : function(id, uri) {
			// create frame
			var frameId = 'jUploadFrame' + id;
			var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId
					+ '" style="position:absolute; top:-9999px; left:-9999px"';
			if (window.ActiveXObject) {
				if (typeof uri == 'boolean') {
					iframeHtml += ' src="' + 'javascript:false' + '"';

				} else if (typeof uri == 'string') {
					iframeHtml += ' src="' + uri + '"';

				}
			}
			iframeHtml += ' />';
			jQuery(iframeHtml).appendTo(document.body);

			return jQuery('#' + frameId).get(0);
		},
		createUploadForm : function(id, fileElementId, data) {
			// create form
			var formId = 'jUploadForm' + id;
			var fileId = 'jUploadFile' + id;
			var form = jQuery('<form  action="" method="POST" name="' + formId
					+ '" id="' + formId
					+ '" enctype="multipart/form-data"></form>');
			if (data) {
				jQuery('<input type="hidden" name="sdpData" value="" />')
						.appendTo(form);
			}
			var oldElement = jQuery('[id=' + fileElementId + ']');
			if (oldElement.length > 0) {
				jQuery.each(oldElement, function(index, element) {
					var newElement = jQuery(element).clone();
					jQuery(element).attr('id', fileId);
					jQuery(element).before(newElement);
					jQuery(element).appendTo(form);
				});
			} else {
				var newElement = jQuery(oldElement).clone();
				jQuery(oldElement).attr('id', fileId);
				jQuery(oldElement).before(newElement);
				jQuery(oldElement).appendTo(form);
			}

			// set attributes
			jQuery(form).css('position', 'absolute');
			jQuery(form).css('top', '-1200px');
			jQuery(form).css('left', '-1200px');
			jQuery(form).appendTo('body');
			return form;
		},

		ajaxFileUpload : function(s) {
			// TODO introduce global settings, allowing the client to modify
			// them for all requests, not only timeout
			s = jQuery.extend({}, jQuery.ajaxSettings, s);
			var id = new Date().getTime();
			var form = jQuery.createUploadForm(id, s.fileElementId,
					(typeof (s.data) == 'undefined' ? false : s.data));
			var io = jQuery.createUploadIframe(id, s.secureuri);
			var frameId = 'jUploadFrame' + id;
			var formId = 'jUploadForm' + id;
			// Watch for a new set of requests
			if (s.global && !jQuery.active++) {
				jQuery.event.trigger("ajaxStart");
			}
			var requestDone = false;
			// Create the request object
			var xml = {};
			if (s.global)
				jQuery.event.trigger("ajaxSend", [ xml, s ]);
			// Wait for a response to come back
			var uploadCallback = function(isTimeout) {
				var io = document.getElementById(frameId);
				try {
					if (io.contentWindow) {
						xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerText
								: null;
						xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument
								: io.contentWindow.document;

					} else if (io.contentDocument) {
						xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML
								: null;
						xml.responseXML = io.contentDocument.document.XMLDocument ? io.contentDocument.document.XMLDocument
								: io.contentDocument.document;
					}
				} catch (e) {
					if (s.error) {
						s.error(xml, status);
					}
				}
				if (xml || isTimeout == "timeout") {
					requestDone = true;
					var status;
					try {
						status = isTimeout != "timeout" ? "success" : "error";
						// Make sure that the request was successful or
						// notmodified
						if (status != "error") {
							// process the data (runs the xml through
							// httpData regardless of callback)
							var data = jQuery.uploadHttpData(xml, s.dataType);
							// If a local callback was specified, fire it
							// and pass it the data
							if (s.success)
								s.success(data, status);

							// Fire the global callback
							if (s.global)
								jQuery.event.trigger("ajaxSuccess", [ xml, s ]);
						} else {
							if (s.error) {
								s.error(xml, status);
							}
						}
					} catch (e) {
						status = "error";
						if (s.error) {
							s.error(xml, status);
						}
					}

					// The request was completed
					if (s.global)
						jQuery.event.trigger("ajaxComplete", [ xml, s ]);

					// Handle the global AJAX counter
					if (s.global && !--jQuery.active)
						jQuery.event.trigger("ajaxStop");

					// Process result
					if (s.complete)
						s.complete(xml, status);

					jQuery(io).unbind();

					setTimeout(function() {
						try {
							jQuery(io).remove();
							jQuery(form).remove();

						} catch (e) {
							jQuery.handleError(s, xml, null, e);
						}

					}, 100);

					xml = null;

				}
			};
			// Timeout checker
			if (s.timeout > 0) {
				setTimeout(function() {
					// Check to see if the request is still happening
					if (!requestDone)
						uploadCallback("timeout");
				}, s.timeout);
			}
			try {

				var form = jQuery('#' + formId);
				jQuery(form).attr('action', s.url);
				jQuery(form).attr('method', 'POST');
				jQuery(form).attr('target', frameId);

				if (s.data) {
					jQuery('#' + formId + " > input[name='sdpData']").val(
							s.data);
				}

				if (form.encoding) {
					jQuery(form).attr('encoding', 'multipart/form-data');
				} else {
					jQuery(form).attr('enctype', 'multipart/form-data');
				}
				jQuery(form).submit();

			} catch (e) {
				jQuery.handleError(s, xml, null, e);
			}

			jQuery('#' + frameId).load(uploadCallback);
			return {
				abort : function() {
				}
			};

		},

		uploadHttpData : function(r, type) {
			var data = !type;
			data = type == "xml" || data ? r.responseXML : r.responseText;
			if (!data) {
				data = r.responseXML.body ? r.responseXML.body.textContent : "";
			}
			// If the type is "script", eval it in global context
			if (type == "script")
				jQuery.globalEval(data);
			// Get the JavaScript object, if JSON is used.
			if (type == "json")
				eval("data = " + data);
			// evaluate scripts within html
			if (type == "html")
				jQuery("<div>").html(data).evalScripts();

			return data;
		}
	};
	jQuery.extend(upload);
});
