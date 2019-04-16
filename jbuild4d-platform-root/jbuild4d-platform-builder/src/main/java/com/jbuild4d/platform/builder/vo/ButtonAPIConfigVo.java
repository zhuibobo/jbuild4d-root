package com.jbuild4d.platform.builder.vo;


import javax.xml.bind.annotation.*;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "ButtonAPIConfig")

// 控制JAXB 绑定类中属性和字段的排序
@XmlType(propOrder = {
        "buttonAPIGroupVoList"
})
public class ButtonAPIConfigVo {

    @XmlElement(name = "Group")
    private List<ButtonAPIGroupVo> buttonAPIGroupVoList;

    public List<ButtonAPIGroupVo> getButtonAPIGroupVoList() {
        return buttonAPIGroupVoList;
    }

    public void setButtonAPIGroupVoList(List<ButtonAPIGroupVo> buttonAPIGroupVoList) {
        this.buttonAPIGroupVoList = buttonAPIGroupVoList;
    }
}
