package com.jbuild4d.platform.builder.vo;


import javax.xml.bind.annotation.*;
import java.util.List;


@XmlAccessorType(XmlAccessType.FIELD)

// XML文件中的根标识
@XmlRootElement(name = "Theme")
// 控制JAXB 绑定类中属性和字段的排序
@XmlType(propOrder = {
        "name",
        "desc",
        "ref"
})
public class DesignThemesConfigVo {

    private String name;

    private String desc;

    private List<RefCssVo> ref;

    public List<RefCssVo> getRef() {
        return ref;
    }

    public void setRef(List<RefCssVo> ref) {
        this.ref = ref;
    }

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


}
