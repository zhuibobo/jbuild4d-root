package com.jbuild4d.platform.builder.vo;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/2/11
 * To change this template use File | Settings | File Templates.
 */
public class FlowModelerConfigVo {
    private String baseUrl;
    private String newModelRest;
    private String modelDesignView;

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String getNewModelRest() {
        return newModelRest;
    }

    public void setNewModelRest(String newModelRest) {
        this.newModelRest = newModelRest;
    }

    public String getModelDesignView() {
        return modelDesignView;
    }

    public void setModelDesignView(String modelDesignView) {
        this.modelDesignView = modelDesignView;
    }
}
