
-----------------------------------------开发适用DEMO-----------------------------------------
CREATE TABLE [dbo].[TB4D_DEV_DEMO_GEN_LIST] (
  [DDGL_ID]                  [NVARCHAR](128)  NOT NULL PRIMARY KEY,
  [DDGL_KEY]                 [NVARCHAR](128)  NULL,
  [DDGL_NAME]                [NVARCHAR](128)  NULL,
  [DDGL_VALUE]               [NVARCHAR](500)  NULL,
  [DDGL_STATUS]              [NVARCHAR](10)   NULL,
  [DDGL_DESC]                [NVARCHAR](MAX)  NULL,
  [DDGL_CREATETIME]          [DATETIME]       NULL,
  [DDGL_USER_ID]             [NVARCHAR](100)  NULL,
  [DDGL_USER_NAME]           [NVARCHAR](100)  NULL,
  [DDGL_ORGAN_ID]            [NVARCHAR](100)  NULL,
  [DDGL_ORGAN_NAME]          [NVARCHAR](100)  NULL,
  [DDGL_API]                 [NVARCHAR](100)  NULL,
  [DDGL_ORDER_NUM]           [INT]            NULL,
  [DDGL_INPUTNUMBER]         [DECIMAL](18, 2) NULL,
  [DDGL_BIND_DIC_SELECTED]   [NVARCHAR](100)  NULL,
  [DDGL_BIND_DIC_RADIO]      [NVARCHAR](100)  NULL,
  [DDGL_BIND_DIC_CHECKBOX1]  [NVARCHAR](100)  NULL,
  [DDGL_BIND_DIC_CHECKBOX2]  [NVARCHAR](100)  NULL,
  [DDGL_BIND_DIC_CHECKBOX3]  [NVARCHAR](100)  NULL,
  [DDGL_BIND_DIC_MUCHECKBOX] [NVARCHAR](1000) NULL
)

CREATE TABLE [dbo].[TB4D_DEV_DEMO_TREE_TABLE] (
  [DDTT_ID]                       [NVARCHAR](128)  NOT NULL PRIMARY KEY,
  [DDTT_KEY]                      [NVARCHAR](128)  NULL,
  [DDTT_NAME]                     [NVARCHAR](128)  NULL,
  [DDTT_VALUE]                    [NVARCHAR](500)  NULL,
  [DDTT_STATUS]                   [NVARCHAR](10)   NULL,
  [DDTT_DESC]                     [NVARCHAR](MAX)  NULL,
  [DDTT_CREATETIME]               [DATETIME]       NULL,
  [DDTT_ORDER_NUM]                [INT]            NULL,
  [DDTT_BIND_DIC_SELECTED]        [NVARCHAR](100)  NULL,
  [DDTT_BIND_DIC_RADIO]           [NVARCHAR](100)  NULL,
  [DDTT_DDTT_BIND_DIC_MUCHECKBOX] [NVARCHAR](1000) NULL,
  [DDTT_PARENT_ID]                [NVARCHAR](100)  NULL,
  [DDTT_PARENT_IDLIST]            [NVARCHAR](1200) NULL,
  [DDTT_CHILD_COUNT]              [INT]            NULL
)

CREATE TABLE [dbo].[TB4D_DEV_DEMO_TL_TREE] (
  [DDTT_ID]                       [NVARCHAR](128)  NOT NULL PRIMARY KEY,
  [DDTT_KEY]                      [NVARCHAR](128)  NULL,
  [DDTT_NAME]                     [NVARCHAR](128)  NULL,
  [DDTT_VALUE]                    [NVARCHAR](500)  NULL,
  [DDTT_STATUS]                   [NVARCHAR](10)   NULL,
  [DDTT_DESC]                     [NVARCHAR](MAX)  NULL,
  [DDTT_CREATETIME]               [DATETIME]       NULL,
  [DDTT_ORDER_NUM]                [INT]            NULL,
  [DDTT_PARENT_ID]                [NVARCHAR](100)  NULL,
  [DDTT_PARENT_IDLIST]            [NVARCHAR](1200) NULL,
  [DDTT_CHILD_COUNT]              [INT]            NULL
)

