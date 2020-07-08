package com.lhq.pms.plugin.redis;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.alibaba.druid.support.json.JSONUtils;
import com.lhq.pms.logging.bo.LogBo;
import com.lhq.pms.message.PMSMessage;
import com.lhq.pms.message.PMSTopic;
import com.lhq.pms.utils.DateUtils;
import com.lhq.pms.utils.GlobalUtils;

/**
 * 类功能描述
 * 
 * @author lhq 
 */
@Service("messageHandel")
public class RedisMessageHandel implements PMSMessage {

	@Resource(name = "redisTemplate")
	private RedisTemplate<?, ?> redisTemplate = null;

	@Resource(name = "messageSendLogBo")
	private LogBo logBo;

	/**
	 * 发送消息
	 */
	@Override
	public void send(PMSTopic topic) {
		redisTemplate.convertAndSend(topic.getChannelName(), topic);

		try {
			String str = JSONUtils.toJSONString(topic.getData());
			Map<String, Object> d = new HashMap<String, Object>(10);
			d.put("nodeId", GlobalUtils.NODE.getNodeCode());
			d.put("channelName", topic.getChannelName());
			d.put("msgId", topic.getId());
			d.put("type", topic.getType());
			d.put("serverIp", GlobalUtils.getServerIp());
			d.put("system", GlobalUtils.getSystemCode());
			d.put("data", str);
			d.put("create", DateUtils.currTimestamp());

			logBo.doLog(d);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
