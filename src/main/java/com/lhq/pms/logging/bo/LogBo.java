package com.lhq.pms.logging.bo;

import java.util.Map;

import com.lhq.pms.data.PMSContext;

/**
 * 日志处理
 * 
 * @author lhq 
 */
public interface LogBo {
	/**
	 * 写出日志
	 * 
	 * @param data
	 */
	public void doLog(Map<String, Object> data);

	/**
	 * 查询elasticsearch数据
	 * 
	 * @param context
	 */
	public void queryLog(PMSContext context);

}
