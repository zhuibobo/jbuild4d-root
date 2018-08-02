package com.jbuild4d.base.exception;

public class JBuild4DBaseException extends Exception {
    /**
     * 错误码
     */
    private Integer errorCode;

    public JBuild4DBaseException(int errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public JBuild4DBaseException(int errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public int getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(int errorCode) {
        this.errorCode = errorCode;
    }

    @Override
    public String toString() {
        return "errorCode: " + errorCode + ", " + super.toString();
    }
}
