package com.lhq.pms.task.message;

import java.util.Map;

import javax.annotation.Resource;

import com.lhq.pms.logging.Log;
import com.lhq.pms.message.PMSTopic;
import com.lhq.pms.message.accept.BaseMessageDelegateListener;
import com.lhq.pms.task.ScheduleTaskService;
import com.lhq.pms.task.bo.TaskBo;
import com.lhq.pms.task.bo.impl.TaskBoImpl.TaskAction;

/**
 * 类功能描述
 * 
 * @author lhq 
 */
public class TaskMessageDelegateListener extends BaseMessageDelegateListener {
	protected final static Log log = Log.get();

	@Resource(name = "taskBo")
	private TaskBo taskBo;

	@Resource(name = "taskService")
	private ScheduleTaskService taskService;

	/**
	 * 接受消息处理
	 */
	@SuppressWarnings("unchecked")
	@Override
	protected void acceptMessage(PMSTopic topic) {
		String taskCode = topic.getType();
		if (taskService.exists(taskCode) != null) {
			Map<String, String> data = (Map<String, String>) topic.getData();
			TaskAction action = TaskAction.getAction(data.get("action"));
			String userCode = data.get("userCode");
			if (action == TaskAction.ONE) {
				taskService.startOne(taskCode);
			} else if (action == TaskAction.START) {
				taskBo.doStart(taskCode, userCode);
			} else if (action == TaskAction.PAUSE) {
				taskBo.doPause(taskCode, userCode);
			} else if (action == TaskAction.DISABLE) {
				taskBo.doDisable(taskCode, userCode);
			} else if (action == TaskAction.DELETE) {
				taskBo.doDelete(taskCode, userCode);
			}
		}
	}
}