CREATE TABLE [dbo].[TB4D_DEV_DEMO_TL_TREE_LIST] (
  [DDTL_ID]                       [NVARCHAR](128)  NOT NULL PRIMARY KEY,
  [DDTL_GROUP_ID]                 [NVARCHAR](128)  NULL,
  [DDTL_KEY]                      [NVARCHAR](128)  NULL,
  [DDTL_NAME]                     [NVARCHAR](128)  NULL,
  [DDTL_VALUE]                    [NVARCHAR](500)  NULL,
  [DDTL_STATUS]                   [NVARCHAR](10)   NULL,
  [DDTL_DESC]                     [NVARCHAR](MAX)  NULL,
  [DDTL_CREATETIME]               [DATETIME]       NULL,
  [DDTL_ORDER_NUM]                [INT]            NULL,
  [DDTL_BIND_DIC_SELECTED]        [NVARCHAR](100)  NULL,
  [DDTL_BIND_DIC_RADIO]           [NVARCHAR](100)  NULL,
  [DDTL_DDTT_BIND_DIC_MUCHECKBOX] [NVARCHAR](1000) NULL,
)

-----------------------------------------系统设置表-----------------------------------------
CREATE TABLE [dbo].[TB4D_SETTING] (
  [SETTING_ID]         [NVARCHAR](128) NOT NULL PRIMARY KEY,
  [SETTING_KEY]        [NVARCHAR](128) NULL,
  [SETTING_NAME]       [NVARCHAR](128) NULL,
  [SETTING_VALUE]      [NVARCHAR](500) NULL,
  [SETTING_STATUS]     [NVARCHAR](10)  NULL,
  [SETTING_DESC]       [NVARCHAR](MAX) NULL,
  [SETTING_CREATETIME] [DATETIME]      NULL,
  [SETTING_USER_ID]    [NVARCHAR](100) NULL,
  [SETTING_USER_NAME]  [NVARCHAR](100) NULL,
  [SETTING_ORGAN_ID]   [NVARCHAR](100) NULL,
  [SETTING_ORGAN_NAME] [NVARCHAR](100) NULL,
  [SETTING_API]        [NVARCHAR](100) NULL,
  [SETTING_IS_SYSTEM]  [NVARCHAR](10)  NULL
)

EXECUTE sp_addextendedproperty N'MS_Description', N'系统基础参数设置表', N'user', N'dbo', N'table', N'TB4D_SETTING', NULL, NULL;
--EXECUTE sp_updateextendedproperty 'MS_Description', '系统基础参数设置表', 'user', 'dbo', 'table', 'TB4D_SETTING', NULL, NULL;

--EXECUTE sp_addextendedproperty N'MS_Description', N'设置参数主键', N'user', N'dbo', N'table', N'TB4D_SETTING', N'column', N'SETTING_ID';

-----------------------------------------操作日志-----------------------------------------

