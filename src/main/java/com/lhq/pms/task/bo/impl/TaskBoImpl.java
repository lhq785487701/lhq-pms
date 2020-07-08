package com.lhq.pms.task.bo.impl;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import com.lhq.pms.common.bo.impl.CommonBoImpl;
import com.lhq.pms.data.LoginUser;
import com.lhq.pms.data.PMSContext;
import com.lhq.pms.exception.PMSException;
import com.lhq.pms.message.PMSMessage;
import com.lhq.pms.message.PMSTopic;
import com.lhq.pms.task.ScheduleTaskService;
import com.lhq.pms.task.bo.TaskBo;

/**
 * 类功能描述
 * 
 * @author lhq
 */
public class TaskBoImpl extends CommonBoImpl implements TaskBo {
	@Resource(name = "messageHandel")
	private PMSMessage messageHandel = null;

	@Resource(name = "taskService")
	private ScheduleTaskService taskService;

	private static final String SDP_TASK_CHANGE = "com.lhq.pms.system.task.change";

	/**
	 * 执行1次
	 */
	@Override
	public void doOne(PMSContext context) {
		String code = (String) context.getParam("taskCode");
		this.sendMessage(code, TaskAction.ONE, "");
	}

	/**
	 * 开始执行
	 */
	@Override
	public void doStart(PMSContext context) {
		String code = (String) context.getParam("taskCode");
		LoginUser user = context.getLoginUser();
		this.sendMessage(code, TaskAction.START, user.getUserCode());
	}

	/**
	 * 暂停
	 */
	@Override
	public void doPause(PMSContext context) {
		String code = (String) context.getParam("taskCode");
		LoginUser user = context.getLoginUser();
		this.sendMessage(code, TaskAction.PAUSE, user.getUserCode());
	}

	/**
	 * 删除
	 */
	@Override
	public void doDelete(PMSContext context) {
		String code = (String) context.getParam("taskCode");
		LoginUser user = context.getLoginUser();
		this.sendMessage(code, TaskAction.DELETE, user.getUserCode());
	}

	/**
	 * 禁用
	 */
	@Override
	public void doDisable(PMSContext context) {
		String code = (String) context.getParam("taskCode");
		LoginUser user = context.getLoginUser();
		this.sendMessage(code, TaskAction.DISABLE, user.getUserCode());
	}

	/**
	 * 发送消息
	 * 
	 * @param sqlCode
	 * @param data
	 *            影响数据
	 * @param type
	 *            数据操作类型
	 */
	protected void sendMessage(String taskCode, TaskAction action, String userCode) {
		PMSTopic topic = new PMSTopic(SDP_TASK_CHANGE);
		topic.setType(taskCode);
		Map<String, String> data = new HashMap<String, String>(2);
		data.put("action", action.name);
		data.put("userCode", userCode);
		topic.setData(data);
		messageHandel.send(topic);
	}

	/**
	 * 启用
	 * 
	 * @param taskCode
	 */
	@Override
	public void doStart(String taskCode, String userCode) {
		Map<String, String> pars = new HashMap<String, String>(3);
		pars.put("task_sts", "Y");
		pars.put("task_code", taskCode);
		pars.put("user_code", userCode == null ? "system" : userCode);
		this.update("SDP-TASK-006", pars);
		taskService.startTask(taskCode);
	}

	/**
	 * 暂停
	 */
	@Override
	public void doPause(String taskCode, String userCode) {
		Map<String, String> pars = new HashMap<String, String>(3);
		pars.put("task_sts", "P");
		pars.put("task_code", taskCode);

		pars.put("user_code", userCode == null ? "system" : userCode);
		this.update("SDP-TASK-006", pars);
		taskService.pauseTask(userCode);
	}

	/**
	 * 删除
	 */
	@Override
	public void doDelete(String taskCode, String userCode) {
		Map<String, String> pars = new HashMap<String, String>(3);
		pars.put("task_sts", "D");
		pars.put("task_code", taskCode);
		pars.put("user_code", userCode == null ? "system" : userCode);
		this.update("SDP-TASK-006", pars);
		taskService.removeTask(taskCode);
	}

	/**
	 * 禁用
	 */
	@Override
	public void doDisable(String taskCode, String userCode) {
		Map<String, String> pars = new HashMap<String, String>(3);
		pars.put("task_sts", "L");
		pars.put("task_code", taskCode);
		pars.put("user_code", userCode == null ? "system" : userCode);
		this.update("SDP-TASK-006", pars);
		taskService.removeTask(taskCode);
	}

	public enum TaskAction {
		/** 启动1次 **/
		ONE("one"), START("start"), PAUSE("pause"), DELETE("delete"), DISABLE("disable");

		private String name;

		private TaskAction(String name) {
			this.name = name;
		}

		/**
		 * 
		 * @param index
		 * @return
		 */
		public static TaskAction getAction(String name) {
			for (TaskAction c : TaskAction.values()) {
				if (c.name.equals(name)) {
					return c;
				}
			}
			throw new PMSException("exp-sdp-task-type-001", name);
		}
	}
}
