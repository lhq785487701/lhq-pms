package com.lhq.pms.plugin.thread;

import java.util.Date;

import com.lhq.pms.utils.DateUtils;
import com.lhq.pms.utils.UuidUtils;

/**
 * 类功能描述
 * 
 * @author lhq 
 */
public class PMSThread extends Thread {
	/** 线程编码 **/
	private String code = UuidUtils.getUuid();

	public String getCode() {
		return code;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Date getCreateDate() {
		return createDate;
	}

	private String user;

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public Thread getThread() {
		return thread;
	}

	public void setThread(Thread thread) {
		this.thread = thread;
	}

	public String getThreadName() {
		return PMSThread.currentThread().getName();
	}

	public String getThreadGroupName() {
		return PMSThread.currentThread().getThreadGroup().getName();
	}

	/** 线程标题 **/
	private String title;
	/** 创建时间 **/
	private Date createDate = DateUtils.currTimestamp();
	private Thread thread;
}
