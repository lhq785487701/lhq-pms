package com.lhq.pms.message;

import java.io.Serializable;

/**
 * 消息监听
 * 
 * @author lhq 
 */
public interface MessageDelegateListener {
	/**
	 * 接受消息
	 * 
	 * @param message
	 */
	public void handleMessage(Serializable message);
}
