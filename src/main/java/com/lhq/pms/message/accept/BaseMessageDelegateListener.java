package com.lhq.pms.message.accept;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import com.alibaba.druid.support.json.JSONUtils;
import com.lhq.pms.logging.bo.LogBo;
import com.lhq.pms.message.MessageDelegateListener;
import com.lhq.pms.message.PMSTopic;
import com.lhq.pms.utils.DateUtils;
import com.lhq.pms.utils.GlobalUtils;

/**
 * 类功能描述
 * 
 * @author lhq 
 */
public abstract class BaseMessageDelegateListener implements MessageDelegateListener {

	@Resource(name = "messageAcceptLogBo")
	protected LogBo logBo;

	/**
	 * 接受消息
	 */
	@Override
	public void handleMessage(Serializable message) {
		if (message instanceof PMSTopic) {
			/**
			 * 订阅的消息
			 */
			PMSTopic topic = (PMSTopic) message;
			acceptLog(topic);
			acceptMessage(topic);
		}
	}

	/**
	 * 接受日志
	 * 
	 * @param topic
	 */
	protected void acceptLog(PMSTopic topic) {
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

	/**
	 * 处理接受消息
	 * 
	 * @param topic
	 */
	abstract protected void acceptMessage(PMSTopic topic);
}
