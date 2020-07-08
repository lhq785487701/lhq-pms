package com.lhq.pms.plugin.thread;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.lhq.pms.common.bo.CommonBo;
import com.lhq.pms.utils.GlobalUtils;

/**
 * 类功能描述
 * 
 * @author lhq 
 */
@Service("threadPool")
public class PMSThreadPoolExecutor extends ThreadPoolExecutor {

	@Resource(name = "commonBo")
	private CommonBo commonBo;

	private List<PMSThread> lists = new ArrayList<PMSThread>();

	public PMSThreadPoolExecutor() {
		super(0, Integer.MAX_VALUE, 60L, TimeUnit.SECONDS, new SynchronousQueue<Runnable>());
	}

	@Override
	public void execute(Runnable command) {
		this.addThreadDataBase((PMSThread) command);
		super.execute(command);
	}

	@Override
	protected void beforeExecute(Thread t, Runnable r) {
		super.beforeExecute(t, r);
		PMSThread th = (PMSThread) r;
		lists.add(th);
		updateThreadBeginDateDataBase(th);
	}

	@Override
	protected void afterExecute(Runnable r, Throwable t) {
		super.afterExecute(r, t);
		PMSThread th = (PMSThread) r;
		lists.remove(th);
		this.updateThreadEndDateDataBase(th);
	}

	@Override
	protected void terminated() {
		super.terminated();
		lists.clear();
	}

	public PMSThread[] getActives() {
		return (PMSThread[]) lists.toArray(new PMSThread[0]);
	}

	/** 添加线程 **/
	private void addThreadDataBase(PMSThread th) {
		Map<String, Object> map = new HashMap<String, Object>(10);
		map.put("thread_code", th.getCode());
		map.put("thread_title", th.getTitle());
		map.put("thread_name", th.getThreadName());
		map.put("group_name", th.getThreadGroupName());
		map.put("server_ip", GlobalUtils.getServerIp());
		map.put("system_code", GlobalUtils.getSystemCode());
		map.put("thread_sts", th.getState());
		map.put("start_date", null);
		map.put("end_date", null);
		map.put("$user_code", th.getUser());
		this.commonBo.insert("SDP-THREAD-002", map);
	}

	/** 更新线程起始时间 **/
	private void updateThreadBeginDateDataBase(PMSThread th) {
		Map<String, Object> map = new HashMap<String, Object>(1);
		map.put("thread_code", th.getCode());
		map.put("thread_sts", th.getState());
		this.commonBo.insert("SDP-THREAD-004", map);
	}

	/** 更新线程结束时间 **/
	private void updateThreadEndDateDataBase(PMSThread th) {
		Map<String, Object> map = new HashMap<String, Object>(1);
		map.put("thread_code", th.getCode());
		map.put("thread_sts", th.getState());
		this.commonBo.insert("SDP-THREAD-005", map);
	}
}
