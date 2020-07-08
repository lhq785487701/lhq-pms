package com.lhq.pms.sys.bo.impl;

import java.util.List;
import java.util.Map;

import com.lhq.pms.utils.GlobalUtils;

/**
 * 系统配置参数变化
 * 
 * @author lhq
 *
 */
public class SysConfChangBoImpl extends BaseSqlCodeChangCacheeBoImpl {

	/**
	 * 新增
	 * 
	 * @param data
	 */
	@Override
	protected void doAdd(String sqlCode, Object data) {
		doUpdate(sqlCode, data);
	}

	/**
	 * 修改
	 * 
	 * @param data
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	protected void doUpdate(String sqlCode, Object data) {
		if (data instanceof List) {
			List<Map> rs = (List<Map>) data;
			for (Map m : rs) {
				GlobalUtils.registerVariant((String) m.get("conf_code"), (String) m.get("conf_value"));
			}
		} else if (data instanceof Map) {
			Map m = (Map) data;
			GlobalUtils.registerVariant((String) m.get("conf_code"), (String) m.get("conf_value"));
		}
	}

	/**
	 * 删除
	 * 
	 * @param data
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	protected void doDelete(String sqlCode, Object data) {
		if (data instanceof List) {
			List<Map> rs = (List<Map>) data;
			for (Map m : rs) {
				GlobalUtils.removeVariant((String) m.get("conf_code"));
			}
		} else if (data instanceof Map) {
			Map m = (Map) data;
			GlobalUtils.removeVariant((String) m.get("conf_code"));
		}
	}
}
