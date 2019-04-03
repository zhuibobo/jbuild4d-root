package com.jbuild4d.platform.builder.htmldesign.impl;

import com.jbuild4d.base.tools.XMLUtility;
import com.jbuild4d.platform.builder.htmldesign.IDesignThemesService;
import com.jbuild4d.platform.builder.vo.DesignThemeConfigVo;
import com.jbuild4d.platform.builder.vo.DesignThemeVo;

import javax.xml.bind.JAXBException;
import java.io.InputStream;
import java.util.List;

public class DesignThemesServiceImpl implements IDesignThemesService {

    @Override
    public List<DesignThemeVo> getDesignThemeList() throws JAXBException {
        InputStream is = getClass().getResourceAsStream("/builder/htmldesign/DesignThemesConfig.xml");
        return XMLUtility.toObject(is, DesignThemeConfigVo.class).getThemes();
    }
}
