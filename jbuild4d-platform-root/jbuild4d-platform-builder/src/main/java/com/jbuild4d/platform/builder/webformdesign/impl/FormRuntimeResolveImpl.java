package com.jbuild4d.platform.builder.webformdesign.impl;

import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntity;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.core.base.tools.ClassUtility;
import com.jbuild4d.platform.builder.htmldesign.HTMLControlAttrs;
import com.jbuild4d.platform.builder.vo.RecordDataVo;
import com.jbuild4d.platform.builder.webformdesign.IFormRuntimeResolve;
import com.jbuild4d.platform.builder.webformdesign.control.IWebFormControl;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;

import java.util.HashMap;
import java.util.Map;

public class FormRuntimeResolveImpl implements IFormRuntimeResolve {

    private static Map<String,IWebFormControl> controlInstanceMap=new HashMap<String,IWebFormControl>();

    @Autowired
    private AutowireCapableBeanFactory autowireCapableBeanFactory;

    @Override
    public String resolveSourceHTML(JB4DSession jb4DSession, String id, FormResourceEntity record) {
        String sourceHTML=record.getFormHtmlSource();
        if(sourceHTML!=null&&!sourceHTML.equals("")){
            //获取并构建窗体
            Document doc= Jsoup.parseBodyFragment(record.getFormHtmlSource());

            //获取所有的控件
            Elements allCustomControls= doc.getElementsByAttribute(HTMLControlAttrs.JBUILD4D_CUSTOM);

            if(null != allCustomControls && allCustomControls.size() > 0) {
                for (Element singleControlElem : allCustomControls) {
                    String serverResolveFullClassName = singleControlElem.attr(HTMLControlAttrs.SERVERRESOLVE);

                    if(serverResolveFullClassName!=null&&!serverResolveFullClassName.equals("")){
                        try {
                            IWebFormControl webFormControl = this.getWebFormControlInstance(serverResolveFullClassName);
                            webFormControl.resolve(jb4DSession,record,doc,singleControlElem,null);
                        }
                        catch (Exception ex){
                            singleControlElem.html("控件解析出错！【"+ex.getMessage()+"】");
                        }
                    }
                }
            }
            return doc.getElementsByTag("body").html();
        }
        return "";
    }

    @Override
    public String dynamicBind(JB4DSession jb4DSession, String id, FormResourceEntity record,String resolvedHtmlContent, RecordDataVo recordDataVo) {
        return resolvedHtmlContent;
    }

    private IWebFormControl getWebFormControlInstance(String fullClassName) throws IllegalAccessException, InstantiationException,ClassNotFoundException {

        if(controlInstanceMap.containsKey(fullClassName)){
            return controlInstanceMap.get(fullClassName);
        }
        else{
            IWebFormControl ctInstance=(IWebFormControl)ClassUtility.loadClass(fullClassName).newInstance();
            autowireCapableBeanFactory.autowireBean(ctInstance);
            controlInstanceMap.put(fullClassName,ctInstance);
        }
        return controlInstanceMap.get(fullClassName);

        /*IWebFormControl ctInstance=(IWebFormControl) ClassUtility.loadClass(fullClassName).newInstance();
        return ctInstance;*/
    }
}
