drop database `jbuild4d_v04`;
CREATE DATABASE  `jbuild4d_v04` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

/*-----------------------------------------开发适用DEMO-----------------------------------------*/
DROP TABLE IF EXISTS `TDEV_DEMO_GEN_LIST`;
CREATE TABLE `TDEV_DEMO_GEN_LIST` (
  `DDGL_ID`                  NVARCHAR(128)  NOT NULL COMMENT '主键',
  `DDGL_KEY`                 NVARCHAR(128)  NULL,
  `DDGL_NAME`                NVARCHAR(128)  NULL,
  `DDGL_VALUE`               NVARCHAR(500)  NULL,
  `DDGL_STATUS`              NVARCHAR(10)   NULL,
  `DDGL_DESC`                NVARCHAR(2000)  NULL,
  `DDGL_CREATETIME`          DATETIME       NULL,
  `DDGL_USER_ID`             NVARCHAR(100)  NULL,
  `DDGL_USER_NAME`           NVARCHAR(100)  NULL,
  `DDGL_ORGAN_ID`            NVARCHAR(100)  NULL,
  `DDGL_ORGAN_NAME`          NVARCHAR(100)  NULL,
  `DDGL_API`                 NVARCHAR(100)  NULL,
  `DDGL_ORDER_NUM`           INT           NULL,
  `DDGL_INPUTNUMBER`         DECIMAL(18, 2) NULL,
  `DDGL_BIND_DIC_SELECTED`   NVARCHAR(100)  NULL,
  `DDGL_BIND_DIC_RADIO`      NVARCHAR(100)  NULL,
  `DDGL_BIND_DIC_CHECKBOX1`  NVARCHAR(100)  NULL,
  `DDGL_BIND_DIC_CHECKBOX2`  NVARCHAR(100)  NULL,
  `DDGL_BIND_DIC_CHECKBOX3`  NVARCHAR(100)  NULL,
  `DDGL_BIND_DIC_MUCHECKBOX` NVARCHAR(1000) NULL,
  PRIMARY KEY (`DDGL_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='开发demo-一般通用列表';

DROP TABLE IF EXISTS `TDEV_DEMO_TREE_TABLE`;
CREATE TABLE `TDEV_DEMO_TREE_TABLE` (
  `DDTT_ID`                       NVARCHAR(128)  NOT NULL,
  `DDTT_KEY`                      NVARCHAR(128)  NULL,
  `DDTT_NAME`                     NVARCHAR(128)  NULL,
  `DDTT_VALUE`                    NVARCHAR(500)  NULL,
  `DDTT_STATUS`                   NVARCHAR(10)   NULL,
  `DDTT_DESC`                     NVARCHAR(2000) NULL,
  `DDTT_CREATETIME`               DATETIME       NULL,
  `DDTT_ORDER_NUM`                INT            NULL,
  `DDTT_BIND_DIC_SELECTED`        NVARCHAR(100)  NULL,
  `DDTT_BIND_DIC_RADIO`           NVARCHAR(100)  NULL,
  `DDTT_DDTT_BIND_DIC_MUCHECKBOX` NVARCHAR(1000) NULL,
  `DDTT_PARENT_ID`                NVARCHAR(100)  NULL,
  `DDTT_PARENT_IDLIST`            NVARCHAR(1200) NULL,
  `DDTT_CHILD_COUNT`              INT            NULL,
  PRIMARY KEY(`DDTT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='开发demo-一般通用树形表格';

DROP TABLE IF EXISTS `TDEV_DEMO_TL_TREE`;
CREATE TABLE `TDEV_DEMO_TL_TREE` (
  `DDTT_ID`                       NVARCHAR(128)  NOT NULL,
  `DDTT_KEY`                      NVARCHAR(128)  NULL,
  `DDTT_NAME`                     NVARCHAR(128)  NULL,
  `DDTT_VALUE`                    NVARCHAR(500)  NULL,
  `DDTT_STATUS`                   NVARCHAR(10)   NULL,
  `DDTT_DESC`                     NVARCHAR(2000)  NULL,
  `DDTT_CREATETIME`               DATETIME       NULL,
  `DDTT_ORDER_NUM`                INT            NULL,
  `DDTT_PARENT_ID`                NVARCHAR(100)  NULL,
  `DDTT_PARENT_IDLIST`            NVARCHAR(1200) NULL,
  `DDTT_CHILD_COUNT`              INT            NULL,
  PRIMARY KEY(`DDTT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='开发demo-一般通用树与列表-树';

DROP TABLE IF EXISTS `TDEV_DEMO_TL_TREE_LIST`;
CREATE TABLE `TDEV_DEMO_TL_TREE_LIST` (
  `DDTL_ID`                       NVARCHAR(128)  NOT NULL,
  `DDTL_GROUP_ID`                 NVARCHAR(128)  NULL,
  `DDTL_KEY`                      NVARCHAR(128)  NULL,
  `DDTL_NAME`                     NVARCHAR(128)  NULL,
  `DDTL_VALUE`                    NVARCHAR(500)  NULL,
  `DDTL_STATUS`                   NVARCHAR(10)   NULL,
  `DDTL_DESC`                     NVARCHAR(2000)  NULL,
  `DDTL_CREATETIME`               DATETIME       NULL,
  `DDTL_ORDER_NUM`                INT            NULL,
  `DDTL_BIND_DIC_SELECTED`        NVARCHAR(100)  NULL,
  `DDTL_BIND_DIC_RADIO`           NVARCHAR(100)  NULL,
  `DDTL_DDTT_BIND_DIC_MUCHECKBOX` NVARCHAR(1000) NULL,
  PRIMARY KEY(`DDTL_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='开发demo-一般通用树与列表-列表';

/*-----------------------------------------系统设置表-----------------------------------------*/
DROP TABLE IF EXISTS `TSYS_SETTING`;
CREATE TABLE `TSYS_SETTING` (
  `SETTING_ID`         NVARCHAR(128) NOT NULL,
  `SETTING_KEY`        NVARCHAR(128) NULL,
  `SETTING_NAME`       NVARCHAR(128) NULL,
  `SETTING_VALUE`      NVARCHAR(500) NULL,
  `SETTING_STATUS`     NVARCHAR(10)  NULL,
  `SETTING_DESC`       NVARCHAR(2000) NULL,
  `SETTING_CREATETIME` DATETIME      NULL,
  `SETTING_USER_ID`    NVARCHAR(100) NULL,
  `SETTING_USER_NAME`  NVARCHAR(100) NULL,
  `SETTING_ORGAN_ID`   NVARCHAR(100) NULL,
  `SETTING_ORGAN_NAME` NVARCHAR(100) NULL,
  `SETTING_API`        NVARCHAR(100) NULL,
  `SETTING_IS_SYSTEM`  NVARCHAR(10)  NULL,
   PRIMARY KEY(`SETTING_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='基础设置-系统设置';

/*-----------------------------------------菜单表-----------------------------------------*/
DROP TABLE IF EXISTS `TSYS_MENU`;
CREATE TABLE `TSYS_MENU` (
  `MENU_ID`                  NVARCHAR(100)  NOT NULL,
  `MENU_NAME`                NVARCHAR(100)  NULL,
  `MENU_TEXT`                NVARCHAR(100)  NOT NULL,
  `MENU_VALUE`               NVARCHAR(100)  NULL,
  `MENU_TYPE`                NVARCHAR(100)  NOT NULL,
  `MENU_USER_ID`             NVARCHAR(100)  NULL,
  `MENU_USER_NAME`           NVARCHAR(100)  NULL,
  `MENU_ORGAN_ID`            NVARCHAR(100)  NULL,
  `MENU_ORGAN_NAME`          NVARCHAR(100)  NULL,
  `MENU_IS_EXPAND`           NVARCHAR(10)   NULL,
  `MENU_IS_SYSTEM`           NVARCHAR(10)   NULL,
  `MENU_LEFT_URL`            NVARCHAR(600)  NULL,
  `MENU_LEFT_URL_PARA`       NVARCHAR(600)  NULL,
  `MENU_RIGHT_URL`           NVARCHAR(800)  NULL,
  `MENU_RIGHT_URL_PARA`      NVARCHAR(600)  NULL,
  `MENU_ORDER_NUM`           INT             NULL,
  `MENU_PARENT_ID`           NVARCHAR(100)  NOT NULL,
  `MENU_PARENT_ID_LIST`      NVARCHAR(1200) NOT NULL,
  `MENU_TARGET`              NVARCHAR(100)  NULL,
  `MENU_CREATOR`             NVARCHAR(200)  NULL,
  `MENU_CREATE_TIME`         DATETIME       NULL,
  `MENU_UPDATER`             NVARCHAR(200)  NULL,
  `MENU_UPDATE_TIME`         DATETIME       NULL,
  `MENU_USE_ORGAN_NAME`      NVARCHAR(500)  NULL,
  `MENU_USE_ORGAN_ID`        NVARCHAR(500)  NULL,
  `MENU_USE_ORGAN_TYPE_NAME` NVARCHAR(500)  NULL,
  `MENU_USE_ORGAN_TYPE_ID`   NVARCHAR(500)  NULL,
  `MENU_CLASS_NAME`          NVARCHAR(100)  NULL,
  `MENU_CLASS_NAME_HOVER`    NVARCHAR(100)  NULL,
  `MENU_CLASS_NAME_SELECTED` NVARCHAR(100)  NULL,
  `MENU_MENU_CHILD_COUNT`    INT            NULL,
  `MENU_MENU_DESCRIPTION`    NVARCHAR(1000)  NULL,
  `MENU_JS_EXPRESSION`       NVARCHAR(2000) NULL,
  PRIMARY KEY (`MENU_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='基础设置-菜单';

/*-----------------------------------------组织机构类型表-----------------------------------------*/
DROP TABLE IF EXISTS `TSSO_ORGAN_TYPE`;
CREATE TABLE `TSSO_ORGAN_TYPE` (
  `ORGAN_TYPE_ID`    NVARCHAR(100) NOT NULL,
  `ORGAN_TYPE_VALUE` NVARCHAR(300) NOT NULL,
  `ORGAN_TYPE_NAME`  NVARCHAR(300) NOT NULL,
  `ORGAN_TYPE_DESC`  NVARCHAR(2000) NULL,
  PRIMARY KEY (`ORGAN_TYPE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='基础设置-组织机构类型';

/*-----------------------------------------组织机构表-----------------------------------------*/
DROP TABLE IF EXISTS `TSSO_ORGAN`;
CREATE TABLE `TSSO_ORGAN` (
  `ORGAN_ID`               NVARCHAR(100)  NOT NULL,
  `ORGAN_NAME`             NVARCHAR(300)  NOT NULL,
  `ORGAN_NO`               NVARCHAR(200)  NULL,
  `ORGAN_CODE`             NVARCHAR(200)  NULL,
  `ORGAN_CREATE_TIME`      DATETIME       NULL,
  `ORGAN_PHONE`            NVARCHAR(100)  NULL,
  `ORGAN_POST`             NVARCHAR(20)   NULL,
  `ORGAN_TYPE_VALUE`       NVARCHAR(50)   NULL,
  `ORGAN_ADDRESS`          NVARCHAR(1000) NULL,
  `ORGAN_CONTACTOR`        NVARCHAR(100)  NULL,
  `ORGAN_CONTACTOR_MOBILE` NVARCHAR(100)  NULL,
  `ORGAN_DOMAIN`           NVARCHAR(300)  NULL,
  `ORGAN_FAX`              NVARCHAR(100)  NULL,
  `ORGAN_CHILD_COUNT`      INT            NULL,
  `ORGAN_IS_VIRTUAL`       NVARCHAR(10)   NULL,
  `ORGAN_ORDER_NUM`        INT            NULL,
  `ORGAN_PARENT_ID`        NVARCHAR(100)  NULL,
  `ORGAN_PARENT_ID_LIST`   NVARCHAR(1200) NULL,
  `ORGAN_SHORT_NAME`       NVARCHAR(150)  NULL,
  `ORGAN_STATUS`           NVARCHAR(10)   NULL,
  `ORGAN_CREATRE_ORG_ID`   NVARCHAR(100)  NULL,
  `ORGAN_OUTER_ID`         NVARCHAR(100)  NULL,
  `ORGAN_OUTER_TYPE`       NVARCHAR(100)  NULL,
  PRIMARY KEY (`ORGAN_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='基础设置-组织机构类型';

/*-----------------------------------------数据字典表-----------------------------------------*/
DROP TABLE IF EXISTS `TSYS_DICTIONARY_GROUP`;
CREATE TABLE `TSYS_DICTIONARY_GROUP` (
  `DICT_GROUP_ID`          NVARCHAR(100) NOT NULL,
  `DICT_GROUP_VALUE`       NVARCHAR(200) NOT NULL,
  `DICT_GROUP_TEXT`        NVARCHAR(200) NOT NULL,
  `DICT_GROUP_ORDER_NUM`   INT           NULL,
  `DICT_GROUP_CREATE_TIME` DATETIME      NULL,
  `DICT_GROUP_DESC`        NVARCHAR(500) NULL,
  `DICT_GROUP_STATUS`      NVARCHAR(10)  NULL,
  `DICT_GROUP_PARENT_ID`   NVARCHAR(100) NULL,
  `DICT_GROUP_ISSYSTEM`    NVARCHAR(10)  NULL,
  `DICT_GROUP_DEL_ENABLE`  NVARCHAR(10)  NULL,
  `DICT_GROUP_ENP_ITEM`    NVARCHAR(10)  NULL,
  PRIMARY KEY (`DICT_GROUP_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='基础设置-数据字典分组';

DROP TABLE IF EXISTS `TSYS_DICTIONARY`;
CREATE TABLE `TSYS_DICTIONARY` (
  `DICT_ID`            NVARCHAR(100)  NOT NULL,
  `DICT_KEY`           NVARCHAR(200)  NOT NULL,
  `DICT_VALUE`         NVARCHAR(200)  NOT NULL,
  `DICT_TEXT`          NVARCHAR(200)  NOT NULL,
  `DICT_GROUP_ID`      NVARCHAR(100)  NOT NULL,
  `DICT_ORDER_NUM`     INT            NULL,
  `DICT_CREATE_TIME`   DATETIME       NULL,
  `DICT_PARENT_ID`     NVARCHAR(100)  NULL,
  `DICT_PARENT_IDLIST` NVARCHAR(1200) NULL,
  `DICT_ISSYSTEM`      NVARCHAR(10)   NULL,
  `DICT_DEL_ENABLE`    NVARCHAR(10)   NULL,
  `DICT_STATUS`        NVARCHAR(10)   NULL,
  `DICT_IS_SELECTED`   NVARCHAR(10)   NULL,
  `DICT_DESC`          NVARCHAR(500)  NULL,
  `DICT_CHILD_COUNT`   INT            NULL,
  `DICT_EX_ATTR1`      NVARCHAR(500)  NULL,
  `DICT_EX_ATTR2`      NVARCHAR(500)  NULL,
  `DICT_EX_ATTR3`      NVARCHAR(500)  NULL,
  `DICT_EX_ATTR4`      NVARCHAR(500)  NULL,
  `DICT_USER_ID`       NVARCHAR(100)  NULL,
  `DICT_USER_NAME`     NVARCHAR(100)  NULL,
  `DICT_ORGAN_ID`      NVARCHAR(100)  NULL,
  `DICT_ORGAN_NAME`    NVARCHAR(100)  NULL,
  PRIMARY KEY (`DICT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='基础设置-数据字典';

/*-----------------------------------------操作日志表-----------------------------------------*/
DROP TABLE IF EXISTS `TSYS_OPERATION_LOG`;
CREATE TABLE TSYS_OPERATION_LOG (
  `LOG_ID`          NVARCHAR(100)  NOT NULL,
  `LOG_TEXT`        NVARCHAR(2000) NOT NULL,
  `LOG_ORDER_NUM`   INT             NULL,
  `LOG_CREATE_TIME` DATETIME       NULL,
  `LOG_SYSTEM_NAME` NVARCHAR(200)  NULL,
  `LOG_MODULE_NAME` NVARCHAR(200)  NULL,
  `LOG_ACTION_NAME` NVARCHAR(200)  NULL,
  `LOG_DATA`        TEXT  NULL,
  `LOG_USER_ID`     NVARCHAR(100)  NULL,
  `LOG_USER_NAME`   NVARCHAR(100)  NULL,
  `LOG_ORGAN_ID`    NVARCHAR(100)  NULL,
  `LOG_ORGAN_NAME`  NVARCHAR(100)  NULL,
  `LOG_IP`          NVARCHAR(100)  NULL,
  `LOG_TYPE`        NVARCHAR(100)  NULL,
  `LOG_CLASS_NAME`  NVARCHAR(200)  NULL,
  `LOG_STATUS`      NVARCHAR(50)  NULL,
  PRIMARY KEY (`LOG_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='基础设置-操作日志表';


/*-----------------------------------------缓存版本表-----------------------------------------*/
DROP TABLE IF EXISTS `TSYS_JB4D_CACHE`;
CREATE TABLE TSYS_JB4D_CACHE (
  `CACHE_ID`        NVARCHAR(100) NOT NULL,
  `CACHE_KEY`       NVARCHAR(200) NOT NULL,
  `CACHE_NAME`      NVARCHAR(200) NOT NULL,
  `CACHE_DESC`      NVARCHAR(500) NULL,
  `CACHE_ORDER_NUM` INT           NULL,
  `CACHE_STATUS`    NVARCHAR(50)  NULL,
  `CACHE_IS_GLOBAL` NVARCHAR(50)  NULL,
  `CACHE_USER_ID`   NVARCHAR(50)  NULL,
  `CACHE_MODE`      NVARCHAR(50)  NULL,
  `CACHE_VERSION`   INT           NULL,
  PRIMARY KEY (`CACHE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='基础设置-缓存版本表';

/*-----------------------------------------应用设计相关表--开始-----------------------------------------*/

/*-----------------------------------------服务连接表-----------------------------------------*/
DROP TABLE IF EXISTS `TBUILD_SERVICE_LINK`;
CREATE TABLE `TBUILD_SERVICE_LINK` (
  `LINK_ID`          NVARCHAR(100)  NOT NULL,
  `LINK_VALUE`       NVARCHAR(200)  NULL,
  `LINK_NAME`        NVARCHAR(200)  NULL,
  `LINK_TYPE`        NVARCHAR(200)  NULL,
  `LINK_URL`         NVARCHAR(1000) NULL,
  `LINK_PARAS`       NVARCHAR(2000) NULL,
  `LINK_USER`        NVARCHAR(100)  NULL,
  `LINK_PASSWORD`    NVARCHAR(100)  NULL,
  `LINK_CREATE_TIME` DATETIME       NULL,
  `LINK_ORDER_NUM`   INT            NULL,
  `LINK_DESC`        NVARCHAR(500)  NULL,
  `LINK_IS_LOCATION` NVARCHAR(10)   NULL,
  `LINK_STATUS`      NVARCHAR(50)   NULL,
  `LINK_ORGAN_ID`      NVARCHAR(100)  NULL,
  `LINK_ORGAN_NAME`    NVARCHAR(100)  NULL,
  PRIMARY KEY (`LINK_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应用设计-服务连接表';

/*-----------------------------------------表分组-----------------------------------------*/
DROP TABLE IF EXISTS `TBUILD_TABLE_GROUP`;
CREATE TABLE `TBUILD_TABLE_GROUP` (
  `TABLE_GROUP_ID`          NVARCHAR(100)  NOT NULL,
  `TABLE_GROUP_VALUE`       NVARCHAR(200)  NOT NULL,
  `TABLE_GROUP_TEXT`        NVARCHAR(200)  NOT NULL,
  `TABLE_GROUP_ORDER_NUM`   INT            NULL,
  `TABLE_GROUP_CREATE_TIME` DATETIME       NULL,
  `TABLE_GROUP_DESC`        NVARCHAR(500)  NULL,
  `TABLE_GROUP_STATUS`      NVARCHAR(10)   NULL,
  `TABLE_GROUP_PARENT_ID`   NVARCHAR(100)  NULL,
  `TABLE_GROUP_ISSYSTEM`    NVARCHAR(10)   NULL,
  `TABLE_GROUP_DEL_ENABLE`  NVARCHAR(10)   NULL,
  `TABLE_GROUP_PID_LIST`    NVARCHAR(1200) NOT NULL,
  `TABLE_GROUP_CHILD_COUNT` INT            NULL,
  `TABLE_GROUP_LINK_ID`     NVARCHAR(100)  NULL,
  `TABLE_GROUP_ORGAN_ID`    NVARCHAR(100)  NULL,
  `TABLE_GROUP_ORGAN_NAME`  NVARCHAR(100)  NULL,
  PRIMARY KEY (`TABLE_GROUP_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应用设计-表分组';

/*-----------------------------------------表基础信息-----------------------------------------*/
DROP TABLE IF EXISTS `TBUILD_TABLE`;
CREATE TABLE `TBUILD_TABLE` (
  `TABLE_ID`            NVARCHAR(100)  NOT NULL,
  `TABLE_CAPTION`       NVARCHAR(200)  NOT NULL,
  `TABLE_NAME`          NVARCHAR(200)  NOT NULL,
  `TABLE_DBNAME`        NVARCHAR(200)  NOT NULL,
  `TABLE_CREATE_TIME`   DATETIME       NULL,
  `TABLE_CREATER`       NVARCHAR(100)  NULL,
  `TABLE_UPDATE_TIME`   DATETIME       NULL,
  `TABLE_UPDATER`       NVARCHAR(100)  NULL,
  `TABLE_SERVICE_VALUE` NVARCHAR(100)  NULL,
  `TABLE_TYPE`          NVARCHAR(100)  NULL,
  `TABLE_ISSYSTEM`      NVARCHAR(10)   NULL,
  `TABLE_ORDER_NUM`     INT            NULL,
  `TABLE_DESC`          NVARCHAR(2000) NULL,
  `TABLE_GROUP_ID`      NVARCHAR(100)  NOT NULL,
  `TABLE_STATUS`        NVARCHAR(10)   NULL,
  `TABLE_LINK_ID`       NVARCHAR(100)  NULL,
  `TABLE_ORGAN_ID`    NVARCHAR(100)  NULL,
  `TABLE_ORGAN_NAME`  NVARCHAR(100)  NULL,
  PRIMARY KEY (`TABLE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应用设计-表基础信息';

/*-----------------------------------------表字段信息-----------------------------------------*/
DROP TABLE IF EXISTS `TBUILD_TABLE_FIELD`;
CREATE TABLE `TBUILD_TABLE_FIELD` (
  `FIELD_ID`             NVARCHAR(100)  NOT NULL,
  `FIELD_TABLE_ID`       NVARCHAR(100)  NOT NULL,
  `FIELD_NAME`           NVARCHAR(100)  NOT NULL,
  `FIELD_CAPTION`        NVARCHAR(100)  NOT NULL,
  `FIELD_IS_PK`          NVARCHAR(10)   NULL,
  `FIELD_ALLOW_NULL`     NVARCHAR(10)   NULL,
  `FIELD_DATA_TYPE`      NVARCHAR(50)   NOT NULL,
  `FIELD_DATA_LENGTH`    INT            NULL,
  `FIELD_DECIMAL_LENGTH` INT            NULL,
  `FIELD_DEFAULT_TYPE`   NVARCHAR(50)   NULL,
  `FIELD_DEFAULT_VALUE`  NVARCHAR(1000) NULL,
  `FIELD_DEFAULT_TEXT`   NVARCHAR(400)  NULL,
  `FIELD_CREATE_TIME`    DATETIME       NOT NULL,
  `FIELD_CREATER`        NVARCHAR(100)  NULL,
  `FIELD_UPDATE_TIME`    DATETIME       NOT NULL,
  `FIELD_UPDATER`        NVARCHAR(100)  NULL,
  `FIELD_DESC`           NVARCHAR(500)  NULL,
  `FIELD_ORDER_NUM`      INT            NULL,
  `FIELD_TEMPLATE_NAME`  NVARCHAR(100)  NULL,
  PRIMARY KEY (`FIELD_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应用设计-表字段信息';

/*-----------------------------------------数据集分组-----------------------------------------*/
DROP TABLE IF EXISTS `TBUILD_DATASET_GROUP`;
CREATE TABLE `TBUILD_DATASET_GROUP` (
  `DS_GROUP_ID`          NVARCHAR(100)  NOT NULL,
  `DS_GROUP_VALUE`       NVARCHAR(200)  NOT NULL,
  `DS_GROUP_TEXT`        NVARCHAR(200)  NOT NULL,
  `DS_GROUP_ORDER_NUM`   INT            NULL,
  `DS_GROUP_CREATE_TIME` DATETIME       NULL,
  `DS_GROUP_DESC`        NVARCHAR(500)  NULL,
  `DS_GROUP_STATUS`      NVARCHAR(10)   NULL,
  `DS_GROUP_PARENT_ID`   NVARCHAR(100)  NULL,
  `DS_GROUP_ISSYSTEM`    NVARCHAR(10)   NULL,
  `DS_GROUP_DEL_ENABLE`  NVARCHAR(10)   NULL,
  `DS_GROUP_PID_LIST`    NVARCHAR(1200) NOT NULL,
  `DS_GROUP_CHILD_COUNT` INT            NULL,
  `DS_GROUP_ORGAN_ID`    NVARCHAR(100)  NULL,
  `DS_GROUP_ORGAN_NAME`  NVARCHAR(100)  NULL,
  PRIMARY KEY (`DS_GROUP_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应用设计-数据集分组';

/*------------------------------------------数据集------------------------------------------*/
DROP TABLE IF EXISTS `TBUILD_DATASET`;
CREATE TABLE `TBUILD_DATASET` (
  `DS_ID`                 NVARCHAR(100)  NOT NULL,
  `DS_CAPTION`            NVARCHAR(200)  NOT NULL,
  `DS_NAME`               NVARCHAR(200)  NOT NULL,
  `DS_CREATE_TIME`        DATETIME       NULL,
  `DS_CREATER`            NVARCHAR(100)  NULL,
  `DS_UPDATE_TIME`        DATETIME       NULL,
  `DS_UPDATER`            NVARCHAR(100)  NULL,
  `DS_TYPE`               NVARCHAR(100)  NULL,
  `DS_ISSYSTEM`           NVARCHAR(10)   NULL,
  `DS_ORDER_NUM`          INT            NULL,
  `DS_DESC`               NVARCHAR(1000) NULL,
  `DS_GROUP_ID`           NVARCHAR(100)  NOT NULL,
  `DS_STATUS`             NVARCHAR(10)   NULL,
  `DS_SQL_SELECT_TEXT`    NVARCHAR(4000) NULL,
  `DS_SQL_SELECT_VALUE`   NVARCHAR(4000) NULL,
  `DS_CLASS_NAME`         NVARCHAR(300)  NULL,
  `DS_REST_STRUCTURE_URL` NVARCHAR(500)  NULL,
  `DS_REST_DATA_URL`      NVARCHAR(500)  NULL,
  `DS_ORGAN_ID`    NVARCHAR(100)  NULL,
  `DS_ORGAN_NAME`  NVARCHAR(100)  NULL,
  PRIMARY KEY (`DS_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应用设计-数据集';

/*------------------------------------------SQL数据集相关表------------------------------------------*/
DROP TABLE IF EXISTS `TBUILD_DATASET_RELATED_TABLE`;
CREATE TABLE `TBUILD_DATASET_RELATED_TABLE` (
  `RT_ID`            NVARCHAR(100)  NOT NULL,
  `RT_DS_ID`         NVARCHAR(100)  NULL,
  `RT_TABLE_NAME`    NVARCHAR(200)  NULL,
  `RT_TABLE_CAPTION` NVARCHAR(200)  NULL,
  `RT_TABLE_ID`      NVARCHAR(200)  NULL,
  `RT_TABLE_TYPE`    NVARCHAR(200)  NULL,
  `RT_DESC`          NVARCHAR(1000) NULL,
  `RT_ORDER_NUM`     INT           NULL,
  PRIMARY KEY (`RT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应用设计-SQL数据集相关表';

/*------------------------------------------数据集相关列------------------------------------------*/
DROP TABLE IF EXISTS `TBUILD_DATASET_COLUMN`;
CREATE TABLE `TBUILD_DATASET_COLUMN` (
  `COLUMN_ID`            NVARCHAR(100)  NOT NULL,
  `COLUMN_DS_ID`         NVARCHAR(100)  NULL,
  `COLUMN_CAPTION`       NVARCHAR(200)  NULL,
  `COLUMN_NAME`          NVARCHAR(200)  NULL,
  `COLUMN_CREATE_TIME`   DATETIME       NULL,
  `COLUMN_CREATER`       NVARCHAR(100)  NULL,
  `COLUMN_UPDATE_TIME`   DATETIME       NULL,
  `COLUMN_UPDATER`       NVARCHAR(100)  NULL,
  `COLUMN_DESC`          NVARCHAR(1000) NULL,
  `COLUMN_DEFAULT_TYPE`  NVARCHAR(50)   NULL,
  `COLUMN_DEFAULT_VALUE` NVARCHAR(1000) NULL,
  `COLUMN_DEFAULT_TEXT`  NVARCHAR(400)  NULL,
  `COLUMN_ORDER_NUM`     INT            NULL,
  `COLUMN_TABLE_NAME`    NVARCHAR(50)   NULL,
  `COLUMN_IS_CUSTOM`     NVARCHAR(10)   NULL,
  `COLUMN_FORMATTER`     NVARCHAR(200)  NULL,
  PRIMARY KEY (`COLUMN_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应用设计-数据集相关列';

/*------------------------------------------模块分组------------------------------------------*/
DROP TABLE IF EXISTS `TBUILD_MODULE`;
CREATE TABLE `TBUILD_MODULE` (
  `MODULE_ID`          NVARCHAR(100)  NOT NULL,
  `MODULE_VALUE`       NVARCHAR(200)  NOT NULL,
  `MODULE_TEXT`        NVARCHAR(200)  NOT NULL,
  `MODULE_ORDER_NUM`   INT           NULL,
  `MODULE_CREATE_TIME` DATETIME       NULL,
  `MODULE_DESC`        NVARCHAR(500)  NULL,
  `MODULE_STATUS`      NVARCHAR(10)   NULL,
  `MODULE_PARENT_ID`   NVARCHAR(100)  NULL,
  `MODULE_ISSYSTEM`    NVARCHAR(10)   NULL,
  `MODULE_DEL_ENABLE`  NVARCHAR(10)   NULL,
  `MODULE_PID_LIST`    NVARCHAR(1200) NOT NULL,
  `MODULE_CHILD_COUNT` INT           NULL,
  `MODULE_ORGAN_ID`    NVARCHAR(100)  NULL,
  `MODULE_ORGAN_NAME`  NVARCHAR(100)  NULL,
  PRIMARY KEY (`MODULE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应用设计-模块分组';

DROP TABLE IF EXISTS `TBUILD_FORM_RESOURCE`;
CREATE TABLE `TBUILD_FORM_RESOURCE` (
  `FORM_ID`                 NVARCHAR(100)  NOT NULL,
  `FORM_CODE`               NVARCHAR(50)   NOT NULL,
  `FORM_NAME`               NVARCHAR(200)  NOT NULL,
  `FORM_SINGLE_NAME`        NVARCHAR(200)  NOT NULL,
  `FORM_CREATE_TIME`        DATETIME       NULL,
  `FORM_CREATER`            NVARCHAR(100)  NULL,
  `FORM_UPDATE_TIME`        DATETIME       NULL,
  `FORM_UPDATER`            NVARCHAR(100)  NULL,
  `FORM_TYPE`               NVARCHAR(100)  NULL,
  `FORM_ISSYSTEM`           NVARCHAR(10)   NULL,
  `FORM_ORDER_NUM`          INT            NULL,
  `FORM_DESC`               NVARCHAR(1000) NULL,
  `FORM_MODULE_ID`          NVARCHAR(100)  NOT NULL,
  `FORM_STATUS`             NVARCHAR(10)   NULL,
  `FORM_ORGAN_ID`           NVARCHAR(100)  NULL,
  `FORM_ORGAN_NAME`         NVARCHAR(100)  NULL,
  `FORM_MAIN_TABLE_NAME`    NVARCHAR(100)  NULL
  COMMENT '表单的主表名称,从数据关系字段提取',
  `FORM_MAIN_TABLE_CAPTION` NVARCHAR(100)  NULL
  COMMENT '表单的主表标题,从数据关系字段提取',
  `FORM_DATA_RELATION`      NVARCHAR(4000)  NULL
  COMMENT '数据关系的设置,根节点为主表',
  `FORM_IS_TEMPLATE`        NVARCHAR(100)  NULL,
  `FORM_IS_RESOLVE`         NVARCHAR(10)   NULL
  COMMENT '是否进行了解析',
  `FORM_HTML_SOURCE`        MEDIUMTEXT     NULL
  COMMENT '原始的HTML',
  `FORM_HTML_RESOLVE`       MEDIUMTEXT     NULL
  COMMENT '解析后的HTML',
  `FORM_JS_CONTENT`         MEDIUMTEXT     NULL,
  `FORM_CSS_CONTENT`        MEDIUMTEXT     NULL,
  `FORM_CONFIG_CONTENT`     MEDIUMTEXT     NULL,
  `FORM_CONTENT_URL`        NVARCHAR(1000) NULL,
  PRIMARY KEY (`FORM_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应用设计-表单设计';

DROP TABLE IF EXISTS `TBUILD_FORM_CONFIG`;
CREATE TABLE `TBUILD_FORM_CONFIG` (
  `FCONFIG_ID`          NVARCHAR(100)  NOT NULL,
  `FCONFIG_FORM_ID`     NVARCHAR(100)  NOT NULL,
  `FCONFIG_TYPE`        NVARCHAR(100)  NOT NULL,
  `FCONFIG_NAME`        NVARCHAR(100)  NOT NULL,
  `FCONFIG_VALUE`       NVARCHAR(1000) NOT NULL,
  `FCONFIG_DESC`        NVARCHAR(1000) NOT NULL,
  `FCONFIG_CREATE_TIME` DATETIME       NULL,
  `FCONFIG_CREATER`     NVARCHAR(100)  NULL,
  `FCONFIG_ORDER_NUM`   INT            NULL,
  PRIMARY KEY (`FCONFIG_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应用设计-表单参数配置';

DROP TABLE IF EXISTS `TBUILD_LIST_RESOURCE`;
CREATE TABLE `TBUILD_LIST_RESOURCE` (
  `LIST_ID`                 NVARCHAR(100)  NOT NULL,
  `LIST_CODE`               NVARCHAR(50)   NOT NULL,
  `LIST_NAME`               NVARCHAR(200)  NOT NULL,
  `LIST_SINGLE_NAME`        NVARCHAR(200)  NOT NULL,
  `LIST_CREATE_TIME`        DATETIME       NULL,
  `LIST_CREATER`            NVARCHAR(100)  NULL,
  `LIST_UPDATE_TIME`        DATETIME       NULL,
  `LIST_UPDATER`            NVARCHAR(100)  NULL,
  `LIST_TYPE`               NVARCHAR(100)  NULL,
  `LIST_ISSYSTEM`           NVARCHAR(10)   NULL,
  `LIST_ORDER_NUM`          INT            NULL,
  `LIST_DESC`               NVARCHAR(1000) NULL,
  `LIST_MODULE_ID`          NVARCHAR(100)  NOT NULL,
  `LIST_STATUS`             NVARCHAR(10)   NULL,
  `LIST_ORGAN_ID`           NVARCHAR(100)  NULL,
  `LIST_ORGAN_NAME`         NVARCHAR(100)  NULL,
  `LIST_DATASET_ID`         NVARCHAR(100)  NULL,
  `LIST_HTML_SOURCE`        MEDIUMTEXT     NULL,
  `LIST_HTML_RESOLVE`       MEDIUMTEXT     NULL,
  `LIST_JS_CONTENT`         MEDIUMTEXT     NULL,
  `LIST_CONFIG_CONTENT`     MEDIUMTEXT     NULL,
  `LIST_ENABLE_S_SEAR`      NVARCHAR(10)  NULL COMMENT '是否启用简单查询',
  `LIST_ENABLE_C_SEAR`      NVARCHAR(10)  NULL COMMENT '是否启用复杂查询',
  PRIMARY KEY (`LIST_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应用设计-列表设计';



/*------------------------------------------Flowable集成--------------------------------------*/
DROP TABLE IF EXISTS `TBUILD_FLOW_MODEL`;
CREATE TABLE `TBUILD_FLOW_MODEL` (
  `MODEL_ID`            NVARCHAR(100)  NOT NULL,
  `MODEL_DE_ID`         NVARCHAR(100)  NOT NULL
  COMMENT 'act_de_model表的ID',
  `MODEL_MODULE_ID`     NVARCHAR(100)  NOT NULL,
  `MODEL_CODE`          NVARCHAR(50)   NOT NULL,
  `MODEL_NAME`          NVARCHAR(100)  NOT NULL,
  `MODEL_CREATE_TIME`   DATETIME       NULL,
  `MODEL_CREATER`       NVARCHAR(100)  NULL,
  `MODEL_UPDATE_TIME`   DATETIME       NULL,
  `MODEL_UPDATER`       NVARCHAR(100)  NULL,
  `MODEL_DESC`          NVARCHAR(1000) NULL,
  `MODEL_STATUS`        NVARCHAR(10)   NULL,
  `MODEL_ORDER_NUM`     INT            NULL,
  `MODEL_DEPLOYMENT_ID` NVARCHAR(1000) NULL,
  `MODEL_START_KEY`     NVARCHAR(1000) NULL,
  `MODEL_RESOURCE_NAME` NVARCHAR(1000) NULL,
  `MODEL_FROM_TYPE`     NVARCHAR(50)   NULL
  COMMENT '流程模型来自上传或者页面设计',
  `MODEL_MAIN_IMAGE_ID`     NVARCHAR(100)  NULL
  COMMENT '关联到TFS_FILE_INFO表的FILE_ID',
  PRIMARY KEY (`MODEL_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应用设计-Flowable集成表';


DROP TABLE IF EXISTS `TFS_FILE_INFO`;
CREATE TABLE `TFS_FILE_INFO` (
  `FILE_ID`          NVARCHAR(100) NOT NULL,
  `FILE_CREATE_TIME` DATETIME      NULL,
  `FILE_CREATER`     NVARCHAR(100) NULL,
  `FILE_NAME`        NVARCHAR(200) NULL,
  `FILE_SIZE`        BIGINT        NULL,
  `FILE_STORE_TYPE`  NVARCHAR(100) NULL
  COMMENT '文件的存储位置,小文件可以存储于数据库中',
  `FILE_STORE_PATH`  NVARCHAR(400) NULL
  COMMENT '文件的存储路径',
  `FILE_STORE_NAME`  NVARCHAR(100) NULL
  COMMENT '文件的物理存储名称',
  `FILE_ORGAN_ID`    NVARCHAR(100) NULL,
  `FILE_ORGAN_NAME`  NVARCHAR(100) NULL,
  `FILE_EXTENSION`   NVARCHAR(100) NULL
  COMMENT '文件的扩展名称',
  `FILE_DESCRIPTION` NVARCHAR(500) NULL,
  `FILE_READTIME`    INT           NULL
  COMMENT '文件的读取次数',
  `FILE_STATUS`      NVARCHAR(10)  NULL,
  PRIMARY KEY (`FILE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文件基本的信息表';

DROP TABLE IF EXISTS `TFS_FILE_CONTENT`;
CREATE TABLE `TFS_FILE_CONTENT` (
  `FILE_ID`      NVARCHAR(100) NOT NULL,
  `FILE_CONTENT` LONGBLOB      NOT NULL,
  PRIMARY KEY (`FILE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文件内容的存储表,用于存储小文件,1M以下';

DROP TABLE IF EXISTS `TFS_FILE_REF`;
CREATE TABLE `TFS_FILE_REF` (
  `REF_ID`        NVARCHAR(100) NOT NULL,
  `REF_FILE_ID`   NVARCHAR(100) NULL,
  `REF_OBJ_ID`    NVARCHAR(100) NULL,
  `REF_ORDER_NUM` INT           NULL,
  PRIMARY KEY (`REF_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文件的引用表,用于关联文件与其他记录的关系';


/*-----------------------------------------应用设计相关表--结束-----------------------------------------*/