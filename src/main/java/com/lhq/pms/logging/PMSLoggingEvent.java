package com.lhq.pms.logging;

import java.util.Map;

import org.slf4j.Marker;

import com.lhq.pms.data.PMSContext;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.classic.spi.IThrowableProxy;
import ch.qos.logback.classic.spi.LoggerContextVO;

/**
 * 日志事件信息
 * 
 * @author lhq 
 */
public class PMSLoggingEvent implements ILoggingEvent {

	private ILoggingEvent owner = null;

	private Object[] argumentArray = null;

	public ILoggingEvent getOwner() {
		return owner;
	}

	public void setOwner(ILoggingEvent owner) {
		this.owner = owner;
	}

	private PMSContext context = null;

	public PMSContext getContext() {
		return context;
	}

	public void setContext(PMSContext context) {
		this.context = context;
	}

	public void setArgumentArray(Object[] argArray) {
		this.argumentArray = argArray;
	}

	/**
	 * 获取参数
	 */
	@Override
	public Object[] getArgumentArray() {
		return this.argumentArray;
	}

	/**
	 * 获取堆栈
	 */
	@Override
	public StackTraceElement[] getCallerData() {
		return owner.getCallerData();
	}

	/**
	 * 获取格式化信息
	 */
	@Override
	public String getFormattedMessage() {
		return owner.getFormattedMessage();
	}

	/**
	 * 获取级别
	 */
	@Override
	public Level getLevel() {
		return owner.getLevel();
	}

	/**
	 * 获取日志对象
	 */
	@Override
	public LoggerContextVO getLoggerContextVO() {
		return owner.getLoggerContextVO();
	}

	/**
	 * 获取输出名称
	 */
	@Override
	public String getLoggerName() {
		return owner.getLoggerName();
	}

	/**
	 * 获取mdc
	 */
	@Override
	public Map<String, String> getMDCPropertyMap() {
		return owner.getMDCPropertyMap();
	}

	/**
	 * 获取maker
	 */
	@Override
	public Marker getMarker() {
		return owner.getMarker();
	}

	/**
	 * 获取消息
	 */
	@Override
	public String getMessage() {
		return owner.getMessage();
	}

	/**
	 * 获取线程名称
	 */
	@Override
	public String getThreadName() {
		return owner.getThreadName();
	}

	/**
	 * 
	 */
	@Override
	public IThrowableProxy getThrowableProxy() {
		return owner.getThrowableProxy();
	}

	/**
	 * 
	 */
	@Override
	public long getTimeStamp() {
		return owner.getTimeStamp();
	}

	/**
	 * 
	 */
	@Override
	public boolean hasCallerData() {
		return owner.hasCallerData();
	}

	/**
	 * 
	 */
	@Override
	public void prepareForDeferredProcessing() {
		owner.prepareForDeferredProcessing();
	}

	/**
	 * @return 返回 map
	 */
	@Override
	public Map<String, String> getMdc() {
		return this.owner.getMDCPropertyMap();
	}
}
