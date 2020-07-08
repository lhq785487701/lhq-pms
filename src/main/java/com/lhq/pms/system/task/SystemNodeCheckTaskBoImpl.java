package com.lhq.pms.system.task;

import javax.annotation.Resource;

import com.lhq.pms.message.PMSMessage;
import com.lhq.pms.message.PMSTopic;
import com.lhq.pms.task.bo.TaskExecuteBo;
import com.lhq.pms.task.vo.PMSTaskBean;

/**
 * 类功能描述
 * 
 * @author lhq
 */
public class SystemNodeCheckTaskBoImpl implements TaskExecuteBo {
	@Resource(name = "messageHandel")
	private PMSMessage messageHandel = null;

	/**
	 * 系统心跳检查
	 */
	@Override
	public void execute(PMSTaskBean bean) {
		System.out.println("我是定时任务~~我是定时任务~~我是定时任务~~我是定时任务~~");
		PMSTopic topic = new PMSTopic("com.sie.sdp.system.node.check");
		topic.setType("info");
		messageHandel.send(topic);
	}
}
