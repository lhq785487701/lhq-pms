package com.lhq.pms.cache.bo.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.lhq.pms.cache.PMSCache;
import com.lhq.pms.cache.PMSCacheManager;
import com.lhq.pms.cache.bo.DicCacheBo;
import com.lhq.pms.common.bo.impl.CommonBoImpl;
import com.lhq.pms.data.PMSContext;
import com.lhq.pms.exception.PMSException;

/**
 * 从缓存抓取数据字典
 * 
 * @author lhq
 *
 */
public class DicCacheBoImpl extends CommonBoImpl implements DicCacheBo {

	private PMSCache cache;

	public void initCache() {
		if (cache == null) {
			cache = PMSCacheManager.getDicCache();
		}
	}

	/**
	 * 从缓存查询字典数据
	 * 
	 * @param context
	 */
	@SuppressWarnings("unchecked")
	@Override
	public void queryDicCache(PMSContext context) {
		initCache();

		List<String> dicCodes = (List<String>) context.getParam("dic_code");
		if (dicCodes == null || dicCodes.size() <= 0) {
			throw new PMSException("exp-sdp-dic-001");
		}
		List<Map<String, Object>> datas = new ArrayList<Map<String, Object>>(10);
		for (String dicCode : dicCodes) {
			Map<String, Object> map = new HashMap<String, Object>(2);
			map.put("dic_code", dicCode);
			List<Map<String, String>> itms = (List<Map<String, String>>) cache.get(dicCode);
			map.put("items", itms);
			datas.add(map);
		}
		context.setResult(datas);
	}

	/**
	 * 从缓存查询单个字典数据
	 * 
	 * @param dicCode
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<Map<String, String>> getDicCache(String dicCode) {
		initCache();

		List<Map<String, String>> itms = (List<Map<String, String>>) cache.get(dicCode);
		return itms;
	}
}
