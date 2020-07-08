package com.lhq.pms.consume.bo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.lhq.pms.common.bo.ConsumeBo;
import com.lhq.pms.common.bo.impl.CommonBoImpl;
import com.lhq.pms.data.PMSContext;
import com.lhq.pms.logging.Log;

public class ConsumeBoImpl extends CommonBoImpl implements ConsumeBo {

	protected final static Log log = Log.get();
	// 菜单编码
	public static final String MENU_CODE = "consume_id";
	// 菜单父编码
	public static final String MENU_PCODE = "consume_menu_pid";
	// 子菜单集合属性名称
	public static final String CHILD_NAME = "$chinldrens";
	
	@SuppressWarnings("unchecked")
	@Override
	public void queryConsumeMenus(PMSContext context) {
		List<Map<String, Object>> consumeMenus = this.selectList("PMS-CONSUME-001", context.getLoginUser().getUserCode());
		List<Map<String, Object>> menusTree = new ArrayList<Map<String, Object>>();
		Map<String, Map<String, Object>> trees = new HashMap<String, Map<String, Object>>();
		
		for(int i = 0; i < consumeMenus.size(); i++) {
			Map<String, Object> menu = consumeMenus.get(i);
			Long menuCode = (Long) menu.get(MENU_CODE);
			Long menuPCode = (Long) menu.get(MENU_PCODE);
			
			trees.put(menuCode.toString(), menu);
			if(menuPCode == 0) {
				menusTree.add(menu);
			} else {
				//获得父节点
				Map<String, Object> pmenu = trees.get(menuPCode.toString());
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
		context.setResult(menusTree);
	}

}
