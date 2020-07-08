package com.lhq.pms.plugin.mongodb.redis;

import java.io.Serializable;

import com.lhq.pms.message.MessageDelegateListener;

/**
 * 类功能描述
 * 
 * @author lhq
 */
public class MapperDelegateListenerImpl implements MessageDelegateListener {

	/**
	 * 发送信息
	 */
	@Override
	public void handleMessage(Serializable message) {
		System.out.println(message);

	}
}
