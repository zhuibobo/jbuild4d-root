package com.jbuild4d.base.service.search;

public class GeneralSearchItem {
    Object value;
    GeneralSearchItemTypeEnum type;

    public Object getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public GeneralSearchItemTypeEnum getType() {
        return type;
    }

    public void setType(GeneralSearchItemTypeEnum type) {
        this.type = type;
    }
}
