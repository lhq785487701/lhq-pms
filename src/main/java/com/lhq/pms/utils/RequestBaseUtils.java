package com.lhq.pms.utils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.http.fileupload.FileItem;
import org.apache.tomcat.util.http.fileupload.FileItemFactory;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.apache.tomcat.util.http.fileupload.RequestContext;
import org.apache.tomcat.util.http.fileupload.disk.DiskFileItemFactory;
import org.apache.tomcat.util.http.fileupload.servlet.ServletFileUpload;
import org.apache.tomcat.util.http.fileupload.servlet.ServletRequestContext;
import org.springframework.session.Session;
import org.springframework.session.data.redis.RedisOperationsSessionRepository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.lhq.pms.data.LoginUser;
import com.lhq.pms.data.PMSContext;
import com.lhq.pms.exception.PMSException;
import com.lhq.pms.logging.LogParams;
import com.lhq.pms.utils.json.JsonParseUtils;

import eu.bitwalker.useragentutils.Browser;
import eu.bitwalker.useragentutils.DeviceType;
import eu.bitwalker.useragentutils.OperatingSystem;
import eu.bitwalker.useragentutils.RenderingEngine;
import eu.bitwalker.useragentutils.UserAgent;
import eu.bitwalker.useragentutils.Version;

/**
 * HttpServletRequest处理类
 * 
 * @author lhq 
 */
public class RequestBaseUtils {

	protected static final String UNKNOWN = "unknown";
	protected static final String LOCAL_IP4 = "127.0.0.1";
	protected static final String LOCAL_IP6 = "0:0:0:0:0:0:0:1";
	protected static final int IP_LEN = 15;
	protected static final String IP_SP = ",";

	/**
	 * 基础初始化参数
	 * 
	 * @param req
	 * @param res
	 * @return
	 * @throws JsonProcessingException
	 * @throws IOException
	 * @throws FileUploadException
	 */
	public PMSContext parseBaseParams(HttpServletRequest req, HttpServletResponse res) throws JsonProcessingException, IOException, FileUploadException {
		boolean isMultipart = ServletFileUpload.isMultipartContent(req);
		String url = req.getRequestURI();
		boolean isDown = url.endsWith(".down");
		PMSContext context = null;
		if (isMultipart) {
			context = parseFile(req);
		} else if (isDown) {
			String data = req.getParameter("sdpData");
			if (data != null && data.length() > 0) {
				context = JsonParseUtils.toJsonObject(data.getBytes("utf-8"));
			}
		} else {
			InputStream is = req.getInputStream();
			ByteArrayOutputStream os = new ByteArrayOutputStream();
			byte[] buffer = new byte[64 * 1024];
			int count = 0;
			while ((count = is.read(buffer)) != -1) {
				os.write(buffer, 0, count);
			}
			if (os.size() > 0) {
				byte a[] = os.toByteArray();
				os.close();
				try {
					context = JsonParseUtils.toJsonObject(a);
				} catch (Exception e) {

				}
			}
			if (context == null) {
				context = new PMSContext();
			}
			parse(req, context);
		}
		context.setRequest(req);
		context.addParam("$client_ip", getIpAddr(req));
		context.addParam("$action_url", req.getRequestURI());
		context.setResponse(res);
		initUserAgent(context.getDataParams(), req);

		LogParams.current(context);
		return context;
	}

	/**
	 * 解析参数
	 * 
	 * @param req
	 * @param response
	 * @return
	 * @throws IOException
	 * @throws JsonProcessingException
	 * @throws FileUploadException
	 */
	public PMSContext parseParams(HttpServletRequest req, HttpServletResponse res) throws JsonProcessingException, IOException, FileUploadException {
		PMSContext context = parseBaseParams(req, res);

		RedisOperationsSessionRepository sessionRepository = (RedisOperationsSessionRepository) SpringUtils.getBean("sessionRepository");
		LoginUser user = (LoginUser) SpringUtils.getBean("loginUser");
		Session session = sessionRepository.getSession("");

		// user.setUserCode(userInfo.getUsername());
		// user.parseMap(userInfo.getAttrs());
		user.setVisitTime(DateUtils.now());
		user.setLocale(req.getLocale());

		// HttpSession session = req.getSession();
		user.setSessionCode(session.getId().toString());
		context.setLoginUser(user);

		return context;
	}