-----------------------------------------菜单表-----------------------------------------
CREATE TABLE [dbo].[TB4D_MENU] (
  [MENU_ID]                  [NVARCHAR](100)  NOT NULL PRIMARY KEY,
  [MENU_NAME]                [NVARCHAR](100)  NULL,
  [MENU_TEXT]                [NVARCHAR](100)  NOT NULL,
  [MENU_VALUE]               [NVARCHAR](100)  NULL,
  [MENU_TYPE]                [NVARCHAR](100)  NOT NULL,
  [MENU_USER_ID]             [NVARCHAR](100)  NULL,
  [MENU_USER_NAME]           [NVARCHAR](100)  NULL,
  [MENU_ORGAN_ID]            [NVARCHAR](100)  NULL,
  [MENU_ORGAN_NAME]          [NVARCHAR](100)  NULL,
  [MENU_IS_EXPAND]           [NVARCHAR](10)   NULL,
  [MENU_IS_SYSTEM]           [NVARCHAR](10)   NULL,
  [MENU_LEFT_URL]            [NVARCHAR](600)  NULL,
  [MENU_LEFT_URL_PARA]       [NVARCHAR](600)  NULL,
  [MENU_RIGHT_URL]           [NVARCHAR](800)  NULL,
  [MENU_RIGHT_URL_PARA]      [NVARCHAR](600)  NULL,
  [MENU_ORDER_NUM]           [INT]            NULL,
  [MENU_PARENT_ID]           [NVARCHAR](100)  NOT NULL,
  [MENU_PARENT_ID_LIST]      [NVARCHAR](1200) NOT NULL,
  [MENU_TARGET]              [NVARCHAR](100)  NULL,
  [MENU_CREATOR]             [NVARCHAR](200)  NULL,
  [MENU_CREATE_TIME]         [DATETIME]       NULL,
  [MENU_UPDATER]             [NVARCHAR](200)  NULL,
  [MENU_UPDATE_TIME]         [DATETIME]       NULL,
  [MENU_USE_ORGAN_NAME]      [NVARCHAR](500)  NULL,
  [MENU_USE_ORGAN_ID]        [NVARCHAR](500)  NULL,
  [MENU_USE_ORGAN_TYPE_NAME] [NVARCHAR](500)  NULL,
  [MENU_USE_ORGAN_TYPE_ID]   [NVARCHAR](500)  NULL,
  [MENU_CLASS_NAME]          [NVARCHAR](100)  NULL,
  [MENU_CLASS_NAME_HOVER]    [NVARCHAR](100)  NULL,
  [MENU_CLASS_NAME_SELECTED] [NVARCHAR](100)  NULL,
  [MENU_MENU_CHILD_COUNT]    [INT]            NULL,
  [MENU_MENU_DESCRIPTION]    [NVARCHAR](MAX)  NULL,
  [MENU_JS_EXPRESSION]       [NVARCHAR](1000) NULL
)

EXECUTE sp_addextendedproperty N'MS_Description', N'系统导航菜单表', N'user', N'dbo', N'table', N'TB4D_MENU', NULL, NULL;

EXECUTE sp_addextendedproperty N'MS_Description', N'菜单ID', N'user', N'dbo', N'table', N'TB4D_MENU', N'column', N'MENU_ID';

-----------------------------------------组织机构类型表-----------------------------------------
CREATE TABLE [dbo].[TB4D_ORGAN_TYPE] (
  ORGAN_TYPE_ID    [NVARCHAR](100) NOT NULL PRIMARY KEY,
  ORGAN_TYPE_VALUE [NVARCHAR](300) NOT NULL,
  ORGAN_TYPE_NAME  [NVARCHAR](300) NOT NULL,
  ORGAN_TYPE_DESC  [NVARCHAR](2000) NULL
)

INSERT into TB4D_ORGAN_TYPE(ORGAN_TYPE_ID,ORGAN_TYPE_VALUE,ORGAN_TYPE_NAME) VALUES (1,'10001','一般组织');

