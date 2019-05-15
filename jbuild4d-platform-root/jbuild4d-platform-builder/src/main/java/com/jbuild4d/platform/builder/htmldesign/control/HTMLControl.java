package com.jbuild4d.platform.builder.htmldesign.control;

import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.core.base.tools.ClassUtility;
import com.jbuild4d.platform.builder.htmldesign.HTMLControlAttrs;
import com.jbuild4d.platform.builder.htmldesign.ICKEditorPluginsService;
import com.jbuild4d.platform.builder.vo.HtmlControlDefinitionVo;
import com.jbuild4d.platform.builder.vo.ResolveHTMLControlContextVo;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;

import java.util.HashMap;
import java.util.Map;

public abstract class HTMLControl implements IHTMLControl {

    private static Map<String,IHTMLControl> controlInstanceMap=new HashMap<String,IHTMLControl>();

    @Autowired
    protected ICKEditorPluginsService ckEditorPluginsService;

    @Autowired
    protected AutowireCapableBeanFactory autowireCapableBeanFactory;

    public IHTMLControl getHTMLControlInstance(String fullClassName) throws IllegalAccessException, InstantiationException,ClassNotFoundException {

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
    public void rendererChain(JB4DSession jb4DSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo) throws JBuild4DGenerallyException {
        for (Element singleElem : singleControlElem.children()) {

            if(singleElem.attr(HTMLControlAttrs.JBUILD4D_CUSTOM).equals("true")){
                //String serverResolveFullClassName = singleElem.attr(HTMLControlAttrs.SERVERRESOLVE);
                String singleName=singleElem.attr(HTMLControlAttrs.SINGLENAME);
                HtmlControlDefinitionVo htmlControlDefinitionVo=ckEditorPluginsService.getVo(singleName);
                String serverResolveFullClassName = htmlControlDefinitionVo.getServerResolve();

                lastParentJbuild4dCustomElem=singleElem;

                if(serverResolveFullClassName!=null&&!serverResolveFullClassName.equals("")){
                    try {
                        IHTMLControl htmlControl = this.getHTMLControlInstance(serverResolveFullClassName);

                        htmlControl.resolveDefAttr(jb4DSession, sourceHTML, doc, singleElem, parentElem, lastParentJbuild4dCustomElem, resolveHTMLControlContextVo, htmlControlDefinitionVo);
                        htmlControl.resolveSelf(jb4DSession, sourceHTML, doc, singleElem, parentElem, lastParentJbuild4dCustomElem, resolveHTMLControlContextVo, htmlControlDefinitionVo);

                        htmlControl.rendererChain(jb4DSession, sourceHTML, doc, singleElem, parentElem, lastParentJbuild4dCustomElem, resolveHTMLControlContextVo);
                    }
                    catch (Exception ex){
                        singleElem.html("控件解析出错！【"+ex.getMessage()+"】");
                    }
                }
                else
                {
                    rendererChain(jb4DSession, sourceHTML, doc, singleElem, singleElem, lastParentJbuild4dCustomElem, resolveHTMLControlContextVo);
                }
            }
            else{
                //如果是普通html元素则直接递归处理,如果是自定义控件,则由控件显示调用
                if(singleElem.childNodeSize()>0){
                    rendererChain(jb4DSession, sourceHTML, doc, singleElem, singleElem, lastParentJbuild4dCustomElem, resolveHTMLControlContextVo);
                }
            }
        }
    }

    //todo 绑定默认值
    @Override
    public void bindDefaultValue(JB4DSession jb4DSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo, HtmlControlDefinitionVo htmlControlDefinitionVo) {

    }

    @Override
    public void resolveDefAttr(JB4DSession jb4DSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo, HtmlControlDefinitionVo htmlControlDefinitionVo) {
        //附件上客户端解析对象,适用于简单控件
        singleControlElem.attr("client_resolve",htmlControlDefinitionVo.getClientResolve());

        //附加上自定义的样式
        String className=singleControlElem.attr("classname");
        if(!className.equals("")){
            singleControlElem.addClass(className);
        }

        //处理自读属性
        //处理disable属性
        //todo 5-14处理到这里
    }

    @Override
    public String parseToJson(JB4DSession jb4DSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo, HtmlControlDefinitionVo htmlControlDefinitionVo) {
        return "{}";
    }
}
