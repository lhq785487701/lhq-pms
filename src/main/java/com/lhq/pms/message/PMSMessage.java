package com.lhq.pms.message;

/**
 * 类功能描述
 * 
 * @author lhq 
 */
public interface PMSMessage {

	/**
	 * 发送消息数据
	 * 
	 * @param topic
	 */
	public void send(PMSTopic topic);
}
