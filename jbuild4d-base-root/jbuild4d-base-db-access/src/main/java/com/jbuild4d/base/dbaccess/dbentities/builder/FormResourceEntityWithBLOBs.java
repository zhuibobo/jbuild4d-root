package com.jbuild4d.base.dbaccess.dbentities.builder;

import java.util.Date;

/**
 *
 * This class was generated by MyBatis Generator.
 * This class corresponds to the database table tb4d_form_resource
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class FormResourceEntityWithBLOBs extends FormResourceEntity {
    //FORM_IS_RESOLVE
    private String formIsResolve;

    //FORM_HTML_SOURCE
    private String formHtmlSource;

    //FORM_HTML_RESOLVE
    private String formHtmlResolve;

    //FORM_JS_CONTENT
    private String formJsContent;

    //FORM_CSS_CONTENT
    private String formCssContent;

    //FORM_CONFIG_CONTENT
    private String formConfigContent;

    public FormResourceEntityWithBLOBs(String formId, String formName, String formSingleName, Date formCreateTime, String formCreater, Date formUpdateTime, String formUpdater, String formType, String formIssystem, Integer formOrderNum, String formDesc, String formModuleId, String formStatus, String formOrganId, String formOrganName, String formMainTableId, String formMainTableName, String formMainTableCaption, String formDataRelation, String formIsTemplate, String formContentUrl, String formIsResolve, String formHtmlSource, String formHtmlResolve, String formJsContent, String formCssContent, String formConfigContent) {
        super(formId, formName, formSingleName, formCreateTime, formCreater, formUpdateTime, formUpdater, formType, formIssystem, formOrderNum, formDesc, formModuleId, formStatus, formOrganId, formOrganName, formMainTableId, formMainTableName, formMainTableCaption, formDataRelation, formIsTemplate, formContentUrl);
        this.formIsResolve = formIsResolve;
        this.formHtmlSource = formHtmlSource;
        this.formHtmlResolve = formHtmlResolve;
        this.formJsContent = formJsContent;
        this.formCssContent = formCssContent;
        this.formConfigContent = formConfigContent;
    }

    public FormResourceEntityWithBLOBs() {
        super();
    }

    public String getFormIsResolve() {
        return formIsResolve;
    }

    public void setFormIsResolve(String formIsResolve) {
        this.formIsResolve = formIsResolve == null ? null : formIsResolve.trim();
    }

    public String getFormHtmlSource() {
        return formHtmlSource;
    }

    public void setFormHtmlSource(String formHtmlSource) {
        this.formHtmlSource = formHtmlSource == null ? null : formHtmlSource.trim();
    }

    public String getFormHtmlResolve() {
        return formHtmlResolve;
    }

    public void setFormHtmlResolve(String formHtmlResolve) {
        this.formHtmlResolve = formHtmlResolve == null ? null : formHtmlResolve.trim();
    }

    public String getFormJsContent() {
        return formJsContent;
    }

    public void setFormJsContent(String formJsContent) {
        this.formJsContent = formJsContent == null ? null : formJsContent.trim();
    }

    public String getFormCssContent() {
        return formCssContent;
    }

    public void setFormCssContent(String formCssContent) {
        this.formCssContent = formCssContent == null ? null : formCssContent.trim();
    }

    public String getFormConfigContent() {
        return formConfigContent;
    }

    public void setFormConfigContent(String formConfigContent) {
        this.formConfigContent = formConfigContent == null ? null : formConfigContent.trim();
    }
}