-----------------------------------------组织机构表-----------------------------------------
CREATE TABLE [dbo].[TB4D_ORGAN] (
  ORGAN_ID               [NVARCHAR](100)  NOT NULL PRIMARY KEY,
  ORGAN_NAME             [NVARCHAR](300)  NOT NULL,
  ORGAN_NO               [NVARCHAR](200)  NULL,
  ORGAN_CODE             [NVARCHAR](200)  NULL,
  ORGAN_CREATE_TIME      [DATETIME]       NULL,
  ORGAN_PHONE            [NVARCHAR](100)  NULL,
  ORGAN_POST             [NVARCHAR](20)   NULL,
  ORGAN_TYPE_VALUE       [NVARCHAR](50)   NULL,
  ORGAN_ADDRESS          [NVARCHAR](1000) NULL,
  ORGAN_CONTACTOR        [NVARCHAR](100)  NULL,
  ORGAN_CONTACTOR_MOBILE [NVARCHAR](100)  NULL,
  ORGAN_DOMAIN           [NVARCHAR](300)  NULL,
  ORGAN_FAX              [NVARCHAR](100)  NULL,
  ORGAN_CHILD_COUNT      [INT]            NULL,
  ORGAN_IS_VIRTUAL       [NVARCHAR](10)   NULL,
  ORGAN_ORDER_NUM        [INT]            NULL,
  ORGAN_PARENT_ID        [NVARCHAR](100)  NULL,
  ORGAN_PARENT_ID_LIST   [NVARCHAR](1200) NULL,
  ORGAN_SHORT_NAME       [NVARCHAR](150)  NULL,
  ORGAN_STATUS           [NVARCHAR](10)   NULL,
  ORGAN_CREATRE_ORG_ID   [NVARCHAR](100)  NULL,
  ORGAN_OUTER_ID         [NVARCHAR](100)  NULL,
  ORGAN_OUTER_TYPE       [NVARCHAR](100)  NULL
)

-----------------------------------------数据字典表-----------------------------------------
CREATE TABLE TB4D_DICTIONARY_GROUP (
  [DICT_GROUP_ID]          [NVARCHAR](100) NOT NULL PRIMARY KEY,
  [DICT_GROUP_VALUE]       [NVARCHAR](200) NOT NULL,
  [DICT_GROUP_TEXT]        [NVARCHAR](200) NOT NULL,
  [DICT_GROUP_ORDER_NUM]   [INT]           NULL,
  [DICT_GROUP_CREATE_TIME] [DATETIME]      NULL,
  [DICT_GROUP_DESC]        [NVARCHAR](500) NULL,
  [DICT_GROUP_STATUS]      [NVARCHAR](10)  NULL,
  [DICT_GROUP_PARENT_ID]   [NVARCHAR](100) NULL,
  [DICT_GROUP_ISSYSTEM]    [NVARCHAR](10)  NULL,
  [DICT_GROUP_DEL_ENABLE]  [NVARCHAR](10)  NULL,
  [DICT_GROUP_ENP_ITEM]    [NVARCHAR](10)  NULL
)
-----------------------------------------数据字典表-----------------------------------------
CREATE TABLE TB4D_DICTIONARY (
  [DICT_ID]            [NVARCHAR](100)  NOT NULL PRIMARY KEY,
  [DICT_KEY]           [NVARCHAR](200)  NOT NULL,
  [DICT_VALUE]         [NVARCHAR](200)  NOT NULL,
  [DICT_TEXT]          [NVARCHAR](200)  NOT NULL,
  [DICT_GROUP_ID]      [NVARCHAR](100)  NOT NULL,
  [DICT_ORDER_NUM]     [INT]            NULL,
  [DICT_CREATE_TIME]   [DATETIME]       NULL,
  [DICT_PARENT_ID]     [NVARCHAR](100)      NULL,
  [DICT_PARENT_IDLIST] [NVARCHAR](1200) NULL,
  [DICT_ISSYSTEM]      [NVARCHAR](10)   NULL,
  [DICT_DEL_ENABLE]    [NVARCHAR](10)   NULL,
  [DICT_STATUS]        [NVARCHAR](10)   NULL,
  [DICT_IS_SELECTED]   [NVARCHAR](10)   NULL,
  [DICT_DESC]          [NVARCHAR](500)  NULL,
  [DICT_CHILD_COUNT]   [INT]            NULL,
  [DICT_EX_ATTR1]      [NVARCHAR](500)  NULL,
  [DICT_EX_ATTR2]      [NVARCHAR](500)  NULL,
  [DICT_EX_ATTR3]      [NVARCHAR](500)  NULL,
  [DICT_EX_ATTR4]      [NVARCHAR](500)  NULL,
  [DICT_USER_ID]       [NVARCHAR](100)  NULL,
  [DICT_USER_NAME]     [NVARCHAR](100)  NULL,
  [DICT_ORGAN_ID]      [NVARCHAR](100)  NULL,
  [DICT_ORGAN_NAME]    [NVARCHAR](100)  NULL
)
-----------------------------------------操作日志表-----------------------------------------
CREATE TABLE TB4D_OPERATION_LOG (
  [LOG_ID]          [NVARCHAR](100)  NOT NULL PRIMARY KEY,
  [LOG_TEXT]        [NVARCHAR](2000) NOT NULL,
  [LOG_ORDER_NUM]   [INT]            NULL,
  [LOG_CREATE_TIME] [DATETIME]       NULL,
  [LOG_SYSTEM_NAME] [NVARCHAR](200)  NULL,
  [LOG_MODULE_NAME] [NVARCHAR](200)  NULL,
  [LOG_ACTION_NAME] [NVARCHAR](200)  NULL,
  [LOG_DATA]        [NVARCHAR](MAX)  NULL,
  [LOG_USER_ID]     [NVARCHAR](100)  NULL,
  [LOG_USER_NAME]   [NVARCHAR](100)  NULL,
  [LOG_ORGAN_ID]    [NVARCHAR](100)  NULL,
  [LOG_ORGAN_NAME]  [NVARCHAR](100)  NULL,
  [LOG_IP]          [NVARCHAR](100)  NULL,
  [LOG_TYPE]        [NVARCHAR](100)  NULL,
  [LOG_CLASS_NAME]  [NVARCHAR](200)  NULL,
  [LOG_STATUS]      [NVARCHAR](50)  NULL
)

