package com.jbuild4d.platform.builder.vo;


import java.util.List;


public class DesignThemesConfigVo {

    private String name;

    private List<RefCssVo> refCssVoList;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<RefCssVo> getRefCssVoList() {
        return refCssVoList;
    }

    public void setRefCssVoList(List<RefCssVo> refCssVoList) {
        this.refCssVoList = refCssVoList;
    }
}
