package com.lhq.pms.task.bo;

import com.lhq.pms.task.vo.PMSTaskBean;

/**
 * 任务执行接口
 * 
 * @author lhq
 */
public interface TaskExecuteBo {
	/**
	 * 执行方案
	 * 
	 * @param bean
	 *            任务配置信息
	 */
	public void execute(PMSTaskBean bean);
}
