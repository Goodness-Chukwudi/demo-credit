import axios from "axios";

class HttpService {

    config;
    baseUrl: string;
    constructor(baseUrl: string, token: string) {
        this.baseUrl = baseUrl;
        this.config = {
            headers: { Authorization: `Bearer ${token}` }
        };
      }
    
    get(url: string) {
        const endpoint = this.baseUrl + url;
        return new Promise((resolve, reject) => {
            axios.get(endpoint, this.config)
                .then((data: any) => { resolve(data) })
                .catch((e) => { reject(e) });
        });
    }

    post(url: string, payload: Record<string,any> = {}) {
        const endpoint = this.baseUrl + url;
        return new Promise((resolve, reject) => {
            axios.post(endpoint, payload, this.config)
                .then((data) => { resolve(data) })
                .catch((e) => { reject(e) });
        });
    }
}

export default HttpService;