package com.jbuild4d.test.web.platform.tools;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jbuild4d.base.tools.JsonUtility;
import com.jbuild4d.platform.builder.vo.DesignThemeConfigVo;
import org.junit.Test;
import springfox.documentation.spring.web.json.Json;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import java.io.FileReader;
import java.io.InputStream;
import java.io.StringWriter;

public class XMLBindTest {

    @Test
    public void Test() throws JsonProcessingException {
        //Object xmlObject = null;
        try {
            JAXBContext context = JAXBContext.newInstance(DesignThemeConfigVo.class);
            Unmarshaller unmarshaller = context.createUnmarshaller();
            FileReader fr = null;
            InputStream is = getClass().getResourceAsStream("/builder/htmldesign/DesignThemesConfig.xml");
            DesignThemeConfigVo configVo = (DesignThemeConfigVo) unmarshaller.unmarshal(is);
            System.out.println(JsonUtility.toObjectString(configVo));

            Marshaller jaxbMarshaller = context.createMarshaller();
            jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
            StringWriter sw = new StringWriter();
            jaxbMarshaller.marshal(configVo, sw);
            String xmlContent = sw.toString();
            System.out.println( xmlContent );


        } catch (JAXBException e) {
            e.printStackTrace();
        }
    }
}
