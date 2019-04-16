package com.jbuild4d.platform.builder.vo;


import javax.xml.bind.annotation.*;

@XmlAccessorType(XmlAccessType.FIELD)

// XML文件中的根标识
@XmlRootElement(name = "Para")
// 控制JAXB 绑定类中属性和字段的排序
@XmlType(propOrder = {
        "key",
        "value"
})
public class ButtonAPIParaVo {

    @XmlAttribute(name = "key")
    private String key;

    @XmlAttribute(name = "value")
    private String value;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
