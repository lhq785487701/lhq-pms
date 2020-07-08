package com.lhq.pms.cxf.interceptor;

import java.io.InputStream;
import java.io.OutputStream;

import org.apache.cxf.helpers.IOUtils;
import org.apache.cxf.interceptor.Fault;
import org.apache.cxf.io.CachedOutputStream;
import org.apache.cxf.message.Message;
import org.apache.cxf.phase.AbstractPhaseInterceptor;
import org.apache.cxf.phase.Phase;

public class MessageOutInterceptor extends AbstractPhaseInterceptor<Message> {
    @SuppressWarnings("unused")
    private String mMessage;
    
    public MessageOutInterceptor() {
        super(Phase.PRE_STREAM);
    }

    /**
     *  
     * 输出的报关
     */
   public void handleMessage(Message message) throws Fault {
       String xml;
         try {
            
             String inputXML = (String) message.getExchange().get("idtest"); 
             System.out.println("输入信息：：：："+inputXML);
             OutputStream os = message.getContent(OutputStream.class); 
             message.getInterceptorChain().doIntercept(message);
             CachedOutputStream cs = new CachedOutputStream();
             message.setContent(OutputStream.class, cs);
             message.getInterceptorChain().doIntercept(message);
             CachedOutputStream csnew = (CachedOutputStream) message.getContent(OutputStream.class);
             InputStream in = csnew.getInputStream();
             xml = IOUtils.toString(in);
             System.out.println("拦截器得到输出报文：" + xml);
             os.flush();
             /*CachedOutputStream csnew = (CachedOutputStream) message.getContent(OutputStream.class);
             InputStream in = csnew.getInputStream();
             xml = IOUtils.toString(in);
             System.out.println("输出信息：" + xml);
             IOUtils.copy(new ByteArrayInputStream(xml.getBytes()), os); 
             os.flush();
             message.setContent(OutputStream.class, os); */
            
         } catch (Exception e) {
             e.printStackTrace();
         }
    }
   
  
}