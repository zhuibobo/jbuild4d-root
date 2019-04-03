package com.jbuild4d.test.web.platform.tools;

import com.jbuild4d.platform.builder.vo.DesignThemesConfigVo;
import org.junit.Test;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.InputStream;
import java.io.InputStreamReader;

public class XMLBindTest {

    @Test
    public void Test(){
        Object xmlObject = null;
        try {
            JAXBContext context = JAXBContext.newInstance(DesignThemesConfigVo.class);
            Unmarshaller unmarshaller = context.createUnmarshaller();
            FileReader fr = null;
            InputStream is = getClass().getResourceAsStream("/builder/htmldesign/DesignThemesConfig.xml");
            xmlObject = unmarshaller.unmarshal(is);
        } catch (JAXBException e) {
            e.printStackTrace();
        }
    }
}
