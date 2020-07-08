package com.lhq.pms.sys.bo.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import com.lhq.pms.cache.PMSCache;
import com.lhq.pms.cache.PMSCacheManager;
import com.lhq.pms.common.bo.CommonBo;
import com.lhq.pms.exception.PMSException;
import com.lhq.pms.sys.bo.SystemInitCacheBo;


/**
 * 缓存初始化基本类
 * 
 * @author lhq
 *
 */
public abstract class BaseSystemInitBoImpl implements SystemInitCacheBo {

	@Resource(name = "commonBo")
	protected CommonBo commonBo;
	protected String cacheName;
	protected String sqlCode;

	/**
	 * @return the sqlCode
	 */
	public String getSqlCode() {
		return sqlCode;
	}

	/**
	 * @param sqlCode
	 *            the sqlCode to set
	 */
	public void setSqlCode(String sqlCode) {
		this.sqlCode = sqlCode;
	}

	/**
	 * @return the cacheName
	 */
	public String getCacheName() {
		return cacheName;
	}

	/**
	 * @param cacheName
	 *            the cacheName to set
	 */
	public void setCacheName(String cacheName) {
		this.cacheName = cacheName;
	}

	protected PMSCache cache;

	/**
	 * 初始化缓存
	 */
	@Override
	public void initCache() {
		cache = PMSCacheManager.getCache(cacheName);
		if (cache == null) {
			throw new PMSException("exp-sdp-cache-001", cacheName);
		}
		List<Map<String, Object>> datas = this.commonBo.selectList(this.sqlCode);
		doCache(datas);
	}

	/**
	 * 处理缓存
	 * 
	 * @param rows
	 *            数据
	 */
	abstract public void doCache(List<Map<String, Object>> rows);

}
