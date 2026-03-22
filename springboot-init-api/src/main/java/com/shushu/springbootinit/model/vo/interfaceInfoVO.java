package com.shushu.springbootinit.model.vo;

import com.common.model.entity.InterfaceInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.Date;

/**
 * 用户视图（脱敏）
 *
 * @author <a href="https://github.com/liyupi">程序员鱼皮</a>
 * @from <a href="https://yupi.icu">编程导航知识星球</a>
 */
@EqualsAndHashCode(callSuper = false)
@Data
public class interfaceInfoVO extends InterfaceInfo {

   private  Integer totalNum;


   private static final long serialVersionUID = 1L;
}