package com.jbuild4d.sso.client.extend;

import com.jbuild4d.core.base.session.JB4DSession;

import javax.servlet.FilterChain;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

public interface ICheckSessionSuccess {
    public void run(ServletRequest request, ServletResponse response, FilterChain chain, JB4DSession jb4DSession);
}
