package com.jbuild4d.core.base.exception;

public class SessionTimeoutException extends JBuild4DRunTimeException {

    public SessionTimeoutException() {
        super(JBuild4DErrorCode.SESSION_TIMEOUT_CODE, JBuild4DErrorCode.SESSION_TIMEOUT_MESSAGE);
    }

}
