package com.jbuild4d.platform.builder.vo;

public class ValidateTableUpdateResultVo {
    /**
     * 是否允许
     */
    private boolean enable = false;

    /**
     * 消息
     */
    private String message = "";

    public boolean isEnable() {
        return enable;
    }

    public void setEnable(boolean enable) {
        this.enable = enable;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