-----------------------------------------应用设计相关表--开始-----------------------------------------

-----------------------------------------数据库连接-----------------------------------------
CREATE TABLE TB4D_DATABASE_SERVICE_LINK (
  [DBLINK_ID]          [NVARCHAR](100)  NOT NULL PRIMARY KEY,
  [DBLINK_VALUE]       [NVARCHAR](200)  NULL,
  [DBLINK_NAME]        [NVARCHAR](200)  NULL,
  [DBLINK_TYPE]        [NVARCHAR](200)  NULL,
  [DBLINK_DRIVERNAME]  [NVARCHAR](1000) NULL,
  [DBLINK_URL]         [NVARCHAR](1000) NULL,
  [DBLINK_USER]        [NVARCHAR](100)  NULL,
  [DBLINK_PASSWORD]    [NVARCHAR](100)  NULL,
  [DBLINK_CREATE_TIME] [DATETIME]       NULL,
  [DBLINK_ORDER_NUM]   [INT]            NULL,
  [DBLINK_DESC]        [NVARCHAR](500)  NULL,
  [DBLINK_IS_LOCATION] [NVARCHAR](10)   NULL,
  [DBLINK_STATUS]      [NVARCHAR](50)  NULL
)

-----------------------------------------表分组-----------------------------------------
CREATE TABLE TB4D_TABLE_GROUP (
  [TABLE_GROUP_ID]          [NVARCHAR](100)  NOT NULL PRIMARY KEY,
  [TABLE_GROUP_VALUE]       [NVARCHAR](200)  NOT NULL,
  [TABLE_GROUP_TEXT]        [NVARCHAR](200)  NOT NULL,
  [TABLE_GROUP_ORDER_NUM]   [INT]            NULL,
  [TABLE_GROUP_CREATE_TIME] [DATETIME]       NULL,
  [TABLE_GROUP_DESC]        [NVARCHAR](500)  NULL,
  [TABLE_GROUP_STATUS]      [NVARCHAR](10)   NULL,
  [TABLE_GROUP_PARENT_ID]   [NVARCHAR](100)  NULL,
  [TABLE_GROUP_ISSYSTEM]    [NVARCHAR](10)   NULL,
  [TABLE_GROUP_DEL_ENABLE]  [NVARCHAR](10)   NULL,
  [TABLE_GROUP_PID_LIST]    [NVARCHAR](1200) NOT NULL,
  [TABLE_GROUP_CHILD_COUNT] [INT]            NULL
)

