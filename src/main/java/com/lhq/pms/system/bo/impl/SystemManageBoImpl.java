package com.lhq.pms.system.bo.impl;

import javax.annotation.Resource;

import com.lhq.pms.common.bo.impl.CommonBoImpl;
import com.lhq.pms.data.PMSContext;
import com.lhq.pms.message.PMSMessage;
import com.lhq.pms.message.PMSTopic;
import com.lhq.pms.system.bo.SystemManageBo;

/**
 * 类功能描述
 * 
 * @author lhq
 */
public class SystemManageBoImpl extends CommonBoImpl implements SystemManageBo {
	@Resource(name = "messageHandel")
	private PMSMessage messageHandel = null;

	/**
	 * 查询系统信息
	 */
	@Override
	public void queryAllSystems(PMSContext context) {

	}

	/**
	 * 刷新系统信息
	 */
	@Override
	public void freshSystem(PMSContext context) {
		PMSTopic topic = new PMSTopic("com.sie.sdp.system");
		topic.setType("info");
		messageHandel.send(topic);
	}
}
