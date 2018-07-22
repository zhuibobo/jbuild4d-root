package com.jbuild4d.base.dbaccess.dbentities;

import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.Date;

public class DevDemoGenListEntity {

    @DBKeyField
    private String ddglId;

    private String ddglKey;

    private String ddglName;

    private String ddglValue;

    private String ddglStatus;

    private String ddglDesc;

    private Date ddglCreatetime;

    private String ddglUserId;

    private String ddglUserName;

    private String ddglOrganId;

    private String ddglOrganName;

    private String ddglApi;

    private Integer ddglOrderNum;

    private BigDecimal ddglInputnumber;

    private String ddglBindDicSelected;

    private String ddglBindDicRadio;

    private String ddglBindDicCheckbox1;

    private String ddglBindDicCheckbox2;

    private String ddglBindDicCheckbox3;

    private String ddglBindDicMucheckbox;

    public DevDemoGenListEntity(String ddglId, String ddglKey, String ddglName, String ddglValue, String ddglStatus, String ddglDesc, Date ddglCreatetime, String ddglUserId, String ddglUserName, String ddglOrganId, String ddglOrganName, String ddglApi, Integer ddglOrderNum, BigDecimal ddglInputnumber, String ddglBindDicSelected, String ddglBindDicRadio, String ddglBindDicCheckbox1, String ddglBindDicCheckbox2, String ddglBindDicCheckbox3, String ddglBindDicMucheckbox) {
        this.ddglId = ddglId;
        this.ddglKey = ddglKey;
        this.ddglName = ddglName;
        this.ddglValue = ddglValue;
        this.ddglStatus = ddglStatus;
        this.ddglDesc = ddglDesc;
        this.ddglCreatetime = ddglCreatetime;
        this.ddglUserId = ddglUserId;
        this.ddglUserName = ddglUserName;
        this.ddglOrganId = ddglOrganId;
        this.ddglOrganName = ddglOrganName;
        this.ddglApi = ddglApi;
        this.ddglOrderNum = ddglOrderNum;
        this.ddglInputnumber = ddglInputnumber;
        this.ddglBindDicSelected = ddglBindDicSelected;
        this.ddglBindDicRadio = ddglBindDicRadio;
        this.ddglBindDicCheckbox1 = ddglBindDicCheckbox1;
        this.ddglBindDicCheckbox2 = ddglBindDicCheckbox2;
        this.ddglBindDicCheckbox3 = ddglBindDicCheckbox3;
        this.ddglBindDicMucheckbox = ddglBindDicMucheckbox;
    }

    public DevDemoGenListEntity() {
        super();
    }

    public String getDdglId() {
        return ddglId;
    }

    public void setDdglId(String ddglId) {
        this.ddglId = ddglId == null ? null : ddglId.trim();
    }

    public String getDdglKey() {
        return ddglKey;
    }

    public void setDdglKey(String ddglKey) {
        this.ddglKey = ddglKey == null ? null : ddglKey.trim();
    }

    public String getDdglName() {
        return ddglName;
    }

    public void setDdglName(String ddglName) {
        this.ddglName = ddglName == null ? null : ddglName.trim();
    }

    public String getDdglValue() {
        return ddglValue;
    }

    public void setDdglValue(String ddglValue) {
        this.ddglValue = ddglValue == null ? null : ddglValue.trim();
    }

    public String getDdglStatus() {
        return ddglStatus;
    }

    public void setDdglStatus(String ddglStatus) {
        this.ddglStatus = ddglStatus == null ? null : ddglStatus.trim();
    }

    public String getDdglDesc() {
        return ddglDesc;
    }

    public void setDdglDesc(String ddglDesc) {
        this.ddglDesc = ddglDesc == null ? null : ddglDesc.trim();
    }

    public Date getDdglCreatetime() {
        return ddglCreatetime;
    }

    public void setDdglCreatetime(Date ddglCreatetime) {
        this.ddglCreatetime = ddglCreatetime;
    }

    public String getDdglUserId() {
        return ddglUserId;
    }

    public void setDdglUserId(String ddglUserId) {
        this.ddglUserId = ddglUserId == null ? null : ddglUserId.trim();
    }

    public String getDdglUserName() {
        return ddglUserName;
    }

    public void setDdglUserName(String ddglUserName) {
        this.ddglUserName = ddglUserName == null ? null : ddglUserName.trim();
    }

    public String getDdglOrganId() {
        return ddglOrganId;
    }

    public void setDdglOrganId(String ddglOrganId) {
        this.ddglOrganId = ddglOrganId == null ? null : ddglOrganId.trim();
    }

    public String getDdglOrganName() {
        return ddglOrganName;
    }

    public void setDdglOrganName(String ddglOrganName) {
        this.ddglOrganName = ddglOrganName == null ? null : ddglOrganName.trim();
    }

    public String getDdglApi() {
        return ddglApi;
    }

    public void setDdglApi(String ddglApi) {
        this.ddglApi = ddglApi == null ? null : ddglApi.trim();
    }

    public Integer getDdglOrderNum() {
        return ddglOrderNum;
    }

    public void setDdglOrderNum(Integer ddglOrderNum) {
        this.ddglOrderNum = ddglOrderNum;
    }

    public BigDecimal getDdglInputnumber() {
        return ddglInputnumber;
    }

    public void setDdglInputnumber(BigDecimal ddglInputnumber) {
        this.ddglInputnumber = ddglInputnumber;
    }

    public String getDdglBindDicSelected() {
        return ddglBindDicSelected;
    }

    public void setDdglBindDicSelected(String ddglBindDicSelected) {
        this.ddglBindDicSelected = ddglBindDicSelected == null ? null : ddglBindDicSelected.trim();
    }

    public String getDdglBindDicRadio() {
        return ddglBindDicRadio;
    }

    public void setDdglBindDicRadio(String ddglBindDicRadio) {
        this.ddglBindDicRadio = ddglBindDicRadio == null ? null : ddglBindDicRadio.trim();
    }

    public String getDdglBindDicCheckbox1() {
        return ddglBindDicCheckbox1;
    }

    public void setDdglBindDicCheckbox1(String ddglBindDicCheckbox1) {
        this.ddglBindDicCheckbox1 = ddglBindDicCheckbox1 == null ? null : ddglBindDicCheckbox1.trim();
    }

    public String getDdglBindDicCheckbox2() {
        return ddglBindDicCheckbox2;
    }

    public void setDdglBindDicCheckbox2(String ddglBindDicCheckbox2) {
        this.ddglBindDicCheckbox2 = ddglBindDicCheckbox2 == null ? null : ddglBindDicCheckbox2.trim();
    }

    public String getDdglBindDicCheckbox3() {
        return ddglBindDicCheckbox3;
    }

    public void setDdglBindDicCheckbox3(String ddglBindDicCheckbox3) {
        this.ddglBindDicCheckbox3 = ddglBindDicCheckbox3 == null ? null : ddglBindDicCheckbox3.trim();
    }

    public String getDdglBindDicMucheckbox() {
        return ddglBindDicMucheckbox;
    }

    public void setDdglBindDicMucheckbox(String ddglBindDicMucheckbox) {
        this.ddglBindDicMucheckbox = ddglBindDicMucheckbox == null ? null : ddglBindDicMucheckbox.trim();
    }
}