package com.lhq.pms.cache.bo;

import java.util.List;
import java.util.Map;

import com.lhq.pms.data.PMSContext;

/**
 * @author lhq
 *
 */
public interface DicCacheBo {
	/**
	 * 查询数据字典数据
	 * 
	 * @param context
	 */
	public void queryDicCache(PMSContext context);

	/**
	 * 获取数据字典
	 * 
	 * @param dicCode
	 * @return
	 */
	public List<Map<String, String>> getDicCache(String dicCode);
}
