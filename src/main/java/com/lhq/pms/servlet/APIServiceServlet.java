package com.lhq.pms.servlet;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.lhq.pms.data.PMSContext;
import com.lhq.pms.exception.PMSException;
import com.lhq.pms.logging.Log;
import com.lhq.pms.service.APIService;
import com.lhq.pms.utils.DateUtils;
import com.lhq.pms.utils.ExceptionUtils;
import com.lhq.pms.utils.RequestBaseUtils;
import com.lhq.pms.utils.SpringUtils;
import com.lhq.pms.utils.json.JsonParseUtils;

/**
 * 类功能描述 接口控制类
 * 
 * @author lhq 
 */
@WebServlet(urlPatterns = { "/api/*" }, asyncSupported = false)
public class APIServiceServlet extends HttpServlet {
	protected final static Log log = Log.get();
	private static final int API_POS = 5;

	/**
	 * 
	 */
	private static final long serialVersionUID = 5509116286533034472L;

	private APIService apiService = null;
	private RequestBaseUtils requestUtils = null;

	@Override
	public void init(ServletConfig servletConfig) throws ServletException {
		this.apiService = (APIService) SpringUtils.getBean("apiService");
		this.requestUtils = (RequestBaseUtils) SpringUtils.getBean("requestUtils");
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		doPost(req, res);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		long curTime = DateUtils.currTimestamp().getTime();
		String url = req.getRequestURI();
		String msg = null;
		try {
			String[] urls = url.split("/");
			int len = urls.length;
			if (len < API_POS) {
				throw new PMSException("exp-sdp-api-004", url);
			}
			PMSContext context = this.requestUtils.parseParams(req, resp);
			context.setBoId(urls[len - 2]);
			String method = urls[len - 1];
			context.setBoMethod(method.replace(".down", ""));

			apiService.doAction(context);

			byte[] res = context.getResultJson();

			if (res == null) {
				if (context.getInputStream() != null) {
					downFile(context.getInputStream(), resp);
					return;
				}
			} else {
				resp.setHeader("Content-Type", "text/plain");
				resp.getOutputStream().write(res);
			}

			long curTime2 = DateUtils.currTimestamp().getTime();
			log.info(url + "业务执行的时间为：" + (curTime2 - curTime) + "毫秒");
			return;
		} catch (Exception e) {
			Throwable ex = e.getCause();
			while (ex != null) {
				if (ex instanceof PMSException) {
					msg = ((PMSException) ex).getMessage();
					log.error(msg);
					break;
				}
				Throwable tex = ex.getCause();
				if (tex == null) {
					msg = ex.getMessage();
					break;
				} else {
					ex = tex;
				}
			}
			if (msg == null || msg.trim().length() <= 0) {
				msg = ExceptionUtils.getException("", e).toString();
				log.error("服务接口出错", e, url);
			}
		}

		if (msg != null) {
			Map<String, Object> m = new HashMap<String, Object>(2);
			m.put("code", 0);
			m.put("msg", msg);
			byte[] bytes = JsonParseUtils.readJson(m);
			resp.setHeader("Content-Type", "text/plain;charset=utf-8");
			resp.getOutputStream().write(bytes);
		}
	}

	private void downFile(InputStream input, HttpServletResponse resp) {
		OutputStream outputStream = null;
		try {
			outputStream = resp.getOutputStream();
			// 1.设置文件ContentType类型，这样设置，会自动判断下载文件类型
			// resp.setContentType("multipart/form-data");
			// 2.设置文件头：最后一个参数是设置下载文件名(假如我们叫a.pdf)
			// resp.setHeader("Content-Disposition",
			// "attachment;fileName="+
			// var_file_name);

			byte[] buffer = new byte[1024 * 10];
			int i = -1;
			while ((i = input.read(buffer)) != -1) {
				outputStream.write(buffer, 0, i);
			}
			input.close();
			resp.flushBuffer();
		} catch (IOException e) {
			throw new PMSException(e);
		}
	}
}