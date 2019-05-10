package com.jbuild4d.platform.builder.htmldesign.control.weblist;

import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.htmldesign.HTMLControlAttrs;
import com.jbuild4d.platform.builder.htmldesign.ICKEditorPluginsService;
import com.jbuild4d.platform.builder.htmldesign.control.HTMLControl;
import com.jbuild4d.platform.builder.htmldesign.control.IHTMLControl;
import com.jbuild4d.platform.builder.vo.DynamicBindHTMLControlContextVo;
import com.jbuild4d.platform.builder.vo.HtmlControlDefinitionVo;
import com.jbuild4d.platform.builder.vo.ResolveHTMLControlContextVo;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;

public class WebListListButtonContainer  extends HTMLControl implements IHTMLControl {

    @Override
    public void rendererChain(JB4DSession jb4DSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo) throws JBuild4DGenerallyException {

        //获取其中的按钮,将html装换为json格式,提供给前端做二次解析.
        //获取所有的自定义控件
        Elements allElems=singleControlElem.getElementsByTag("div");
        for (Element singleElem : allElems) {
            if(singleElem.attr("jbuild4d_custom").equals("true")){

            }
        }

        //查找其中的wldct-list-button-inner-wrap,将其内容清空
        Elements elements=singleControlElem.getElementsByClass("wldct-list-button-inner-wrap");
        if(elements!=null&&elements.size()>0){
            elements.get(0).html("");
        }

        return;
    }

    @Override
    public void resolveSelf(JB4DSession jb4DSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo, HtmlControlDefinitionVo htmlControlDefinitionVo) {

    }

    @Override
    public void dynamicBind(JB4DSession jb4DSession, String sourceHTML, String resolveHTML, Document doc, Element singleControlElem, DynamicBindHTMLControlContextVo dynamicBindHTMLControlContextVo, HtmlControlDefinitionVo htmlControlPluginDefinitionVo) {

    }
}