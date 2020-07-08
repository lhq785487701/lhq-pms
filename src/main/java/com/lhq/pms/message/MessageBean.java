package com.lhq.pms.message;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;

/**
 * 消息配置bean
 * 
 * @author lhq 
 */
public class MessageBean implements InitializingBean, DisposableBean {

	@Resource(name = "messageListenerContainer")
	private MessageListenerContainer messageListenerContainer;
	private String listener;
	private List<String> topics = null;
	private String topic = null;

	/**
	 * @return the topic
	 */
	public String getTopic() {
		return topic;
	}

	/**
	 * @param topic
	 *            the topic to set
	 */
	public void setTopic(String topic) {
		this.topic = topic;
	}

	/**
	 * @return the topics
	 */
	public List<String> getTopics() {
		return topics;
	}

	/**
	 * @param topics
	 *            the topics to set
	 */
	public void setTopics(List<String> topics) {
		this.topics = topics;
	}

	/**
	 * @return the listener
	 */
	public String getListener() {
		return listener;
	}

	/**
	 * @param listener
	 *            the listener to set
	 */
	public void setListener(String listener) {
		this.listener = listener;
	}

	/**
	 * 销毁
	 */
	@Override
	public void destroy() throws Exception {
		this.messageListenerContainer = null;
	}

	/**
	 * 属性设置后
	 */
	@Override
	public void afterPropertiesSet() throws Exception {
		if (this.topic != null) {
			this.messageListenerContainer.addMessageListener(listener, topic);
		}
		if (this.topics != null && this.topics.size() > 0) {
			this.messageListenerContainer.addMessageListener(listener, topics);
		}
	}
}
