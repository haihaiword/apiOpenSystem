package com.shushu.springbootinit.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.common.model.entity.InterfaceInfo;
import com.common.model.entity.UserInterfaceInfo;
import com.shushu.springbootinit.service.InterfaceInfoService;
import com.shushu.springbootinit.annotation.AuthCheck;
import com.shushu.springbootinit.common.BaseResponse;
import com.shushu.springbootinit.common.ErrorCode;
import com.shushu.springbootinit.common.ResultUtils;
import com.shushu.springbootinit.exception.BusinessException;
import com.shushu.springbootinit.mapper.UserInterfaceInfoMapper;
import com.shushu.springbootinit.model.vo.interfaceInfoVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/analysis")
@Slf4j
public class AnalysisController {

    @Resource
    private UserInterfaceInfoMapper userInterfaceInfoMapper;

    @Resource
    private InterfaceInfoService innerInterfaceInfoService;

    @GetMapping("/top/interface/invoke")
    @AuthCheck(mustRole = "admin")
    public BaseResponse<List<interfaceInfoVO>> listTopInvokeInterfaceInfo() {
        List<UserInterfaceInfo> userInterfaceInfoList = userInterfaceInfoMapper.listTopInvokeInterfaceInfo(3);
        Map<Long, List<UserInterfaceInfo>> interfaceInfoObjMap = userInterfaceInfoList.stream()
                .collect(Collectors.groupingBy(UserInterfaceInfo::getInterfaceInfoId));
        QueryWrapper<InterfaceInfo> queryWrapper = new QueryWrapper<>();
        queryWrapper.in("id", interfaceInfoObjMap.keySet());
        List<InterfaceInfo>list=innerInterfaceInfoService.list(queryWrapper);
        if(CollectionUtils.isEmpty(list)){
             throw  new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        List<interfaceInfoVO> interfaceInfoVOList = list.stream().map(interfaceInfo -> {
            interfaceInfoVO interfaceInfoVO = new interfaceInfoVO();
            BeanUtils.copyProperties(interfaceInfo, interfaceInfoVO);
            int totalNum = interfaceInfoObjMap.get(interfaceInfo.getId()).get(0).getTotalNum();
            interfaceInfoVO.setTotalNum(totalNum);
            return interfaceInfoVO;
        }).collect(Collectors.toList());
        return ResultUtils.success(interfaceInfoVOList);
    }
}
