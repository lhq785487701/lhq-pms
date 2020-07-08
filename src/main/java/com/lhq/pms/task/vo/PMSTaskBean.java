package com.lhq.pms.task.vo;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;

import com.lhq.pms.common.bo.CommonBo;
import com.lhq.pms.task.ScheduleTaskService;
import com.lhq.pms.utils.GlobalUtils;

/**
 * 类功能描述
 * 
 * @author lhq
 */
public class PMSTaskBean implements InitializingBean, DisposableBean {
	@Resource(name = "taskService")
	private ScheduleTaskService taskService;

	@Resource(name = "commonBo")
	private CommonBo commonBo;

	/** 任务编码 **/
	private String taskCode;

	/** 任务名称 **/
	private String taskName;

	/** 任务分组 **/
	private String taskGroup;

	/** 任务状态 N初始 L禁用 Y启用 D删除 P暂停 **/
	private String taskSts = "Y";

	/** N 未运行，Y运行中，C运行完成，E运行异常 **/
	private String runSts = "N";

	/** 任务运行时间表达式 **/
	private String cronExp;

	/** 任务描述 **/
	private String taskRemark;

	/** S sql,B java bo,U url地址 **/
	private String doType = "B";

	/** 内容 **/
	private String doContent = "";

	/** 处理开始时间 **/
	private Date beginDate;

	/** 系统编码 **/
	private String systemCode = "";

	/** 服务地址 **/
	private String serverIp = "";
	/** 参数 **/
	private String doParam = "";

	/**
	 * @return the doParam
	 */
	public String getDoParam() {
		return doParam;
	}

	/**
	 * @param doParam
	 *            the doParam to set
	 */
	public void setDoParam(String doParam) {
		this.doParam = doParam;
	}

	/**
	 * @return the serverIp
	 */
	public String getServerIp() {
		return serverIp;
	}

	/**
	 * @param serverIp
	 *            the serverIp to set
	 */
	public void setServerIp(String serverIp) {
		this.serverIp = serverIp;
	}

	/**
	 * @return the systemCode
	 */
	public String getSystemCode() {
		return systemCode;
	}

	/**
	 * @param systemCode
	 *            the systemCode to set
	 */
	public void setSystemCode(String systemCode) {
		this.systemCode = systemCode;
	}

	public Date getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(Date beginDate) {
		this.beginDate = beginDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public void setCronExp(String cronExp) {
		this.cronExp = cronExp;
	}

	/** 处理结束时间 **/
	private Date endDate;

	private String title;

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getTaskCode() {
		return taskCode;
	}

	public void setTaskCode(String taskCode) {
		this.taskCode = taskCode;
	}

	public String getTaskName() {
		return taskName;
	}

	public void setTaskName(String jobName) {
		this.taskName = jobName;
	}

	public String getTaskGroup() {
		return taskGroup;
	}

	public void setTaskGroup(String taskGroup) {
		this.taskGroup = taskGroup;
	}

	/**
	 * @return the taskService
	 */
	public ScheduleTaskService getTaskService() {
		return taskService;
	}

	/**
	 * @param taskService
	 *            the taskService to set
	 */
	public void setTaskService(ScheduleTaskService taskService) {
		this.taskService = taskService;
	}

	/**
	 * @return the taskSts
	 */
	public String getTaskSts() {
		return taskSts;
	}

	/**
	 * @param taskSts
	 *            the taskSts to set
	 */
	public void setTaskSts(String taskSts) {
		this.taskSts = taskSts;
	}

	/**
	 * @return the runSts
	 */
	public String getRunSts() {
		return runSts;
	}

	/**
	 * @param runSts
	 *            the runSts to set
	 */
	public void setRunSts(String runSts) {
		this.runSts = runSts;
	}

	/**
	 * @return the taskRemark
	 */
	public String getTaskRemark() {
		return taskRemark;
	}

	/**
	 * @param taskRemark
	 *            the taskRemark to set
	 */
	public void setTaskRemark(String taskRemark) {
		this.taskRemark = taskRemark;
	}

	/**
	 * @return the doType
	 */
	public String getDoType() {
		return doType;
	}

	/**
	 * @param doType
	 *            the doType to set
	 */
	public void setDoType(String doType) {
		this.doType = doType;
	}

	/**
	 * @return the doContent
	 */
	public String getDoContent() {
		return doContent;
	}

	/**
	 * @param doContent
	 *            the doContent to set
	 */
	public void setDoContent(String doContent) {
		this.doContent = doContent;
	}

	public String getCronExp() {
		return cronExp;
	}

	public void fillData(Map<String, Object> map) {
		map.put("taskCode", this.taskCode);
		map.put("taskName", this.taskName);
		map.put("server", this.serverIp);
		map.put("system", this.systemCode);
		map.put("beginDate", this.beginDate);
		map.put("endDate", this.endDate);
		map.put("doParam", this.doParam);
	}

	@Override
	public void destroy() throws Exception {
		this.taskService = null;
		this.commonBo = null;
	}

	private static final String D = "D";

	@Override
	public void afterPropertiesSet() throws Exception {
		Map<String, Object> data = commonBo.selectOne("SDP-TASK-002", this.taskCode);
		if (data != null && data.size() > 0) {
			this.setTaskSts((String) data.get("task_sts"));
			this.setCronExp((String) data.get("cron_exp"));
			this.setDoType((String) data.get("do_type"));
			this.setDoContent((String) data.get("do_content"));
			this.setTaskGroup((String) data.get("task_group"));
			this.setTaskName((String) data.get("task_name"));
			this.setDoParam((String) data.get("do_param"));
			this.setServerIp(GlobalUtils.getServerIp());
			this.setSystemCode(GlobalUtils.getSystemCode());

			this.updateAddressDataBase();
		} else {
			this.addDataBase();
		}
		if (D.equalsIgnoreCase(this.taskSts)) {
			return;
		}
		this.taskService.addTask(this);
	}

	/** 添加到数据库 **/
	private void addDataBase() {
		Map<String, String> map = new HashMap<String, String>(10);
		map.put("task_code", this.taskCode);
		map.put("task_name", this.taskName);
		map.put("task_group", this.taskGroup);
		map.put("task_remark", this.taskRemark);
		map.put("task_sts", this.taskSts);
		map.put("cron_exp", this.cronExp);
		map.put("do_type", this.doType);
		map.put("do_content", this.doContent);
		map.put("do_param", this.doParam);
		if (this.systemCode == null || this.systemCode.length() <= 0) {
			this.systemCode = GlobalUtils.getSystemCode();
		}
		map.put("system_code", this.systemCode);

		map.put("run_sts", this.runSts);

		map.put("user_code", "system");
		commonBo.insert("SDP-TASK-003", map);
	}

	/** 更新运行状态 **/
	public void updateRunStsDataBase() {
		Map<String, String> map = new HashMap<String, String>(3);
		map.put("run_sts", this.runSts);
		map.put("task_code", this.taskCode);
		map.put("user_code", "system");
		commonBo.update("SDP-TASK-005", map);
	}

	/** 更新服务地址 **/
	public void updateAddressDataBase() {
		Map<String, String> map = new HashMap<String, String>(3);
		map.put("server_ip", this.serverIp);
		map.put("system_code", this.systemCode);
		map.put("task_code", this.taskCode);
		map.put("user_code", "system");
		commonBo.update("SDP-TASK-007", map);
	}
}
