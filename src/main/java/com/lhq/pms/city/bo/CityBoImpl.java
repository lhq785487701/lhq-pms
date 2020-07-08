package com.lhq.pms.city.bo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.lhq.pms.common.bo.CityBo;
import com.lhq.pms.common.bo.impl.CommonBoImpl;
import com.lhq.pms.data.PMSContext;
import com.lhq.pms.logging.Log;

public class CityBoImpl extends CommonBoImpl implements CityBo {

	protected final static Log log = Log.get();
	// 菜单编码
	public static final String MENU_CODE = "cityID";
	// 菜单父编码
	public static final String MENU_PCODE = "fatherID";
	// 子菜单集合属性名称
	public static final String CHILD_NAME = "$childrens";
	
	@SuppressWarnings("unchecked")
	@Override
	public void queryCity(PMSContext context) {
		List<Map<String, Object>> cityMenus = this.selectList("PMS-CITY-001", context.getLoginUser().getUserCode());
		List<Map<String, Object>> menusTree = new ArrayList<Map<String, Object>>();
		Map<String, Map<String, Object>> trees = new HashMap<String, Map<String, Object>>();
		
		for(int i = 0; i < cityMenus.size(); i++) {
			Map<String, Object> menu = cityMenus.get(i);
			Long menuCode = (Long) menu.get(MENU_CODE);
			Long menuPCode = (Long) menu.get(MENU_PCODE);
			
			trees.put(menuCode.toString(), menu);
			if(menuPCode == -1) {
				menusTree.add(menu);
			} else {
				//获得父节点
				Map<String, Object> pmenu = trees.get(menuPCode.toString());
				if (pmenu == null) {
					log.error("[{0}]城市缺少父菜单[{1}]，配置有错误", menuCode, menuPCode);
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
		context.setResult(menusTree);
	}

}
