package com.jbuild4d.platform.builder.vo;

import javax.xml.bind.annotation.*;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)

// XML文件中的根标识
@XmlRootElement(name = "Theme")
// 控制JAXB 绑定类中属性和字段的排序
@XmlType(propOrder = {
        "value",
        "name",
        "desc",
        "refs"
})
public class DesignThemeVo {

    @XmlAttribute(name = "value")
    private String value;

    @XmlAttribute(name = "name")
    private String name;

    @XmlAttribute(name = "desc")
    private String desc;

    @XmlElement(name = "Ref")
    private List<DesignThemeRefVo> refs;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public void setRefs(List<DesignThemeRefVo> refs) {
        this.refs = refs;
    }

    public List getRefs() {
        return refs;
    }
}
