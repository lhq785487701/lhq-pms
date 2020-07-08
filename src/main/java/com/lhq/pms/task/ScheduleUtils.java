package com.lhq.pms.task;

import org.quartz.CronScheduleBuilder;
import org.quartz.CronTrigger;
import org.quartz.Job;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.TriggerBuilder;
import org.quartz.TriggerKey;

import com.lhq.pms.task.vo.PMSTaskBean;

/**
 * 类功能描述
 * 
 * @author lhq
 */
public class ScheduleUtils {
	/**
	 * 获取触发器key
	 * 
	 * @param taskName
	 * @param taskGroup
	 * @return
	 */
	public static TriggerKey getTriggerKey(String taskName, String taskGroup) {
		return TriggerKey.triggerKey(taskName, taskGroup);
	}

	/**
	 * 获取表达式触发器
	 * 
	 * @param scheduler
	 *            the scheduler
	 * @param taskName
	 *            the job name
	 * @param taskGroup
	 *            the job group
	 * @return cron trigger
	 * @throws SchedulerException
	 */
	public static CronTrigger getCronTrigger(Scheduler scheduler, String taskName, String taskGroup) throws SchedulerException {
		TriggerKey triggerKey = TriggerKey.triggerKey(taskName, taskGroup);
		return (CronTrigger) scheduler.getTrigger(triggerKey);
	}

	/**
	 * 创建任务
	 * 
	 * @param scheduler
	 *            the scheduler
	 * @param taskBean
	 *            the schedule job
	 * @throws SchedulerException
	 */
	public static void createScheduleJob(Scheduler scheduler, PMSTaskBean taskBean) throws SchedulerException {
		createScheduleJob(scheduler, taskBean.getTaskCode(), taskBean.getTaskGroup(), taskBean.getCronExp(), taskBean);
	}

	/**
	 * 创建定时任务
	 * 
	 * @param scheduler
	 * @param taskName
	 * @param jobGroup
	 * @param cronExpression
	 * @param isSync
	 * @param param
	 * @param sch_classname
	 * @param sch_classnamesync
	 * @throws SchedulerException
	 */
	public static void createScheduleJob(Scheduler scheduler, String taskName, String taskGroup, String cronExpression, PMSTaskBean taskBean) throws SchedulerException {

		// 构建job信息
		JobDetail jobDetail = JobBuilder.newJob((Class<? extends Job>) ScheduleTask.class).withIdentity(taskName, taskGroup).build();

		// 放入参数，运行时的方法可以获取
		jobDetail.getJobDataMap().put("taskParam", taskBean);

		// 表达式调度构建器
		CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(cronExpression);

		// 按新的cronExpression表达式构建一个新的trigger
		CronTrigger trigger = TriggerBuilder.newTrigger().withIdentity(taskName, taskGroup).withSchedule(scheduleBuilder).build();

		scheduler.scheduleJob(jobDetail, trigger);
	}

	/**
	 * 运行一次任务
	 * 
	 * @param scheduler
	 * @param taskName
	 * @param taskGroup
	 * @throws SchedulerException
	 */
	public static void runOnce(Scheduler scheduler, String taskName, String taskGroup) throws SchedulerException {
		JobKey jobKey = JobKey.jobKey(taskName, taskGroup);
		scheduler.triggerJob(jobKey);
	}

	/**
	 * 暂停任务
	 * 
	 * @param scheduler
	 * @param taskName
	 * @param taskGroup
	 * @throws SchedulerException
	 */
	public static void pauseJob(Scheduler scheduler, String taskName, String taskGroup) throws SchedulerException {
		JobKey jobKey = JobKey.jobKey(taskName, taskGroup);
		scheduler.pauseJob(jobKey);
	}

	/**
	 * 恢复任务
	 * 
	 * @param scheduler
	 * @param taskName
	 * @param taskGroup
	 * @throws SchedulerException
	 */
	public static void resumeJob(Scheduler scheduler, String taskName, String taskGroup) throws SchedulerException {
		JobKey jobKey = JobKey.jobKey(taskName, taskGroup);
		scheduler.resumeJob(jobKey);
	}

	/**
	 * 获取jobKey
	 * 
	 * @param taskName
	 *            the job name
	 * @param taskGroup
	 *            the job group
	 * @return the job key
	 */
	public static JobKey getJobKey(String taskName, String taskGroup) {
		return JobKey.jobKey(taskName, taskGroup);
	}

	/**
	 * 更新定时任务
	 * 
	 * @param scheduler
	 *            the scheduler
	 * @param scheduleJob
	 *            the schedule job
	 * @throws SchedulerException
	 */
	public static void updateScheduleJob(Scheduler scheduler, PMSTaskBean taskBean) throws SchedulerException {
		updateScheduleJob(scheduler, taskBean.getTaskName(), taskBean.getTaskGroup(), taskBean.getCronExp(), taskBean);
	}

	/**
	 * 更新定时任务
	 * 
	 * @param scheduler
	 *            the scheduler
	 * @param taskName
	 *            the job name
	 * @param taskGroup
	 *            the job group
	 * @param cronExpression
	 *            the cron expression
	 * @param param
	 *            the param
	 * @throws SchedulerException
	 */
	public static void updateScheduleJob(Scheduler scheduler, String taskName, String taskGroup, String cronExpression, PMSTaskBean taskBean) throws SchedulerException {
		TriggerKey triggerKey = ScheduleUtils.getTriggerKey(taskName, taskGroup);

		// 表达式调度构建器
		CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(cronExpression);

		CronTrigger trigger = (CronTrigger) scheduler.getTrigger(triggerKey);

		// 按新的cronExpression表达式重新构建trigger
		trigger = trigger.getTriggerBuilder().withIdentity(triggerKey).withSchedule(scheduleBuilder).build();

		// 按新的trigger重新设置job执行
		scheduler.rescheduleJob(triggerKey, trigger);
	}

	/**
	 * 删除定时任务
	 * 
	 * @param scheduler
	 * @param jobName
	 * @param jobGroup
	 * @throws SchedulerException
	 */
	public static void deleteScheduleJob(Scheduler scheduler, String jobName, String jobGroup) throws SchedulerException {
		scheduler.deleteJob(getJobKey(jobName, jobGroup));
	}
}
