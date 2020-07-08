package com.lhq.pms.plugin.redis;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.Topic;

import com.lhq.pms.logging.Log;
import com.lhq.pms.message.MessageListenerContainer;
import com.lhq.pms.utils.SpringUtils;
import com.lhq.pms.utils.StringUtils;

/**
 * 类功能描述
 * 
 * @author lhq 
 */
public class PMSRedisMessageListenerContainer extends RedisMessageListenerContainer implements MessageListenerContainer {
	protected final static Log log = Log.get();

	private Map<String, Collection<String>> listeners = new HashMap<String, Collection<String>>();

	/**
	 * @return the listeners
	 */
	public Map<String, Collection<String>> getListeners() {
		return listeners;
	}

	/**
	 * 添加消息监听
	 */
	@Override
	public void addMessageListener(String listener, Collection<String> topics) {
		if (topics != null && topics.size() > 0) {
			MessageListener mla = (MessageListener) SpringUtils.getBean(listener);
			if (mla != null) {
				this.listeners.put(listener, topics);

				Collection<Topic> lists = new ArrayList<Topic>();
				for (String t : topics) {
					lists.add(new ChannelTopic(t));
				}
				super.addMessageListener(mla, lists);
			}
		}
	}

	/**
	 * 添加消息处理
	 */
	@Override
	public void addMessageListener(String listener, String topic) {
		if (StringUtils.isNotEmpty(topic)) {
			MessageListener mla = (MessageListener) SpringUtils.getBean(listener);
			if (mla != null) {
				this.listeners.put(listener, Arrays.asList(topic));

				super.addMessageListener(mla, new ChannelTopic(topic));
			}
		}
	}
}
