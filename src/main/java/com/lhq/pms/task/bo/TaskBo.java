package com.lhq.pms.task.bo;

import com.lhq.pms.data.PMSContext;

/**
 * 类功能描述
 * 
 * @author lhq
 */
public interface TaskBo {
	/**
	 * 执行1次
	 * 
	 * @param context
	 */
	public void doOne(PMSContext context);

	/**
	 * 启动任务
	 * 
	 * @param context
	 */
	public void doStart(PMSContext context);

	/**
	 * 禁用任务
	 * 
	 * @param context
	 */
	public void doDisable(PMSContext context);

	/**
	 * 暂停任务
	 * 
	 * @param context
	 */
	public void doPause(PMSContext context);

	/**
	 * 删除任务
	 * 
	 * @param context
	 */
	public void doDelete(PMSContext context);

	/**
	 * 启用
	 * 
	 * @param taskCode
	 * @param userCode
	 */
	public void doStart(String taskCode, String userCode);

	/**
	 * 暂停
	 * 
	 * @param taskCode
	 * @param userCode
	 */
	public void doPause(String taskCode, String userCode);

	/**
	 * 删除
	 * 
	 * @param taskCode
	 * @param userCode
	 */
	public void doDelete(String taskCode, String userCode);

	/**
	 * 禁用
	 * 
	 * @param taskCode
	 * @param userCode
	 */
	public void doDisable(String taskCode, String userCode);
}
