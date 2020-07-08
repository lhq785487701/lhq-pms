package com.lhq.pms.task;

import com.lhq.pms.task.vo.PMSTaskBean;

/**
 * 调度任务服务接口
 * 
 * @author lhq
 */
public interface ScheduleTaskService {

	/**
	 * 添加任务
	 * 
	 * @param task
	 */
	public void addTask(PMSTaskBean task);

	/**
	 * 启动任务1次
	 * 
	 * @param taskCode
	 * @return
	 */
	public boolean startOne(String taskCode);

	/**
	 * 启动任务
	 * 
	 * @param taskCode
	 * @return
	 */
	public boolean startTask(String taskCode);

	/**
	 * 暂停任务
	 * 
	 * @param taskCode
	 * @return
	 */
	public boolean pauseTask(String taskCode);

	/**
	 * 删除任务
	 * 
	 * @param taskCode
	 * @return
	 */
	public boolean removeTask(String taskCode);

	/**
	 * 判断是否存在任务
	 * 
	 * @param taskCode
	 * @return
	 */
	public PMSTaskBean exists(String taskCode);
}
