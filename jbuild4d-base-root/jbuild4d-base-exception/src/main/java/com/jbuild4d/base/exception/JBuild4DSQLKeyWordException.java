package com.jbuild4d.base.exception;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/2
 * To change this template use File | Settings | File Templates.
 */
public class JBuild4DSQLKeyWordException extends JBuild4DBaseException {

    static int defaultCode=100001;

    public JBuild4DSQLKeyWordException(String message) {
        super(defaultCode, message);
    }

    public JBuild4DSQLKeyWordException(int errorCode, String message) {
        super(errorCode, message);
    }

    public JBuild4DSQLKeyWordException(int errorCode, String message, Throwable cause) {
        super(errorCode, message, cause);
    }
}
