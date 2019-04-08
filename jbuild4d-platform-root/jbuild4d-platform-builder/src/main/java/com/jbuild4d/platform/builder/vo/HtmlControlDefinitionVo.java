package com.jbuild4d.platform.builder.vo;

import com.jbuild4d.core.base.tools.XMLDocumentUtility;
import org.w3c.dom.Node;

import javax.xml.xpath.XPathExpressionException;

public class HtmlControlDefinitionVo {
    private String singleName;
    private String text;
    private String toolbarLocation;
    private String serverResolve;
    private String clientResolve;
    private String clientResolveJs;
    private String desc;
    private String config;
    private String isJBuild4DData;
    private String controlCategory;

    public String getControlCategory() {
        return controlCategory;
    }

    public void setControlCategory(String controlCategory) {
        this.controlCategory = controlCategory;
    }

    public String getIsJBuild4DData() {
        return isJBuild4DData;
    }

    public void setIsJBuild4DData(String isJBuild4DData) {
        this.isJBuild4DData = isJBuild4DData;
    }

    private int dialogWidth;
    private int dialogHeight;

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

    public int getDialogWidth() {
        return dialogWidth;
    }

    public void setDialogWidth(int dialogWidth) {
        this.dialogWidth = dialogWidth;
    }

    public int getDialogHeight() {
        return dialogHeight;
    }

    public void setDialogHeight(int dialogHeight) {
        this.dialogHeight = dialogHeight;
    }

    public static HtmlControlDefinitionVo parseWebFormControlNode(Node node) throws XPathExpressionException {
        HtmlControlDefinitionVo vo=new HtmlControlDefinitionVo();
        vo.setSingleName(XMLDocumentUtility.getAttribute(node,"SingleName"));
        vo.setText(XMLDocumentUtility.getAttribute(node,"Text"));
        vo.setToolbarLocation(XMLDocumentUtility.getAttribute(node,"ToolbarLocation"));
        vo.setServerResolve(XMLDocumentUtility.getAttribute(node,"ServerResolve"));
        vo.setClientResolve(XMLDocumentUtility.getAttribute(node,"ClientResolve"));
        vo.setClientResolveJs(XMLDocumentUtility.getAttribute(node,"ClientResolveJs"));
        vo.setDialogWidth(Integer.parseInt(XMLDocumentUtility.getAttribute(node,"DialogWidth")));
        vo.setDialogHeight(Integer.parseInt(XMLDocumentUtility.getAttribute(node,"DialogHeight")));
        vo.setDesc(XMLDocumentUtility.parseForString(node,"Desc"));
        vo.setConfig(XMLDocumentUtility.parseForString(node,"Config"));
        vo.setIsJBuild4DData(XMLDocumentUtility.getAttribute(node,"IsJBuild4DData"));
        vo.setControlCategory(XMLDocumentUtility.getAttribute(node,"ControlCategory"));
        return vo;
    }
}
