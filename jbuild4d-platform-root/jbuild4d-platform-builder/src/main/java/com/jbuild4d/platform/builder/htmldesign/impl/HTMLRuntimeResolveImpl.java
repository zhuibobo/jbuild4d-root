package com.jbuild4d.platform.builder.htmldesign.impl;

import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntity;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.core.base.tools.ClassUtility;
import com.jbuild4d.platform.builder.htmldesign.HTMLControlAttrs;
import com.jbuild4d.platform.builder.htmldesign.IHTMLControl;
import com.jbuild4d.platform.builder.htmldesign.IHTMLRuntimeResolve;
import com.jbuild4d.platform.builder.vo.RecordDataVo;
import com.jbuild4d.platform.builder.vo.ResolveHTMLControlContextVo;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;

import java.util.HashMap;
import java.util.Map;

public class HTMLRuntimeResolveImpl implements IHTMLRuntimeResolve {

    private static Map<String,IHTMLControl> controlInstanceMap=new HashMap<String,IHTMLControl>();

    @Autowired
    private AutowireCapableBeanFactory autowireCapableBeanFactory;

    private IHTMLControl getHTMLControlInstance(String fullClassName) throws IllegalAccessException, InstantiationException,ClassNotFoundException {

        if(controlInstanceMap.containsKey(fullClassName)){
            return controlInstanceMap.get(fullClassName);
        }
        else{
            IHTMLControl ctInstance=(IHTMLControl) ClassUtility.loadClass(fullClassName).newInstance();
            autowireCapableBeanFactory.autowireBean(ctInstance);
            controlInstanceMap.put(fullClassName,ctInstance);
        }
        return controlInstanceMap.get(fullClassName);
    }

    @Override
    public String resolveSourceHTML(JB4DSession jb4DSession, String id, String htmlSource) {
        String sourceHTML=htmlSource;
        if(sourceHTML!=null&&!sourceHTML.equals("")){
            //获取并解析HTML
            Document doc= Jsoup.parseBodyFragment(sourceHTML);

            ResolveHTMLControlContextVo resolveHTMLControlContextVo=new ResolveHTMLControlContextVo();

            this.loopResolveElem(jb4DSession,doc,doc,sourceHTML,null,resolveHTMLControlContextVo);

            return doc.getElementsByTag("body").html();
        }
        return "";
    }

    //Element lastParentJbuild4dCustomElem=null;
    private void loopResolveElem(JB4DSession jb4DSession,Document doc,Element parentElem,String sourceHTML,Element lastParentJbuild4dCustomElem,ResolveHTMLControlContextVo resolveHTMLControlContextVo) {
        for (Element singleElem : parentElem.children()) {

            if(singleElem.attr(HTMLControlAttrs.JBUILD4D_CUSTOM).equals("true")){
                String serverResolveFullClassName = singleElem.attr(HTMLControlAttrs.SERVERRESOLVE);
                lastParentJbuild4dCustomElem=singleElem;

                if(serverResolveFullClassName!=null&&!serverResolveFullClassName.equals("")){
                    try {
                        IHTMLControl htmlControl = this.getHTMLControlInstance(serverResolveFullClassName);
                        htmlControl.resolve(jb4DSession,sourceHTML,doc,singleElem,parentElem,lastParentJbuild4dCustomElem,resolveHTMLControlContextVo);
                    }
                    catch (Exception ex){
                        singleElem.html("控件解析出错！【"+ex.getMessage()+"】");
                    }
                }
            }
            else{

            }

            if(singleElem.childNodeSize()>0){
                loopResolveElem(jb4DSession,doc,singleElem,sourceHTML,lastParentJbuild4dCustomElem,resolveHTMLControlContextVo);
            }
        }
    }

    @Override
    public String dynamicBind(JB4DSession jb4DSession, String id, String resolveHtml) {
        return resolveHtml;
    }
}
