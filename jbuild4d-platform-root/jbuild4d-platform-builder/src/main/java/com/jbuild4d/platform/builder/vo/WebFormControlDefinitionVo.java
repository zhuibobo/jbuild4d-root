package com.jbuild4d.platform.builder.vo;

import com.jbuild4d.base.tools.common.XMLUtility;
import org.w3c.dom.Node;

import javax.xml.xpath.XPathExpressionException;

public class WebFormControlDefinitionVo {
    private String singleName;
    private String text;
    private String toolbarLocation;
    private String serverResolve;
    private String clientResolve;
    private String clientResolveJs;
    private String desc;
    private String config;

    public String getSingleName() {
        return singleName;
    }

    public void setSingleName(String singleName) {
        this.singleName = singleName;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getToolbarLocation() {
        return toolbarLocation;
    }

    public void setToolbarLocation(String toolbarLocation) {
        this.toolbarLocation = toolbarLocation;
    }

    public String getServerResolve() {
        return serverResolve;
    }

    public void setServerResolve(String serverResolve) {
        this.serverResolve = serverResolve;
    }

    public String getClientResolve() {
        return clientResolve;
    }

    public void setClientResolve(String clientResolve) {
        this.clientResolve = clientResolve;
    }

    public String getClientResolveJs() {
        return clientResolveJs;
    }

    public void setClientResolveJs(String clientResolveJs) {
        this.clientResolveJs = clientResolveJs;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getConfig() {
        return config;
    }

    public void setConfig(String config) {
        this.config = config;
    }

    public static WebFormControlDefinitionVo parseWebFormControlNode(Node node) throws XPathExpressionException {
        WebFormControlDefinitionVo vo=new WebFormControlDefinitionVo();
        vo.setSingleName(XMLUtility.getAttribute(node,"SingleName"));
        vo.setText(XMLUtility.getAttribute(node,"Text"));
        vo.setToolbarLocation(XMLUtility.getAttribute(node,"ToolbarLocation"));
        vo.setServerResolve(XMLUtility.getAttribute(node,"ServerResolve"));
        vo.setClientResolve(XMLUtility.getAttribute(node,"ClientResolve"));
        vo.setClientResolveJs(XMLUtility.getAttribute(node,"ClientResolveJs"));
        vo.setDesc(XMLUtility.parseForString(node,"Desc"));
        vo.setConfig(XMLUtility.parseForString(node,"Config"));
        return vo;
    }
}