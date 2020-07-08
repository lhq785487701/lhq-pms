package com.lhq.pms.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.lhq.pms.cache.PMSCacheManager;
import com.lhq.pms.sys.bo.SystemInitBo;
import com.lhq.pms.utils.SpringUtils;

/**
 * @author lhq 系统初始化
 *
 */
public class PMSInit implements ServletContextListener {
	/**
	 * 销毁
	 */
	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		SystemInitBo init = (SystemInitBo) SpringUtils.getBean("systemInitBo");
		init.destory();
	}

	/**
	 * 初始化
	 */
	@Override
	public void contextInitialized(ServletContextEvent arg0) {
		/** 初始化缓存 **/
		PMSCacheManager.initCacheManager();

		SystemInitBo init = (SystemInitBo) SpringUtils.getBean("systemInitBo");
		init.init();
	}
}