-----------------------------------------表基础信息-----------------------------------------
CREATE TABLE TB4D_TABLE (
  [TABLE_ID]            [NVARCHAR](100)  NOT NULL PRIMARY KEY,
  [TABLE_CAPTION]       [NVARCHAR](200)  NOT NULL,
  [TABLE_NAME]          [NVARCHAR](200)  NOT NULL,
  [TABLE_DBNAME]        [NVARCHAR](200)  NOT NULL,
  [TABLE_ORGAN_ID]      [INT]            NULL,
  [TABLE_CREATE_TIME]   [DATETIME]       NULL,
  [TABLE_CREATER]       [NVARCHAR](100)  NULL,
  [TABLE_UPDATE_TIME]   [DATETIME]       NULL,
  [TABLE_UPDATER]       [NVARCHAR](100)  NULL,
  [TABLE_SERVICE_VALUE] [NVARCHAR](100)  NULL,
  [TABLE_TYPE]          [NVARCHAR](100)  NULL,
  [TABLE_ISSYSTEM]      [NVARCHAR](10)   NULL,
  [TABLE_ORDER_NUM]     [INT]            NULL,
  [TABLE_DESC]          [NVARCHAR](2000) NULL,
  [TABLE_GROUP_ID]      [NVARCHAR](100)  NOT NULL,
  [TABLE_STATUS]        [NVARCHAR](10)   NULL
)

-----------------------------------------表字段信息-----------------------------------------
CREATE TABLE TB4D_TABLE_FIELD (
  [FIELD_ID]             [NVARCHAR](100)  NOT NULL PRIMARY KEY,
  [FIELD_TABLE_ID]       [NVARCHAR](100)  NOT NULL,
  [FIELD_NAME]           [NVARCHAR](100)  NOT NULL,
  [FIELD_CAPTION]        [NVARCHAR](100)  NOT NULL,
  [FIELD_IS_PK]          [NVARCHAR](10)   NULL,
  [FIELD_ALLOW_NULL]     [NVARCHAR](10)   NULL,
  [FIELD_DATA_TYPE]      [NVARCHAR](50)   NOT NULL,
  [FIELD_DATA_LENGTH]    [INT]            NULL,
  [FIELD_DECIMAL_LENGTH] [INT]            NULL,
  [FIELD_DEFAULT_TYPE]   [NVARCHAR](50)   NULL,
  [FIELD_DEFAULT_VALUE]  [NVARCHAR](1000) NULL,
  [FIELD_DEFAULT_TEXT]   [NVARCHAR](400)  NULL,
  [FIELD_CREATE_TIME]    [DATETIME]       NOT NULL,
  [FIELD_CREATER]        [NVARCHAR](100)  NULL,
  [FIELD_UPDATE_TIME]    [DATETIME]       NOT NULL,
  [FIELD_UPDATER]        [NVARCHAR](100)  NULL,
  [FIELD_DESC]           [NVARCHAR](500)  NULL,
  [FIELD_ORDER_NUM]      [INT]            NULL,
  [FIELD_TEMPLATE_NAME]  [NVARCHAR](100)  NULL
)

