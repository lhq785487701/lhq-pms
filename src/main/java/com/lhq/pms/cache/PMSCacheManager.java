package com.lhq.pms.cache;

import java.util.ArrayList;
import java.util.List;

import com.lhq.pms.utils.SpringUtils;

import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;

/**
 * SDPCacheManager 缓存管理器
 * 
 * @author lhq 
 */
public class PMSCacheManager {

	private static CacheManager sdpCacheManager;

	/**
	 * @return the sDPCacheManager
	 */
	public static CacheManager getSDPCacheManager() {
		return sdpCacheManager;
	}

	public static void initCacheManager() {
		if (sdpCacheManager == null) {
			sdpCacheManager = (CacheManager) SpringUtils.getBean("cacheManager");
		}
	}

	/**
	 * 菜单缓存
	 */
	private static PMSCache menuCache = null;

	public static PMSCache getMenuCache() {
		if (menuCache == null) {
			menuCache = new PMSCache(sdpCacheManager.getCache("menuCache"));
		}
		return menuCache;
	}

	/**
	 * 数据字典缓存
	 */
	private static PMSCache dicCache = null;

	public static PMSCache getDicCache() {
		if (dicCache == null) {
			dicCache = new PMSCache(sdpCacheManager.getCache("dicCache"));
		}
		return dicCache;
	}

	public static List<Cache> getCaches() {
		List<Cache> rs = new ArrayList<Cache>();
		if (sdpCacheManager == null) {
			return null;
		}
		String[] names = sdpCacheManager.getCacheNames();
		for (int i = 0, j = names.length; i < j; i++) {
			rs.add(sdpCacheManager.getCache(names[i]));
		}
		return rs;
	}

	public static PMSCache getCache(String name) {
		return new PMSCache(sdpCacheManager.getCache(name));
	}
}
