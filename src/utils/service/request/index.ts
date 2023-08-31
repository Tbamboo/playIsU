import type {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios';
import axios from 'axios';

import type {
  CancelRequestSource,
  RequestConfig,
  RequestInterceptors,
} from './types';

class Request {
    // axios 实例
    public instance: AxiosInstance
    // 拦截器对象
    public interceptorsObj?: RequestInterceptors

    /*
    存放取消方法的集合
  * 在创建请求后将取消请求方法 push 到该集合中
  * 封装一个方法，可以取消请求，传入 url: string|string[]  
  * 在请求之前判断同一URL是否存在，如果存在就取消请求
  */
    public cancelRequestSourceList?: CancelRequestSource[]
    /*
    存放所有请求URL的集合
  * 请求之前需要将url push到该集合中
  * 请求完毕后将url从集合中删除
  * 添加在发送请求之前完成，删除在响应之后删除
  */
    public requestUrlList?: string[]

    public constructor(config: RequestConfig) {
        this.requestUrlList = []
        this.cancelRequestSourceList = []
        this.instance = axios.create(config)
        this.interceptorsObj = config.interceptors
        // 拦截器执行顺序 接口请求 -> 实例请求 -> 全局请求 -> 实例响应 -> 全局响应 -> 接口响应
        this.instance.interceptors.request.use(
            (res: AxiosRequestConfig) => res,
            (err: any) => err
        );

        // 使用实例拦截器
        this.instance.interceptors.request.use(
            this.interceptorsObj?.requestInterceptors,
            this.interceptorsObj?.requestInterceptorsCatch
        );
        this.instance.interceptors.response.use(
            this.interceptorsObj?.responseInterceptors,
            this.interceptorsObj?.responseInterceptorsCatch
        );
        // 全局响应拦截器保证最后执行
        this.instance.interceptors.response.use(
            // 因为我们接口的数据都在res.data下，所以我们直接返回res.data
            (res: AxiosResponse) => {
                return res.data
            },
            (err: any) => err
        );
    }
    public request<T>(config: RequestConfig): Promise<T> {
        let params: RequestConfig = { ...config }
        return new Promise((resolve, reject) => {
            // 如果我们为单个请求设置拦截器，这里使用单个请求的拦截器
            if (config.interceptors?.requestInterceptors) {
                params = config.interceptors.requestInterceptors(config)
            }
            const url = params.url
            // url存在保存取消请求方法和当前请求url
            if (url) {
                this.requestUrlList?.push(url)
                params.cancelToken = new axios.CancelToken((c) => {
                    this.cancelRequestSourceList?.push({
                        [url]: c
                    })
                })
            }
            this.instance
                .request<any, T>(params)
                .then((res) => {
                    let response = res
                    // 如果我们为单个响应设置拦截器，这里使用单个响应的拦截器
                    if (params.interceptors?.responseInterceptors) {
                        response = params.interceptors.responseInterceptors<T>(res)
                    }

                    resolve(response)
                })
                .catch((err: any) => {
                    reject(err);
                })
                .finally(() => {
                    if (url) {
                        this.delUrl(url)
                    }
                });
        });
    }
    // 取消请求
    public cancelRequest(url: string | string[]) {
        if (typeof url === 'string') {
            // 取消单个请求
            const sourceIndex = this.getSourceIndex(url)
            if (sourceIndex >= 0) this.cancelRequestSourceList?.[sourceIndex][url]()
        } else {
            // 存在多个需要取消请求的地址
            url.forEach((u) => {
                const sourceIndex = this.getSourceIndex(u);
                if (sourceIndex >= 0) this.cancelRequestSourceList?.[sourceIndex][u]();
            })
        }
    }
    // 取消全部请求
    public cancelAllRequest() {
        this.cancelRequestSourceList?.forEach((source) => {
            const key = Object.keys(source)[0];
            source[key]();
        });
    }
    /**
     * @description: 获取指定 url 在 cancelRequestSourceList 中的索引
     * @param {string} url
     * @returns {number} 索引位置
     */
    private getSourceIndex(url: string): number {
        return this.cancelRequestSourceList?.findIndex((item: CancelRequestSource) => {
            return Object.keys(item)[0] === url;
        }) as number;
    }
    /**
     * @description: 删除 requestUrlList 和 cancelRequestSourceList
     * @param {string} url
     * @returns {*}
     */
    private delUrl(url: string) {
        const urlIndex = this.requestUrlList?.findIndex((u) => u === url);
        const sourceIndex = this.getSourceIndex(url);
        // 删除url和cancel方法
        if (urlIndex !== -1) this.requestUrlList?.splice(urlIndex as number, 1)
        if (sourceIndex !== -1) this.cancelRequestSourceList?.splice(sourceIndex as number, 1)
    }
}

export default Request;
export { RequestConfig, RequestInterceptors };
