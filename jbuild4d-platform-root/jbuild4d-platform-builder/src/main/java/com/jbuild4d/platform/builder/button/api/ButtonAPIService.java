package com.jbuild4d.platform.builder.button.api;

import com.jbuild4d.base.tools.XMLUtility;
import com.jbuild4d.platform.builder.vo.ButtonAPIConfigVo;
import com.jbuild4d.platform.builder.vo.ButtonAPIGroupVo;

import javax.xml.bind.JAXBException;
import java.io.InputStream;
import java.util.List;

public class ButtonAPIService {

    public List<ButtonAPIGroupVo> getButtonAPIGroupList() throws JAXBException {
        InputStream is = getClass().getResourceAsStream("/builder/ButtonAPIConfig.xml");
        return XMLUtility.toObject(is, ButtonAPIConfigVo.class).getButtonAPIGroupVoList();
    }
}
