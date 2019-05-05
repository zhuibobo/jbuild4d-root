package com.jbuild4d.platform.builder.htmldesign.impl;

import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.htmldesign.ICKEditorPluginsService;
import com.jbuild4d.platform.builder.htmldesign.IHTMLRuntimeResolve;
import com.jbuild4d.platform.builder.htmldesign.control.BodyControl;
import com.jbuild4d.platform.builder.vo.ResolveHTMLControlContextVo;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;

public class HTMLRuntimeResolveImpl implements IHTMLRuntimeResolve {

    @Autowired
    private AutowireCapableBeanFactory autowireCapableBeanFactory;

    @Autowired
    private ICKEditorPluginsService ckEditorPluginsService;

    @Override
    public String resolveSourceHTML(JB4DSession jb4DSession, String id, String htmlSource) throws JBuild4DGenerallyException {
        String sourceHTML=htmlSource;
        if(sourceHTML!=null&&!sourceHTML.equals("")){
            //获取并解析HTML
            Document doc= Jsoup.parseBodyFragment(sourceHTML);

            ResolveHTMLControlContextVo resolveHTMLControlContextVo=new ResolveHTMLControlContextVo();

            BodyControl bodyControl= BodyControl.getInstance();
            autowireCapableBeanFactory.autowireBean(bodyControl);
            bodyControl.rendererChain(jb4DSession,htmlSource,doc,doc,doc,null,resolveHTMLControlContextVo);
            //this.loopResolveElem(jb4DSession,doc,doc,sourceHTML,null,resolveHTMLControlContextVo);

            return doc.getElementsByTag("body").html();
        }
        return "";
    }

    //Element lastParentJbuild4dCustomElem=null;
    //public void loopResolveElem(JB4DSession jb4DSession, Document doc, Element parentElem, String sourceHTML, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo, boolean resolveSelf) throws JBuild4DGenerallyException {
        /*for (Element singleElem : parentElem.children()) {

            if(singleElem.attr(HTMLControlAttrs.JBUILD4D_CUSTOM).equals("true")){
                //String serverResolveFullClassName = singleElem.attr(HTMLControlAttrs.SERVERRESOLVE);
                String singleName=singleElem.attr(HTMLControlAttrs.SINGLENAME);
                HtmlControlDefinitionVo htmlControlDefinitionVo=ckEditorPluginsService.getVo(singleName);
                String serverResolveFullClassName = htmlControlDefinitionVo.getServerResolve();

                lastParentJbuild4dCustomElem=singleElem;

                if(serverResolveFullClassName!=null&&!serverResolveFullClassName.equals("")){
                    try {
                        IHTMLControl htmlControl = this.getHTMLControlInstance(serverResolveFullClassName);
                        if(resolveSelf){
                            htmlControl.resolveSelf();
                        }
                        else {
                            htmlControl.renderer(jb4DSession, sourceHTML, doc, singleElem, parentElem, lastParentJbuild4dCustomElem, resolveHTMLControlContextVo, htmlControlDefinitionVo);
                        }
                    }
                    catch (Exception ex){
                        singleElem.html("控件解析出错！【"+ex.getMessage()+"】");
                    }
                }
            }
            else{
                //如果是普通html元素则直接递归处理,如果是自定义控件,则由控件显示调用
                if(singleElem.childNodeSize()>0){
                    loopResolveElem(jb4DSession,doc,singleElem,sourceHTML,lastParentJbuild4dCustomElem,resolveHTMLControlContextVo);
                }
            }
        }*/
    //}

    //控件是否动态绑定,交由控件解析时,控件本身解析自行设定,动态绑定完成字后,需要控件自身移除敏感属性.
    @Override
    public String dynamicBind(JB4DSession jb4DSession, String id, String resolveHtml) {
        return resolveHtml;
    }
}
