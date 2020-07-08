package com.lhq.pms.task;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.lhq.pms.logging.Log;
import com.lhq.pms.logging.bo.LogBo;
import com.lhq.pms.task.bo.TaskExecuteBo;
import com.lhq.pms.task.vo.PMSTaskBean;
import com.lhq.pms.utils.DateUtils;
import com.lhq.pms.utils.ExceptionUtils;
import com.lhq.pms.utils.SpringUtils;

/**
 * 类功能描述
 * 
 * @author lhq
 */
public class ScheduleTask implements Job {
	protected final static Log log = Log.get();

	private boolean statu = false;
	private static final String S = "S", B = "B", U = "U";

	private LogBo taskLogBo;
	private TaskExecuteBo taskSQLBo;
	private TaskExecuteBo taskURLBo;

	public ScheduleTask() {
		this.taskLogBo = (LogBo) SpringUtils.getBean("taskLogBo");
		this.taskSQLBo = (TaskExecuteBo) SpringUtils.getBean("taskSQLBo");
		this.taskURLBo = (TaskExecuteBo) SpringUtils.getBean("taskURLBo");
	}

	/**
	 * 执行
	 */
	@Override
	public void execute(JobExecutionContext context) throws JobExecutionException {
		if (statu) {
			return;
		}
		JobDataMap mergedJobDataMap = context.getMergedJobDataMap();
		PMSTaskBean dataBean = (PMSTaskBean) mergedJobDataMap.get("taskParam");
		dataBean.setRunSts("Y");
		dataBean.setBeginDate(DateUtils.currTimestamp());

		Map<String, Object> logData = new HashMap<String, Object>(15);
		logData.put("time", "");
		dataBean.fillData(logData);

		try {
			dataBean.updateRunStsDataBase();
		} catch (Exception e) {
			log.error("{0}调度任务更新数据失败", e, dataBean.getTaskCode() + ":" + dataBean.getTaskName());
		}

		taskLogBo.doLog(logData);

		boolean isError = false;
		try {
			TaskExecuteBo taskBo = null;
			if (S.equalsIgnoreCase(dataBean.getDoType())) {
				taskBo = this.taskSQLBo;
			} else if (B.equalsIgnoreCase(dataBean.getDoType())) {
				taskBo = (TaskExecuteBo) SpringUtils.getBean(dataBean.getDoContent());
			} else if (U.equalsIgnoreCase(dataBean.getDoType())) {
				taskBo = this.taskURLBo;
			}
			if (taskBo != null) {
				taskBo.execute(dataBean);
			}
		} catch (Exception e) {
			logData.put("message", ExceptionUtils.getException("执行失败", e).toString());
			isError = true;
		} finally {
			statu = false;
			dataBean.setRunSts(isError ? "E" : "C");
			dataBean.setEndDate(DateUtils.currTimestamp());
			logData.put("endDate", dataBean.getEndDate());
			long t = dataBean.getEndDate().getTime() - dataBean.getBeginDate().getTime();
			BigDecimal bd = new BigDecimal(t);
			bd = bd.divide(new BigDecimal(1000));
			bd = bd.setScale(2, BigDecimal.ROUND_UP);
			logData.put("time", "耗时:" + bd.toString() + "秒");

			try {
				dataBean.updateRunStsDataBase();
			} catch (Exception e) {
				log.error("{0}调度任务更新数据失败", e, dataBean.getTaskCode() + ":" + dataBean.getTaskName());
			}

			taskLogBo.doLog(logData);
		}
	}
}