-----------------------------------------数据集分组-----------------------------------------
CREATE TABLE TB4D_DATASET_GROUP (
  [DS_GROUP_ID]          [NVARCHAR](100)  NOT NULL PRIMARY KEY,
  [DS_GROUP_VALUE]       [NVARCHAR](200)  NOT NULL,
  [DS_GROUP_TEXT]        [NVARCHAR](200)  NOT NULL,
  [DS_GROUP_ORDER_NUM]   [INT]            NULL,
  [DS_GROUP_CREATE_TIME] [DATETIME]       NULL,
  [DS_GROUP_DESC]        [NVARCHAR](500)  NULL,
  [DS_GROUP_STATUS]      [NVARCHAR](10)   NULL,
  [DS_GROUP_PARENT_ID]   [NVARCHAR](100)  NULL,
  [DS_GROUP_ISSYSTEM]    [NVARCHAR](10)   NULL,
  [DS_GROUP_DEL_ENABLE]  [NVARCHAR](10)   NULL,
  [DS_GROUP_PID_LIST]    [NVARCHAR](1200) NOT NULL,
  [DS_GROUP_CHILD_COUNT] [INT]            NULL
)
------------------------------------------数据集------------------------------------------
CREATE TABLE TB4D_DATASET (
  [DS_ID]          [NVARCHAR](100)  NOT NULL PRIMARY KEY,
  [DS_CAPTION]     [NVARCHAR](200)  NOT NULL,
  [DS_NAME]        [NVARCHAR](200)  NOT NULL,
  [DS_ORGAN_ID]    [INT]            NULL,
  [DS_CREATE_TIME] [DATETIME]       NULL,
  [DS_CREATER]     [NVARCHAR](100)  NULL,
  [DS_UPDATE_TIME] [DATETIME]       NULL,
  [DS_UPDATER]     [NVARCHAR](100)  NULL,
  [DS_TYPE]        [NVARCHAR](100)  NULL,
  [DS_ISSYSTEM]    [NVARCHAR](10)   NULL,
  [DS_ORDER_NUM]   [INT]            NULL,
  [DS_DESC]        [NVARCHAR](1000) NULL,
  [DS_GROUP_ID]    [NVARCHAR](100)  NOT NULL,
  [DS_STATUS]      [NVARCHAR](10)   NULL,
  [DS_SQL_SELECT_TEXT]  [NVARCHAR](4000) NULL,
  [DS_SQL_SELECT_VALUE]  [NVARCHAR](4000) NULL,
  [DS_CLASS_NAME]  [NVARCHAR](300) NULL,
  [DS_REST_URL]  [NVARCHAR](500) NULL
)

CREATE TABLE TB4D_DATASET_RELATED_TABLE (
  [RT_ID]            [NVARCHAR](100)  NOT NULL PRIMARY KEY,
  [RT_DS_ID]         [NVARCHAR](100)  NULL,
  [RT_TABLE_NAME]    [NVARCHAR](200)  NULL,
  [RT_TABLE_CAPTION] [NVARCHAR](200)  NULL,
  [RT_TABLE_ID]      [NVARCHAR](200)  NULL,
  [RT_TABLE_TYPE]    [NVARCHAR](200)  NULL,
  [RT_DESC]          [NVARCHAR](1000) NULL,
  [RT_ORDER_NUM]     [INT]            NULL
)

CREATE TABLE TB4D_DATASET_COLUMN (
  [COLUMN_ID]            [NVARCHAR](100)  NOT NULL PRIMARY KEY,
  [COLUMN_DS_ID]         [NVARCHAR](100)  NULL,
  [COLUMN_CAPTION]       [NVARCHAR](200)  NULL,
  [COLUMN_NAME]          [NVARCHAR](200)  NULL,
  [COLUMN_CREATE_TIME]   [DATETIME]       NULL,
  [COLUMN_CREATER]       [NVARCHAR](100)  NULL,
  [COLUMN_UPDATE_TIME]   [DATETIME]       NULL,
  [COLUMN_UPDATER]       [NVARCHAR](100)  NULL,
  [COLUMN_DESC]          [NVARCHAR](1000) NULL,
  [COLUMN_DEFAULT_TYPE]  [NVARCHAR](50)   NULL,
  [COLUMN_DEFAULT_VALUE] [NVARCHAR](1000) NULL,
  [COLUMN_DEFAULT_TEXT]  [NVARCHAR](400)  NULL,
  [COLUMN_ORDER_NUM]     [INT]            NULL,
  [COLUMN_TABLE_NAME]    [NVARCHAR](50)   NULL
)

-----------------------------------------应用设计相关表--结束-----------------------------------------