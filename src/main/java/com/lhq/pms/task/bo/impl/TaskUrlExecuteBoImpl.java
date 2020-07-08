package com.lhq.pms.task.bo.impl;

import java.util.Map;

import org.apache.http.client.fluent.Request;
import org.apache.http.client.fluent.Response;

import com.lhq.pms.common.bo.impl.CommonBoImpl;
import com.lhq.pms.exception.PMSException;
import com.lhq.pms.task.bo.TaskExecuteBo;
import com.lhq.pms.task.vo.PMSTaskBean;
import com.lhq.pms.utils.json.JsonParseUtils;

/**
 * sql调度任务执行
 * 
 * @author lhq 通过地址调用
 *
 */
public class TaskUrlExecuteBoImpl extends CommonBoImpl implements TaskExecuteBo {
	private static final String CODE = "code";

	/**
	 * 地址任务执行
	 */
	@Override
	public void execute(PMSTaskBean bean) {
		try {
			Response resp = Request.Post(bean.getDoContent()).execute();
			byte[] bytes = resp.returnContent().asBytes();
			Map<String, Object> result = JsonParseUtils.jsonToMap(bytes);
			if (result != null && result.containsKey(CODE)) {
				int code = (Integer) result.get("code");
				if (code != 1) {
					throw new Exception((String) result.get("msg"));
				}
			}
		} catch (Exception e) {
			throw new PMSException(e);
		}
	}
}
