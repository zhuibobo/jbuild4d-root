package com.jbuild4d.platform.builder.vo;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/2/11
 * To change this template use File | Settings | File Templates.
 */
public class FlowModelerConfigVo {
    private String baseUrl;
    private String modelRest;
    private String importModelRest;
    private String modelDesignView;

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String getModelRest() {
        return modelRest;
    }

    public void setModelRest(String modelRest) {
        this.modelRest = modelRest;
    }

    public String getModelDesignView() {
        return modelDesignView;
    }

    public void setModelDesignView(String modelDesignView) {
        this.modelDesignView = modelDesignView;
    }

    public String getImportModelRest() {
        return importModelRest;
    }

    public void setImportModelRest(String importModelRest) {
        this.importModelRest = importModelRest;
    }
}
