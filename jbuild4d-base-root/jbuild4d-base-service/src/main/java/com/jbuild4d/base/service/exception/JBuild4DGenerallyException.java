package com.jbuild4d.base.service.exception;

public class JBuild4DGenerallyException extends JBuild4DBaseException {

    static int defaultCode=0;

    public JBuild4DGenerallyException(String message) {
        super(defaultCode, message);
    }

    public JBuild4DGenerallyException(int errorCode, String message) {
        super(errorCode, message);
    }

    public JBuild4DGenerallyException(int errorCode, String message, Throwable cause) {
        super(errorCode, message, cause);
    }
}
