package com.lhq.pms.task.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.quartz.CronTrigger;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;

import com.alibaba.druid.util.StringUtils;
import com.lhq.pms.exception.PMSException;
import com.lhq.pms.logging.Log;
import com.lhq.pms.task.ScheduleTaskService;
import com.lhq.pms.task.ScheduleUtils;
import com.lhq.pms.task.vo.PMSTaskBean;

/**
 * 类功能描述
 * 
 * @author lhq
 */
@Service("taskService")
public class ScheduleTaskServiceImpl implements ScheduleTaskService {
	protected final static Log log = Log.get();

	@Resource(name = "scheduler")
	private Scheduler scheduler;

	private static final String Y = "Y", N = "N", P = "P", L = "L";

	private List<PMSTaskBean> tasks = new ArrayList<PMSTaskBean>();

	public List<PMSTaskBean> getTasks() {
		return tasks;
	}

	/**
	 * 添加任务
	 */
	@Override
	public void addTask(PMSTaskBean task) {
		if (task != null) {
			String sts = task.getTaskSts();
			if (N.equalsIgnoreCase(sts) || Y.equalsIgnoreCase(sts) || P.equalsIgnoreCase(sts) || L.equalsIgnoreCase(sts)) {
				this.tasks.add(task);
				if (Y.equalsIgnoreCase(sts)) {
					initTask(task);
				}
			}
		}
	}

	public void init() {
		if (this.tasks != null && this.tasks.size() > 0) {
			for (PMSTaskBean taskBean : tasks) {
				initTask(taskBean);
			}
		}
	}

	protected void initTask(PMSTaskBean taskBean) {
		CronTrigger cronTrigger;
		try {
			cronTrigger = ScheduleUtils.getCronTrigger(scheduler, taskBean.getTaskCode(), taskBean.getTaskGroup());
			if (cronTrigger != null) {
				ScheduleUtils.deleteScheduleJob(scheduler, taskBean.getTaskCode(), taskBean.getTaskGroup());
			}

			ScheduleUtils.createScheduleJob(scheduler, taskBean);
		} catch (Exception e) {
			log.error("1001102", e, taskBean.getTaskCode(), taskBean.getTaskName());
		}
	}

	/**
	 * 判断是否存在任务
	 */
	@Override
	public PMSTaskBean exists(String taskCode) {
		if (StringUtils.isEmpty(taskCode)) {
			throw new PMSException("exp-sdp-task-0001");
		}
		for (PMSTaskBean task : tasks) {
			if (taskCode.equalsIgnoreCase(task.getTaskCode())) {
				return task;
			}
		}
		return null;
	}

	/**
	 * 启动一次
	 */
	@Override
	public boolean startOne(String taskCode) {
		PMSTaskBean b = exists(taskCode);
		if (b == null) {
			throw new PMSException("exp-sdp-task-0002", taskCode);
		} else {
			try {
				ScheduleUtils.runOnce(scheduler, b.getTaskCode(), b.getTaskGroup());
			} catch (SchedulerException e) {
				throw new PMSException("exp-sdp-task-0003", e, b.getTaskCode(), b.getTaskName());
			}
		}
		return true;
	}

	/**
	 * 启动任务
	 */
	@Override
	public boolean startTask(String taskCode) {
		PMSTaskBean b = exists(taskCode);
		if (b == null) {
			throw new PMSException("exp-sdp-task-0004", taskCode);
		} else {
			try {
				ScheduleUtils.resumeJob(scheduler, b.getTaskCode(), b.getTaskGroup());
				if(L.equalsIgnoreCase(b.getTaskSts())) {
					initTask(b);
				}
			} catch (SchedulerException e) {
				log.error("exp-sdp-task-0005", e, b.getTaskCode(), b.getTaskName());
			}
		}
		return true;
	}

	/**
	 * 暂停任务
	 */
	@Override
	public boolean pauseTask(String taskCode) {
		PMSTaskBean b = exists(taskCode);
		if (b == null) {
			throw new PMSException("exp-sdp-task-0006", taskCode);
		} else {
			try {
				ScheduleUtils.pauseJob(scheduler, b.getTaskCode(), b.getTaskGroup());
			} catch (SchedulerException e) {
				throw new PMSException("exp-sdp-task-0007", e, b.getTaskCode(), b.getTaskName());
			}
		}
		return true;
	}

	/**
	 * 移除任务
	 */
	@Override
	public boolean removeTask(String taskCode) {
		PMSTaskBean b = exists(taskCode);
		if (b == null) {
			throw new PMSException("exp-sdp-task-0008", taskCode);
		} else {
			try {
				ScheduleUtils.deleteScheduleJob(scheduler, taskCode, b.getTaskGroup());
				tasks.remove(b);
			} catch (SchedulerException e) {
				throw new PMSException("exp-sdp-task-0009", e, b.getTaskCode(), b.getTaskName());
			}
		}
		return true;
	}
}
