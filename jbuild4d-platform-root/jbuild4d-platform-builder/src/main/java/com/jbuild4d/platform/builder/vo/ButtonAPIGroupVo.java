package com.jbuild4d.platform.builder.vo;

import javax.xml.bind.annotation.*;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "Group")
// 控制JAXB 绑定类中属性和字段的排序
@XmlType(propOrder = {
        "name",
        "buttonAPIVoList"
})
public class ButtonAPIGroupVo {

    @XmlAttribute(name = "name")
    private String name;

    @XmlElement(name = "API")
    private List<ButtonAPIVo> buttonAPIVoList;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ButtonAPIVo> getButtonAPIVoList() {
        return buttonAPIVoList;
    }

    public void setButtonAPIVoList(List<ButtonAPIVo> buttonAPIVoList) {
        this.buttonAPIVoList = buttonAPIVoList;
    }
}
