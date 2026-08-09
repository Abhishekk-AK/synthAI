import proxy from "express-http-proxy"

export const proxyWithHeader=(serviceUrl)=> {
    //proxy with url
    //return proxy(serviceUrl)

    //proxy with url + header
    //header will pass through(proxyReqOpts), req(srcReq such as req.user etc.)
    return proxy(serviceUrl, {
        proxyReqOptDecorator:(proxyReqOpts, srcReq)=> {
            if(srcReq.user){
                //custom header
                proxyReqOpts.headers["x-user-id"]=srcReq.user.userId
                return proxyReqOpts
            }
        }
    })
}