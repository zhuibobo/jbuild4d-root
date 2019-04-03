package com.jbuild4d.platform.system.vo;

import com.jbuild4d.core.base.tools.UUIDUtility;
import com.jbuild4d.core.base.tools.XMLDocumentUtility;
import org.w3c.dom.Node; /**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/6
 * To change this template use File | Settings | File Templates.
 */
public class EnvVariableVo {

    private String id;
    private String type;
    private String text;
    private String value;
    private String className;
    private String para;
    private String desc;
    private String parentId;
    private boolean isGroup;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getPara() {
        return para;
    }

    public void setPara(String para) {
        this.para = para;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public boolean isGroup() {
        return isGroup;
    }

    public void setGroup(boolean group) {
        isGroup = group;
    }

    public static EnvVariableVo parseEnvVarNode(Node node,String parentId,String type) {
        EnvVariableVo vo=new EnvVariableVo();
        vo.setText(XMLDocumentUtility.getAttribute(node,"Text"));
        vo.setValue(XMLDocumentUtility.getAttribute(node,"Value"));
        vo.setClassName(XMLDocumentUtility.getAttribute(node,"ClassName"));
        vo.setPara(XMLDocumentUtility.getAttribute(node,"Para"));
        vo.setDesc(XMLDocumentUtility.getAttribute(node,"Desc"));
        vo.setId(XMLDocumentUtility.getAttribute(node,"Value"));
        vo.setParentId(parentId);
        vo.setType(type);
        vo.setGroup(false);
        return vo;
    }

    public static EnvVariableVo parseGroupNode(Node groupNode,String parentId,String type) {
        EnvVariableVo vo=new EnvVariableVo();
        vo.setId(UUIDUtility.getUUID());
        vo.setParentId(parentId);
        vo.setText(XMLDocumentUtility.getAttribute(groupNode,"Text"));
        vo.setValue(XMLDocumentUtility.getAttribute(groupNode,"Text"));
        vo.setDesc(XMLDocumentUtility.getAttribute(groupNode,"Desc"));
        vo.setGroup(true);
        vo.setType(type);
        return vo;
    }
}
