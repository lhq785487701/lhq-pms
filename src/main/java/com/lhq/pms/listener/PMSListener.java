package com.lhq.pms.listener;

import java.lang.management.ManagementFactory;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Set;

import javax.management.MBeanServer;
import javax.management.ObjectName;
import javax.management.Query;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.lhq.pms.utils.GlobalUtils;

/**
 * 类功能描述
 */
public class PMSListener implements ServletContextListener {
	public static final String UNKNOW_HOST = "unknow host";

	/*s
	 * (non-Javadoc)
	 * 
	 * @see javax.servlet.ServletContextListener#contextDestroyed(javax.servlet.
	 * ServletContextEvent)
	 */
	@Override
	public void contextDestroyed(ServletContextEvent context) {

	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * javax.servlet.ServletContextListener#contextInitialized(javax.servlet.
	 * ServletContextEvent)
	 */
	@Override
	public void contextInitialized(ServletContextEvent context) {
		ServletContext sc = context.getServletContext();
		String app = sc.getInitParameter("webAppRootKey");
		GlobalUtils.registerVariant("APP_SYSTEM", app);
		MBeanServer mbs = ManagementFactory.getPlatformMBeanServer();
		try {
			Set<ObjectName> objs = mbs.queryNames(new ObjectName("*:type=Connector,*"),
					Query.match(Query.attr("protocol"), Query.value("HTTP/1.1")));
			ObjectName obj = objs.iterator().next();
			String port = obj.getKeyProperty("port");
			GlobalUtils.registerVariant("APP_SERVER_IP", getIp() + ":" + port);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private String getIp() {
		try {
			return InetAddress.getLocalHost().getHostAddress();
		} catch (UnknownHostException e) {
			e.printStackTrace();
			return UNKNOW_HOST;
		}
	}
}
