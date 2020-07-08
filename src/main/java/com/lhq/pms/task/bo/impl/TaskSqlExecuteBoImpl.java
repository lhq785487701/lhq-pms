package com.lhq.pms.task.bo.impl;

import com.lhq.pms.common.bo.impl.CommonBoImpl;
import com.lhq.pms.task.bo.TaskExecuteBo;
import com.lhq.pms.task.vo.PMSTaskBean;

/**
 * sql调度任务执行
 * 
 * @author lhq
 *
 */
public class TaskSqlExecuteBoImpl extends CommonBoImpl implements TaskExecuteBo {

	/**
	 * 执行任务
	 */
	@Override
	public void execute(PMSTaskBean bean) {
		this.update(bean.getDoContent());
	}
}
