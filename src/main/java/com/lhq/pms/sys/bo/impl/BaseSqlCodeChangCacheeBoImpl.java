package com.lhq.pms.sys.bo.impl;

import com.lhq.pms.cache.PMSCache;
import com.lhq.pms.cache.PMSCacheManager;
import com.lhq.pms.exception.PMSException;
import com.lhq.pms.sys.bo.SqlCodeChangeActionBo;
import com.lhq.pms.type.StateType;

/**
 * @author lhq
 *
 */
public abstract class BaseSqlCodeChangCacheeBoImpl implements SqlCodeChangeActionBo {
	private String cacheName;

	protected PMSCache cache;

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

	/**
	 * 处理逻辑
	 */
	@Override
	public void doAction(String sqlCode, Object data, StateType type) {
		if (cacheName != null) {
			if (cache == null) {
				cache = PMSCacheManager.getCache(cacheName);
			}
			if (cache == null) {
				throw new PMSException("exp-sdp-cache-001");
			}
		}

		doData(sqlCode, data, type);
	}

	/**
	 * 处理数据
	 * 
	 * @param data
	 * @param type
	 */
	protected void doData(String sqlCode, Object data, StateType type) {
		if (type == StateType.ADD) {
			doAdd(sqlCode, data);
		} else if (type == StateType.MODIFY) {
			doUpdate(sqlCode, data);
		} else if (type == StateType.DELETE) {
			doDelete(sqlCode, data);
		}
	}

	/**
	 * 新增数据
	 * 
	 * @param sqlCode
	 * @param data
	 */
	abstract protected void doAdd(String sqlCode, Object data);

	/**
	 * 修改数据
	 * 
	 * @param sqlCode
	 * @param data
	 */
	abstract protected void doUpdate(String sqlCode, Object data);

	/**
	 * 删除数据
	 * 
	 * @param sqlCode
	 * @param data
	 */
	abstract protected void doDelete(String sqlCode, Object data);
}
