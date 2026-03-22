package org.gateway.apigateway;

import com.common.model.entity.InterfaceInfo;
import com.common.model.entity.User;
import com.common.service.InnerInterfaceInfoService;
import com.common.service.InnerUserInterfaceInfoService;
import com.common.service.InnerUserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.dubbo.config.annotation.DubboReference;
import org.reactivestreams.Publisher;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.http.server.reactive.ServerHttpResponseDecorator;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import org.customersdk.clientsdk.utils.SignUtils;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
public class CustomGlobalFilter implements GlobalFilter, Ordered {

    private static final List<String>IP_WHITE_LIST= Arrays.asList("127.0.0.1");

    @DubboReference
    private InnerUserService innerUserService;

    @DubboReference
    private InnerInterfaceInfoService innerInterfaceInfoService;

    @DubboReference
    private InnerUserInterfaceInfoService innerUserInterfaceInfoService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        ServerHttpRequest request = exchange.getRequest();
        String path ="http://localhost:8123/api"+request.getPath().value();
        String method =request.getMethod().toString();
        ServerHttpResponse response = exchange.getResponse();
        String sourceAddress = request.getLocalAddress().getHostString();
        if (!IP_WHITE_LIST.contains(sourceAddress)) {
            response.setStatusCode(HttpStatus.FORBIDDEN);
            return response.setComplete();
        }
        HttpHeaders headers = request.getHeaders();
        // 从请求头中获取参数
        String accessKey = headers.getFirst("accessKey");
        String nonce = headers.getFirst("nonce");
        String timestamp = headers.getFirst("timestamp");
        String sign = headers.getFirst("sign");
        String body = headers.getFirst("body");
        User invoker = null;
        try{
            invoker=innerUserService.getInvokeUser(accessKey);
        }catch (Exception e){
            log.error("获取调用者失败",e);
        }
        if (invoker==null){
            return handleNoAuth((response));
        }

        // 直接校验如果随机数大于1万，则抛出异常，并提示"无权限"
        if (Long.parseLong(nonce) > 10000) {
            return handleNoAuth((response));
        }
        final Long currentTime=System.currentTimeMillis()/1000;
        final Long FIVE_MINUTES=5*60L;
        if (currentTime-Long.parseLong(timestamp)>FIVE_MINUTES){
            return handleNoAuth((response));
        }

        String secretKey = invoker.getSecretKey();

        String serverSign = SignUtils.getSign(body, secretKey);
        if (sign==null||!sign.equals(serverSign)){
            return handleNoAuth((response));
        }

        //请求的模拟接口是否存在
        InterfaceInfo interfaceInfo = null;
        try{
            interfaceInfo=innerInterfaceInfoService.getInterfaceInfo(path, method);
        }catch (Exception e){
            log.error("获取调用者失败",e);
        }
        if (interfaceInfo==null){
            return handleNoAuth((response));
        }
        //todo 校验接口是否还有调用次数
        return  handleResponse(exchange,chain,interfaceInfo.getId(),invoker.getId());
    }

    @Override
    public int getOrder() {
        return -1;
    }

    public Mono<Void>  handleResponse(ServerWebExchange exchange, GatewayFilterChain chain,long interfaceInfoId,long userId){
        try {
            ServerHttpResponse originalResponse = exchange.getResponse();
            DataBufferFactory bufferFactory = originalResponse.bufferFactory();

            HttpStatus statusCode = (HttpStatus) originalResponse.getStatusCode();

            if(statusCode == HttpStatus.OK){
                ServerHttpResponseDecorator decoratedResponse = new ServerHttpResponseDecorator(originalResponse) {

                    @Override
                    public Mono<Void> writeWith(Publisher<? extends DataBuffer> body) {
                        //log.info("body instanceof Flux: {}", (body instanceof Flux));
                        if (body instanceof Flux) {
                            Flux<? extends DataBuffer> fluxBody = Flux.from(body);
                            //
                            return super.writeWith(fluxBody.map(dataBuffer -> {
                                try{
                                    innerUserInterfaceInfoService.invokeCount(interfaceInfoId,userId);
                                }catch (Exception e){
                                    log.error("记录接口调用异常",e);
                                }
                                byte[] content = new byte[dataBuffer.readableByteCount()];
                                dataBuffer.read(content);
                                DataBufferUtils.release(dataBuffer);//释放掉内存
                                // 构建日志
                                StringBuilder sb2 = new StringBuilder(200);
                                sb2.append("<--- {} {} \n");
                                List<Object> rspArgs = new ArrayList<>();
                                rspArgs.add(originalResponse.getStatusCode());
                                //rspArgs.add(requestUrl);
                                String data = new String(content, StandardCharsets.UTF_8);//data
                                sb2.append(data);
                                log.info(sb2.toString(), rspArgs.toArray());//log.info("<-- {} {}\n", originalResponse.getStatusCode(), data);
                                log.info("响应的高级结果:"+data);
                                return bufferFactory.wrap(content);
                            }));
                        } else {
                            log.error("<--- {} 响应code异常", getStatusCode());
                        }
                        return super.writeWith(body);
                    }
                };
                return chain.filter(exchange.mutate().response(decoratedResponse).build());
            }
            return chain.filter(exchange);//降级处理返回数据
        }catch (Exception e){
            log.error("网关处理响应异常" + e);
            return chain.filter(exchange);
        }

    }

    public  Mono<Void>  handleNoAuth(ServerHttpResponse response){
        response.setStatusCode(HttpStatus.FORBIDDEN);
        return response.setComplete();
    }

    public  Mono<Void>  handleInvokeError(ServerHttpResponse response){
        response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
        return response.setComplete();
    }

}