	public PMSContext parsePubParams(HttpServletRequest req, HttpServletResponse res) throws JsonProcessingException, IOException, FileUploadException {
		PMSContext context = parseBaseParams(req, res);
		return context;
	}

	public void parse(HttpServletRequest req, PMSContext context) {
		// 再parameter
		Enumeration<String> e = req.getParameterNames();
		while (e.hasMoreElements()) {
			String name = (String) e.nextElement();
			context.addParam(name, req.getParameter(name));
		}
	}

	/**
	 * 解析文件
	 * 
	 * @param req
	 * @return
	 * @throws FileUploadException
	 * @throws JsonProcessingException
	 * @throws IOException
	 */
	protected PMSContext parseFile(HttpServletRequest req) throws FileUploadException, JsonProcessingException, IOException {
		// 读入上传的数据
		FileItemFactory factory = new DiskFileItemFactory();
		ServletFileUpload upload = new ServletFileUpload(factory);
		RequestContext rc = new ServletRequestContext(req);
		List<FileItem> items = upload.parseRequest(rc);
		// 处理文件名中文
		upload.setHeaderEncoding("UTF-8");
		Iterator<FileItem> itr = items.iterator();
		FileItem item = null;
		PMSContext context = null;
		List<FileItem> fis = new ArrayList<FileItem>();
		while (itr.hasNext()) {
			item = (FileItem) itr.next();
			if (item.isFormField()) {
				if ("sdpData".equalsIgnoreCase(item.getFieldName())) {
					context = JsonParseUtils.toJsonObject(item.get());
				}
			} else {
				fis.add(item);
			}
		}
		if (context == null) {
			throw new PMSException("exp-sdp-core-0001");
		}
		context.setFiles(fis);
		return context;
	}

	/**
	 * 初始化用户
	 * 
	 * @param pars
	 * @param req
	 */
	public static void initUserAgent(Map<String, Object> pars, HttpServletRequest req) {
		UserAgent agent = UserAgent.parseUserAgentString(req.getHeader("User-Agent"));
		Browser browser = agent.getBrowser();
		if (browser != null) {
			StringBuilder sb = new StringBuilder(browser.getName()).append(" ");

			Version ver = agent.getBrowserVersion();
			if (ver != null) {
				sb.append(ver.toString()).append(" ");
			}

			RenderingEngine re = browser.getRenderingEngine();
			if (re != null) {
				sb.append(re.name()).append(re.ordinal()).append(" ");
			}
			sb.append(browser.getName()).append(browser.ordinal());

			pars.put("$client_browser", sb.toString());
		}
		OperatingSystem system = agent.getOperatingSystem();
		if (system != null) {
			pars.put("$client_system", system.getName());

			DeviceType dt = system.getDeviceType();
			if (dt != null) {
				pars.put("$client_device", dt.getName());
			}
		}
	}

	/**
	 * 获取客户端的IP地址
	 * 
	 * @return
	 */
	public static String getIpAddr(HttpServletRequest request) {
		String ipAddress = StringUtils.trim(request.getHeader("x-forwarded-for"));
		if (ipAddress.length() == 0 || UNKNOWN.equalsIgnoreCase(ipAddress)) {
			ipAddress = StringUtils.trim(request.getHeader("Proxy-Client-IP"));
		}
		if (ipAddress.length() == 0 || UNKNOWN.equalsIgnoreCase(ipAddress)) {
			ipAddress = StringUtils.trim(request.getHeader("WL-Proxy-Client-IP"));
		}
		if (ipAddress.length() == 0 || UNKNOWN.equalsIgnoreCase(ipAddress)) {
			ipAddress = StringUtils.trim(request.getRemoteAddr());
			if (LOCAL_IP4.equals(ipAddress) || LOCAL_IP6.equals(ipAddress)) {
				// 根据网卡取本机配置的IP
				InetAddress inet = null;
				try {
					inet = InetAddress.getLocalHost();
					ipAddress = StringUtils.trim(inet.getHostAddress());
				} catch (UnknownHostException e) {

				}
			}
		}

		// 对于通过多个代理的情况，第一个IP为客户端真实IP,多个IP按照','分割
		if (ipAddress.length() > IP_LEN) {
			if (ipAddress.indexOf(IP_SP) > 0) {
				ipAddress = ipAddress.substring(0, ipAddress.indexOf(IP_SP));
			}
		}
		return ipAddress;
	}
}
