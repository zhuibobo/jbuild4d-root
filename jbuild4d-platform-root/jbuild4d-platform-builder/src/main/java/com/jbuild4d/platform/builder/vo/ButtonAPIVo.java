package com.jbuild4d.platform.builder.vo;

import javax.xml.bind.annotation.*;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)

// XML文件中的根标识
@XmlRootElement(name = "API")
// 控制JAXB 绑定类中属性和字段的排序
@XmlType(propOrder = {
        "name",
        "id",
        "className",
        "buttonAPIParaVoList"
})
public class ButtonAPIVo {

    @XmlAttribute(name = "name")
    private String name;

    @XmlAttribute(name = "id")
    private String id;

    @XmlAttribute(name = "className")
    private String className;

    @XmlElement(name="Para")
    private List<ButtonAPIParaVo> buttonAPIParaVoList;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public List<ButtonAPIParaVo> getButtonAPIParaVoList() {
        return buttonAPIParaVoList;
    }

    public void setButtonAPIParaVoList(List<ButtonAPIParaVo> buttonAPIParaVoList) {
        this.buttonAPIParaVoList = buttonAPIParaVoList;
    }
}
