package com.lhq.pms.logging;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.lhq.pms.data.PMSContext;

import ch.qos.logback.classic.AsyncAppender;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.classic.spi.LoggingEvent;

/**
 * 日志选择器
 * 
 * @author lhq 
 */
public class PMSAsyncAppender extends AsyncAppender {
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	protected void append(ILoggingEvent eventObject) {
		if (eventObject instanceof LoggingEvent) {
			LoggingEvent evt = (LoggingEvent) eventObject;
			Object[] args = evt.getArgumentArray();
			PMSLoggingEvent dpEvt = new PMSLoggingEvent();
			dpEvt.setArgumentArray(args);
			if (args != null && args.length > 0) {
				Object obj = args[args.length - 1];
				if (obj instanceof PMSContext) {
					dpEvt.setContext((PMSContext) obj);
					List lists = new ArrayList();
					Collections.addAll(lists, args);
					lists.remove(obj);
					dpEvt.setArgumentArray(lists.toArray());
				}
			}

			dpEvt.setOwner(evt);

			super.append(dpEvt);
		}
	}
}
