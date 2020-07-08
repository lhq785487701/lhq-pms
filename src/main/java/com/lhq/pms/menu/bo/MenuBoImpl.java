package com.lhq.pms.menu.bo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.util.StringUtils;

import com.lhq.pms.common.bo.MenuBo;
import com.lhq.pms.common.bo.impl.CommonBoImpl;
import com.lhq.pms.data.PMSContext;
import com.lhq.pms.logging.Log;
import com.lhq.pms.utils.SpringUtils;

/**
 * @author lhq
 *
 */
public class MenuBoImpl extends CommonBoImpl implements MenuBo {
	protected final static Log log = Log.get();

	/** 菜单编码 **/
	public static final String MENU_CODE = "menu_code";
	/** 菜单父编码 **/
	public static final String MENU_PCODE = "menu_pcode";
	/** 子菜单集合属性名称 **/
	public static final String CHILD_NAME = "$chinldrens";

	/**
	 * 查询菜单
	 */
	@SuppressWarnings("unchecked")
	@Override
	public void queryUserMenus(PMSContext context) {
		Map<String, String> pars = new HashMap<String, String>(5);
		pars.put("$user_code", context.getLoginUser().getUserCode());
		pars.put("menu_system", (String) context.getParam("menu_system"));
		List<Map<String, Object>> menus = this.selectList("SDP-MENU-002", pars);

		if (menus == null || menus.isEmpty()) {
			context.setResultCode(false, SpringUtils.getMessage("exp-sdp-login-0005", context.getRequest().getLocale()));
		} else {
			Map<String, Map<String, Object>> trees = new HashMap<String, Map<String, Object>>(20);
			List<Map<String, Object>> lists = new ArrayList<Map<String, Object>>(20);

			for (int i = 0, j = menus.size(); i < j; i++) {
				Map<String, Object> menu = menus.get(i);
				String menuCode = (String) menu.get(MENU_CODE);
				String menuPCode = (String) menu.get(MENU_PCODE);

				trees.put(menuCode, menu);
				if (StringUtils.isEmpty(menuPCode)) {
					lists.add(menu);
					continue;
				} else {
					Map<String, Object> pmenu = trees.get(menuPCode);
					if (pmenu == null) {
						log.error("[{0}]菜单缺少父菜单[{1}]，配置有错误", menuCode, menuPCode);
					} else {
						List<Map<String, Object>> childs = (List<Map<String, Object>>) pmenu.get(CHILD_NAME);
						if (childs == null) {
							childs = new ArrayList<Map<String, Object>>();
							pmenu.put(CHILD_NAME, childs);
						}
						childs.add(menu);
					}
				}
			}
			context.setResult(lists);
		}
	}
}
