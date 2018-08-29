/*-----------------------------------------开发适用DEMO-----------------------------------------*/
DROP TABLE IF EXISTS `TB4D_DEV_DEMO_GEN_LIST`;
CREATE TABLE `TB4D_DEV_DEMO_GEN_LIST` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='一般通用列表Demo表';


/*-----------------------------------------菜单表-----------------------------------------*/
CREATE TABLE `TB4D_MENU` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='平台菜单表';


/*-----------------------------------------操作日志表-----------------------------------------*/
CREATE TABLE TB4D_OPERATION_LOG (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='平台操作日志表';