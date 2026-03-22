package com.common.service;


import com.common.model.entity.UserInterfaceInfo;


/**
* @author 86175
* @description 针对表【user_interface_info(用户调用接口关系)】的数据库操作Service
* @createDate 2026-03-10 18:33:17
*/


public interface InnerUserInterfaceInfoService  {

    boolean invokeCount(Long interfaceInfoId, Long userId);
}
