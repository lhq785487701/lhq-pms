package com.lhq.pms.logging;

import java.text.MessageFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.lhq.pms.cache.PMSCache;
import com.lhq.pms.cache.PMSCacheManager;
import com.lhq.pms.data.PMSContext;
import com.lhq.pms.logging.bo.LogBo;
import com.lhq.pms.utils.ExceptionUtils;
import com.lhq.pms.utils.GlobalUtils;
import com.lhq.pms.utils.SpringUtils;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.classic.spi.ThrowableProxy;
import ch.qos.logback.core.UnsynchronizedAppenderBase;

/**
 * 日志
 * 
 * @author lhq 
 */
public class PMSLogAppender extends UnsynchronizedAppenderBase<ILoggingEvent> {

	private LogBo log;

	private Boolean logConsoleOutFlag = false;

	private void init() {
		this.log = (LogBo) SpringUtils.getBean("logBo");
		this.logConsoleOutFlag = (Boolean) SpringUtils.getBean("logConsoleOutFlag");
	}

	/**
	 * 追加日志
	 */
	@Override
	protected void append(ILoggingEvent evt) {
		if (!(evt instanceof PMSLoggingEvent)) {
			return;
		}
		if (this.log == null) {
			init();
		}

		Map<String, Object> m = new HashMap<String, Object>(20);
		String msg = evt.getFormattedMessage();
		msg = MessageFormat.format(msg, evt.getArgumentArray());
		if (evt.getThrowableProxy() != null) {
			ThrowableProxy tp = (ThrowableProxy) evt.getThrowableProxy();
			StringBuilder sb = ExceptionUtils.getException(msg, tp.getThrowable());
			msg = sb.toString();
		}

		m.put("nodeId", GlobalUtils.getNode().getNodeCode());
		m.put("message", msg);
		m.put("logger", evt.getLoggerName());
		m.put("create", new Date(evt.getTimeStamp()));
		m.put("level", evt.getLevel().levelStr);
		m.put("serverIp", GlobalUtils.getServerIp());
		m.put("system", GlobalUtils.getSystemCode());

		PMSLoggingEvent devt = (PMSLoggingEvent) evt;
		PMSContext context = devt.getContext();
		if (context == null) {

		} else {
			Map<String, Object> params = context.getParams();
			PMSCache cache = PMSCacheManager.getMenuCache();
			m.put("errorCode", params.get("$error_code"));
			m.put("actionUrl", params.get("$action_url"));
			m.put("userId", params.get("$user_code"));
			m.put("userName", params.get("$user_name"));
			m.put("userIp", params.get("$client_ip"));
			m.put("menuCode", params.get("sdp_menu_code"));
			m.put("menuName", cache.get((String) params.get("sdp_menu_code")));
			m.put("clientBrowser", params.get("$client_browser"));
			m.put("clientSystem", params.get("$client_system"));
			m.put("clientDevice", params.get("$client_device"));
		}
		if (logConsoleOutFlag) {
			System.out.println(msg);
		}
		if (log != null) {
			log.doLog(m);
		}
	}
}
