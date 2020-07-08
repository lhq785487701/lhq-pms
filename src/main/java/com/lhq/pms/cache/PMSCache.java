package com.lhq.pms.cache;

import java.util.List;

import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;

/**
 * PMSCache
 * 
 * @包名 com.lhq.pms.cache;
 * @author lhq
 */
public class PMSCache {
	private Cache cache = null;

	public PMSCache(Cache cache) {
		this.cache = cache;
	}

	public Element getElement(String key) {
		return this.cache.get(key);
	}

	/**
	 * 获取缓存值
	 * 
	 * @param key
	 * @return
	 */
	public Object get(String key) {
		Element ele = getElement(key);
		if (ele == null) {
			return null;
		}
		return ele.getObjectValue();
	}

	/**
	 * 添加缓存数据
	 * 
	 * @param key
	 * @param val
	 */
	public void put(String key, Object val) {
		Element ele = new Element(key, val);
		this.cache.put(ele);
	}

	/**
	 * 更新缓存数据
	 * 
	 * @param key
	 * @param val
	 */
	public void update(String key, Object val) {
		Element ele = getElement(key);
		if (ele == null) {
			put(key, val);
		} else {
			Element tmp = new Element(key, val);
			this.cache.replace(ele, tmp);
		}
	}

	/**
	 * 删除缓存数据
	 * 
	 * @param key
	 */
	public void remove(String key) {
		this.cache.remove(key);
	}

	/**
	 * 是否包含缓存数据
	 * 
	 * @param key
	 * @return
	 */
	public boolean containsKey(String key) {
		return this.cache.isKeyInCache(key);
	}

	/**
	 * 获取存储键值
	 * 
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public List getKeys() {
		return cache.getKeys();
	}
}
