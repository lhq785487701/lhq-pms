package com.lhq.pms.message;

import java.util.Collection;

/**
 * 消息监控容器
 * 
 * @author lhq 
 *
 */
public interface MessageListenerContainer {
	/**
	 * 添加消息监听
	 * 
	 * @param listener
	 * @param topics
	 */
	public void addMessageListener(String listener, Collection<String> topics);

	/**
	 * 添加消息监听
	 * 
	 * @param listener
	 * @param topic
	 */
	public void addMessageListener(String listener, String topic);

}
