package com.shushu.springbootinit.service;


import com.baomidou.mybatisplus.extension.service.IService;
import com.common.model.entity.UserInterfaceInfo;

/**
* @author 86175
* @description 针对表【user_interface_info(用户调用接口关系)】的数据库操作Service
* @createDate 2026-03-10 18:33:17
*/


public interface UserInterfaceInfoService extends IService<UserInterfaceInfo> {
    void validUserInterfaceInfoService(UserInterfaceInfo userInterfaceInfo, boolean add);


    boolean invokeCount(Long interfaceInfoId, Long userId);
}
