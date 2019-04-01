package com.jbuild4d.test.web.platform;

import com.jbuild4d.base.tools.JsonUtility;
import com.jbuild4d.core.base.vo.JBuild4DResponseVo;
import com.jbuild4d.test.web.platform.RestTestBase;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/30
 * To change this template use File | Settings | File Templates.
 */
/*@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration(value = "src/main/webapp")
@ContextHierarchy({
        @ContextConfiguration(name = "parent", classes = RootConfig.class),
        @ContextConfiguration(name = "child", classes = WebConfig.class)})*/
public class InitializationSystemRestTest extends RestTestBase {
    MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @Before
    public void setupMock() throws Exception {
        mockMvc = webAppContextSetup(context).build();
        /*MockHttpServletRequestBuilder requestBuilder =post("/ValidateAccount.do");
        requestBuilder.param("account","1");
        requestBuilder.param("password","1");
        mockMvc.perform(requestBuilder);*/
    }

    @Test
    /*@DisplayName("When zero operands")*/
    public void initializationSystem() throws Exception {
        //context.getServletContext().
        MockHttpServletRequestBuilder requestBuilder =post("/PlatFormRest/InitializationSystem/Running.do?createTestData=true");

        requestBuilder.sessionAttr("JB4DSession",getSession());
        MvcResult result=mockMvc.perform(requestBuilder).andReturn();
        String json=result.getResponse().getContentAsString();
        System.out.println(json);

        JBuild4DResponseVo responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);
        Assert.assertTrue(responseVo.isSuccess());
    }
}
