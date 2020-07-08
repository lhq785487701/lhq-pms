package com.lhq.pms.portal.cache;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.lhq.pms.cache.PMSCache;
import com.lhq.pms.cache.PMSCacheManager;
import com.lhq.pms.common.bo.impl.CommonBoImpl;
import com.lhq.pms.data.LoginUser;
import com.lhq.pms.data.PMSContext;
import com.lhq.pms.portal.PortalCacheBo;

/**
 * 从缓存抓取门户
 * 
 * @author lhq
 *
 */
public class PortalCacheBoImpl extends CommonBoImpl implements PortalCacheBo {

	private PMSCache cache;

	private static final String SHOW_WIN = "Y";

	public void initCache() {
		if (cache == null) {
			cache = PMSCacheManager.getCache("portalRoleCache");
		}
	}

	/**
	 * 查询门户缓存
	 */
	@SuppressWarnings("unchecked")
	@Override
	public void queryPortalCache(PMSContext context) {
		initCache();

		LoginUser user = context.getLoginUser();
		List<Map<String, Object>> roles = (List<Map<String, Object>>) user.getAttr(LoginUser.ROLES);
		List<Map<String, Object>> itms = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> result = null;
		if (roles != null) {
			for (Map<String, Object> map : roles) {
				String roleCode = (String) map.get("role_code");
				Map<String, Object> datas = (Map<String, Object>) cache.get(roleCode);
				if (datas == null) {
					continue;
				}
				List<Map<String, Object>> users = (List<Map<String, Object>>) datas.get(user.getUserCode());
				if (users != null) {
					itms.addAll(users);
				}
			}

			result = itms.stream().filter((Map<String, Object> map) -> SHOW_WIN.equalsIgnoreCase((String) map.get("is_show"))).collect(Collectors.toList());

			/**
			 * 按照line_no 升序
			 */
			Collections.sort(result, new Comparator<Map<String, Object>>() {
				/**
				 * 排序，升序
				 */
				@Override
				public int compare(Map<String, Object> o1, Map<String, Object> o2) {
					Object no1 = o1.get("line_no");
					Object no2 = o2.get("line_no");
					if (no1 instanceof BigDecimal) {
						BigDecimal bd1 = (BigDecimal) no1;
						BigDecimal bd2 = (BigDecimal) no2;
						if (bd1.intValue() > bd2.intValue()) {
							return 1;
						}
					} else if ((Integer) no1 > (Integer) no2) {
						return 1;
					}
					return -1;
				}
			});
		}

		context.setResult(result);
	}
}
