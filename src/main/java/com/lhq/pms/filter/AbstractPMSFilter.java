package com.lhq.pms.filter;

import javax.servlet.Filter;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;

/**
 * 开发平台基础过滤器
 * 
 * @author lhq 
 */
public abstract class AbstractPMSFilter implements Filter {

	/**
	 * 过滤器配置
	 */
	protected FilterConfig conf;

	/**
	 * 销毁
	 */
	@Override
	public void destroy() {
		this.conf = null;
	}

	/**
	 * 获取初始化
	 */
	@Override
	public void init(FilterConfig conf) throws ServletException {
		this.conf = conf;
	}

}
