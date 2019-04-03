package com.jbuild4d.platform.builder.vo;


import javax.xml.bind.annotation.*;
import java.util.List;


@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "Config")
// 控制JAXB 绑定类中属性和字段的排序
@XmlType(propOrder = {
        "desc",
        "themes"
})
public class DesignThemeConfigVo {

    @XmlAttribute(name = "desc")
    private String desc;

    @XmlElement(name = "Theme")
    private List<DesignThemeVo> themes;

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public List<DesignThemeVo> getThemes() {
        return themes;
    }

    public void setThemes(List<DesignThemeVo> themes) {
        this.themes = themes;
    }
}
