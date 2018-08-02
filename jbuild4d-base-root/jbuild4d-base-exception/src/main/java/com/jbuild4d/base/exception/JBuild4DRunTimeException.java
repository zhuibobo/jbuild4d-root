package com.jbuild4d.base.exception;

public class JBuild4DRunTimeException extends RuntimeException  {

    /**
     * 错误码
     */
    private Integer errorCode;

    public JBuild4DRunTimeException(String message) {
        super(message);
    }

    public JBuild4DRunTimeException(Integer errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public JBuild4DRunTimeException(String message, Throwable cause) {
        super(message, cause);
    }

    public JBuild4DRunTimeException(Integer errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public Integer getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(Integer errorCode) {
        this.errorCode = errorCode;
    }

    @Override
    public String toString() {
        return (errorCode != null ? "errorCode: " + errorCode + ", " : "") + super.toString();
    }


}
