package com.lhq.pms.sys.bo.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.lhq.pms.common.bo.impl.CommonBoImpl;
import com.lhq.pms.logging.Log;
import com.lhq.pms.sys.bo.SystemInitBo;
import com.lhq.pms.sys.bo.SystemInitCacheBo;
import com.lhq.pms.sys.vo.SystemNode;
import com.lhq.pms.utils.GlobalUtils;

/**
 * @author lhq 系统初始化实现
 *
 */
public class SystemInitBoImpl extends CommonBoImpl implements SystemInitBo {

	protected final static Log log = Log.get();

	/**
	 * 缓存初始化处理类
	 */
	private List<SystemInitCacheBo> initCaches = new ArrayList<SystemInitCacheBo>(10);

	/**
	 * @return the initCaches
	 */
	public List<SystemInitCacheBo> getInitCaches() {
		return initCaches;
	}

	/**
	 * 系统初始化
	 */
	@Override
	public void init() {
		/** 把系统信息写入节点表 **/
		log.info("初始化系统节点信息.....");
		initSystem();

		/** 初始化系统配置 **/
		log.info("初始化系统参数开始.....");
		initSysConf();
		log.info("初始化系统参数结束.....");

		if (initCaches != null && initCaches.size() > 0) {
			log.info("初始化系统缓存开始.....");
			for (SystemInitCacheBo cache : initCaches) {
				log.info(cache.getTile() + "-初始化开始");
				cache.initCache();
				log.info(cache.getTile() + "-初始化结束");
			}
			log.info("初始化系统缓存结束.....");
		}
	}

	private void initSysConf() {
		List<Map<String, Object>> rs = this.selectList("SDP-SYS-CONF-001");
		if (rs != null && rs.size() > 0) {
			for (Map<String, Object> row : rs) {
				GlobalUtils.registerVariant((String) row.get("conf_code"), (String) row.get("conf_value"));
			}
		}
	}

	private void initSystem() {
		SystemNode node = GlobalUtils.getNode();
		node.setServerIp(GlobalUtils.getServerIp());
		node.setSystemCode(GlobalUtils.getSystemCode());

		this.update("SDP-SYSTEM-NODE-004", node);

		this.insert("SDP-SYSTEM-NODE-002", node);
	}

	/**
	 * 释放
	 */
	@Override
	public void destory() {
		// 关闭服务器
		this.update("SDP-SYSTEM-NODE-003", GlobalUtils.NODE);
	}

	/**
	 * 添加系统初始化
	 */
	@Override
	public synchronized void addSystemInitCacheBo(SystemInitCacheBo initBo) {
		this.initCaches.add(initBo);
	}
}
