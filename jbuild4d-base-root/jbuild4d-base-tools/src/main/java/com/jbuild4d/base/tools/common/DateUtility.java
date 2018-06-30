package com.jbuild4d.base.tools.common;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtility {
    /**
     * 星期数组
     */
    public String[] weekDays_CN = new String[]{"日",
            "一", "二", "三", "四", "五", "六"};

    /**
     * 星期数组
     */
    public String[] weekDays_EN = new String[]{"sun",
            "mon",  "tue", "wed", "thu", "fri", "sat"};

    /**
     * 获取当前年
     * @return
     */
    public int getYear() {
        Calendar cal = Calendar.getInstance();
        return cal.get(Calendar.YEAR);
    }

    /**
     * 获取当前月
     * @return
     */
    public int getMonth() {
        Calendar cal = Calendar.getInstance();
        return cal.get(Calendar.MONTH);
    }

    /**
     * 获取当前日期
     * @return
     */
    public int getDayOfMonth() {
        Calendar cal = Calendar.getInstance();
        return cal.get(Calendar.DAY_OF_MONTH);
    }

    /**
     * 获取星期
     * @return
     */
    public int getDayOfWeek() {
        Calendar cal = Calendar.getInstance();
        return cal.get(Calendar.DAY_OF_WEEK);
    }

    /**
     * 获取星期
     * @return
     */
    public String getDayOfWeek_CN() {
        Calendar cal = Calendar.getInstance();
        return weekDays_CN[cal.get(Calendar.DAY_OF_WEEK) - 1];
    }

    /**
     * 获取星期 英文省略
     * @param date
     * @return
     */
    public String getDayOfWeek_EN(Date date) {
        Calendar cal = Calendar.getInstance();
        if(null != date)
            cal.setTime(date);
        return weekDays_EN[cal.get(Calendar.DAY_OF_WEEK) - 1];
    }

    /**
     * 获取8位12小时制的时间
     * @return
     */
    public String getTime_hh_mm_ss() {
        String sz10LenTime;
        Date date =  new Date();
        SimpleDateFormat formater = new SimpleDateFormat();
        formater.applyPattern("hh:mm:ss");
        sz10LenTime = formater.format(date);
        return sz10LenTime;
    }

    /**
     * 转为位8位12小时制的时间
     * @param date
     * @return
     */
    public String getTime_hh_mm_ss(Date date) {
        String sz10LenTime;
        SimpleDateFormat formater = new SimpleDateFormat();
        formater.applyPattern("hh:mm:ss");
        sz10LenTime = formater.format(date);
        return sz10LenTime;
    }

    /**
     * 转为位8位24小时制的时间
     * @param date
     * @return
     */
    public String getTime_HH_mm_ss(Date date) {
        String sz10LenDate;
        SimpleDateFormat formater = new SimpleDateFormat();
        formater.applyPattern("HH:mm:ss");
        sz10LenDate = formater.format(date);
        return sz10LenDate;
    }

    /**
     * 获取8位24小时制的时间
     * @return
     */
    public String getTime_HH_mm_ss() {
        String sz10LenDate;
        Date date =  new Date();
        SimpleDateFormat formater = new SimpleDateFormat();
        formater.applyPattern("HH:mm:ss");
        sz10LenDate = formater.format(date);
        return sz10LenDate;
    }

    /**
     * 获取8位格式日期
     * @return
     */
    public String getDate_yyyyMMdd() {
        String sz8LenDate;
        Date date = new Date();
        SimpleDateFormat formater=new SimpleDateFormat();
        formater.applyPattern("yyyyMMdd");
        sz8LenDate = formater.format(date);
        return sz8LenDate;
    }

    /**
     * 转化为8位的格式日期
     * @param date
     * @return
     */
    public String getDate_yyyyMMdd(Date date) {
        String sz8LenDate;
        SimpleDateFormat formater=new SimpleDateFormat();
        formater.applyPattern("yyyyMMdd");
        sz8LenDate = formater.format(date);
        return sz8LenDate;
    }

    /**
     * 获取10位格式的日期
     * @return
     */
    public String getDate_yyyy_MM_dd() {
        String sz10LenDate;
        Date date =  new Date();

        SimpleDateFormat formater=new SimpleDateFormat();
        formater.applyPattern("yyyy-MM-dd");
        sz10LenDate = formater.format(date);
        return sz10LenDate;
    }

    /**
     * 转化为10位格式的日期
     * @param date
     * @return
     */
    public String getDate_yyyy_MM_dd(Date date) {
        String sz10LenDate;
        SimpleDateFormat formater=new SimpleDateFormat();
        formater.applyPattern("yyyy-MM-dd");
        sz10LenDate = formater.format(date);
        return sz10LenDate;
    }

    /**
     * 获取yyyy-MM-dd HH:mm:ss
     * @return
     */
    public String getDate_yyyy_MM_dd_HH_mm_ss() {
        String sz10LenDate;
        Date date =  new Date();
        SimpleDateFormat formater=new SimpleDateFormat();
        formater.applyPattern("yyyy-MM-dd HH:mm:ss");
        sz10LenDate = formater.format(date);
        return sz10LenDate;
    }

    /**
     * 获取yyyy-MM-dd HH:mm:ss
     * @return
     */
    public String getDate_yyyy_MM_dd_HH_mm_ss_SSS() {
        String LenDate;
        Date date =  new Date();
        SimpleDateFormat formater=new SimpleDateFormat();
        formater.applyPattern("yyyy-MM-dd HH:mm:ss.SSS");
        LenDate = formater.format(date);
        return LenDate;
    }

    /**
     * 获取yyyy-MM-dd HH:mm:ss
     * @return
     */
    public String getDate_yyyyMMddHHmmssSSS() {
        String LenDate;
        Date date =  new Date();
        SimpleDateFormat formater=new SimpleDateFormat();
        formater.applyPattern("yyyyMMddHHmmssSSS");
        LenDate = formater.format(date);
        return LenDate;
    }
}
