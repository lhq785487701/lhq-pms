package com.lhq.pms.logging;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.lhq.pms.data.PMSContext;

/**
 * 日志输出
 */
public class Log {
	private Logger logger = null;

	private Log(Logger logger) {
		this.logger = logger;
	}

	/**
	 * @return 获得日志，自动判定日志发出者
	 */
	public static Log get() {
		StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();
		Log log = new Log(LoggerFactory.getLogger(stackTrace[2].getClassName()));
		return log;
	}

	public boolean isDebug() {
		return logger.isDebugEnabled();
	}

	public boolean isInfo() {
		return logger.isInfoEnabled();
	}

	public boolean isTrace() {
		return logger.isTraceEnabled();
	}

	public void trace(String msg) {
		if (this.isTrace()) {
			PMSContext context = LogParams.current();
			logger.trace(msg, context);
		}
	}

	public void trace(String msg, Object... arguments) {
		if (this.isTrace()) {
			PMSContext context = LogParams.current();
			List<Object> list = new ArrayList<Object>();
			if (arguments != null) {
				Collections.addAll(list, arguments);
			}
			list.add(context);
			arguments = list.toArray();
			logger.trace(msg, arguments);
		}
	}

	public void debug(String msg) {
		if (this.isDebug()) {
			PMSContext context = LogParams.current();
			logger.debug(msg, context);
		}
	}

	public void debug(String msg, Object... arguments) {
		if (this.isDebug()) {
			PMSContext context = LogParams.current();
			List<Object> list = new ArrayList<Object>();
			if (arguments != null) {
				Collections.addAll(list, arguments);
			}
			list.add(context);
			arguments = list.toArray();
			logger.debug(msg, arguments);
		}
	}

	public void info(String msg) {
		if (this.isInfo()) {
			PMSContext context = LogParams.current();
			logger.info(msg, context);
		}
	}

	public void info(String msg, Object... arguments) {
		if (this.isInfo()) {
			PMSContext context = LogParams.current();
			List<Object> list = new ArrayList<Object>();
			if (arguments != null) {
				Collections.addAll(list, arguments);
			}
			list.add(context);
			arguments = list.toArray();
			logger.info(msg, arguments);
		}
	}

	public void warn(String msg) {
		PMSContext context = LogParams.current();
		logger.warn(msg, context);
	}

	public void warn(String msg, Object... arguments) {
		PMSContext context = LogParams.current();
		List<Object> list = new ArrayList<Object>();
		if (arguments != null) {
			Collections.addAll(list, arguments);
		}
		list.add(context);
		arguments = list.toArray();
		logger.warn(msg, arguments);
	}

	public void error(String msg, Object... arguments) {
		error(msg, null, arguments);
	}

	public void error(Throwable t) {
		error("", t);
	}

	public void error(String msg, Throwable t, Object... arguments) {
		PMSContext context = LogParams.current();
		List<Object> list = new ArrayList<Object>();
		if (arguments != null) {
			Collections.addAll(list, arguments);
		}
		list.add(context);
		list.add(t);
		arguments = list.toArray();
		logger.error(msg, arguments);
	}

	public void error(String msg, Throwable t) {
		PMSContext context = LogParams.current();
		logger.error(msg, context, t);
	}
}
