package com.jbuild4d.test.web.platform;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.tools.common.JsonUtility;
import com.jbuild4d.web.Application;
import com.jbuild4d.web.platform.beanconfig.sys.RootConfig;
import com.jbuild4d.web.platform.beanconfig.sys.WebConfig;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.ContextHierarchy;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.web.context.WebApplicationContext;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/30
 * To change this template use File | Settings | File Templates.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration(value = "src/main/webapp")
/*@ContextHierarchy({
        @ContextConfiguration(name = "parent", classes = RootConfig.class),
        @ContextConfiguration(name = "child", classes = WebConfig.class)})*/
@SpringBootTest(classes = Application.class)
public class RestTestBase {

    public MockMvc mockMvc;

    @Autowired
    public WebApplicationContext context;

    @Before
    public void setupMock() throws Exception {
        mockMvc = webAppContextSetup(context).build();
    }

    public JB4DSession getSession(){
        JB4DSession b4DSession = new JB4DSession();
        b4DSession.setOrganName("4D");
        b4DSession.setOrganId("OrganId");
        b4DSession.setUserName("Alex");
        b4DSession.setUserId("UserId");
        return b4DSession;
    }

    public JBuild4DResponseVo simpleDelete(String url,String recordId) throws Exception {
        MockHttpServletRequestBuilder requestDeleteBuilder = delete(url);
        requestDeleteBuilder.contentType(MediaType.APPLICATION_JSON_UTF8);
        requestDeleteBuilder.sessionAttr("JB4DSession", getSession());

        requestDeleteBuilder.param("recordId",recordId);
        MvcResult result = mockMvc.perform(requestDeleteBuilder).andReturn();
        String json = result.getResponse().getContentAsString();
        JBuild4DResponseVo responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);
        return responseVo;
    }

    public JBuild4DResponseVo simpleSaveEdit(String url,Object entity) throws Exception {
        MockHttpServletRequestBuilder requestPostBuilder = post(url);
        requestPostBuilder.contentType(MediaType.APPLICATION_JSON_UTF8);
        requestPostBuilder.sessionAttr("JB4DSession", getSession());
        requestPostBuilder.content(JsonUtility.toObjectString(entity));
        MvcResult result = mockMvc.perform(requestPostBuilder).andReturn();
        String json = result.getResponse().getContentAsString();
        JBuild4DResponseVo responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);
        return responseVo;
    }
}
