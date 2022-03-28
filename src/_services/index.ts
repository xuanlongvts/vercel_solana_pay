import axios from 'axios';
import qs from 'qs';

import { Obj } from '_types';

import { contentType, contentTypeValuesUrlEncoded } from './const';

class API {
    http: any;
    baseUrl: any;
    headersConfig: any;
    location: any;
    headers: { 'content-type': string; Authorization: string } | undefined;

    constructor(baseUrl: string, headersConfig: any, restParams: any) {
        const timeout = restParams.timeout ? restParams.timeout : 5000;

        this.http = axios.create({ baseURL: baseUrl, timeout });

        this.baseUrl = baseUrl;
        this.headersConfig = headersConfig || null;

        this.http.interceptors.response.use(
            (response: any) => {
                return response;
            },
            (err: any) => Promise.reject(err),
        );
    }

    // for login when the first time do not use headers
    fetch(url: string, params: any, method: string) {
        let propData = 'params';
        let methodDetect = 'GET';
        if (method && method.toUpperCase() !== methodDetect) {
            propData = 'data';
            methodDetect = method;
        }
        const objInfor: Obj = {
            baseURL: this.baseUrl,
            url,
        };

        let qsFlag = false;
        if (this.headersConfig) {
            objInfor.headers = this.headersConfig;

            contentTypeValuesUrlEncoded.includes(this.headersConfig[contentType]) && (qsFlag = true);
        }

        objInfor.method = methodDetect;
        objInfor[propData] = qsFlag ? qs.stringify(params) : params;
        return axios(objInfor);
    }

    get(url: string, params: any) {
        const paramsConfig = {
            params,
            headers: this.headers,
        };
        return this.http.get(url, paramsConfig);
    }

    put(path: string, payload: any) {
        return this.http({
            data: payload,
            method: 'PUT',
            url: path,
            headers: this.headers,
        });
    }

    post(url: string, payload: any) {
        return this.http({
            data: payload,
            method: 'POST',
            url,
            headers: this.headers,
        });
    }
}

export default API;
