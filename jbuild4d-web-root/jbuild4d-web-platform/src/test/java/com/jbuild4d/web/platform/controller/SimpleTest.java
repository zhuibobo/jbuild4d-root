package com.jbuild4d.web.platform.controller;

import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import org.junit.Test;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/6
 * To change this template use File | Settings | File Templates.
 */
public class SimpleTest {

    @Test
    public void a(){
        Pattern p=Pattern.compile("[a-z]*");
        Matcher m=p.matcher("ID");

        while (m.find()) {
            System.out.println("dou"+m.group());
        }

        boolean isMatch = Pattern.matches("[a-z]*", "Sex");
        System.out.println("字符串中是否包含了小写子字符串? " + isMatch);
    }
}
