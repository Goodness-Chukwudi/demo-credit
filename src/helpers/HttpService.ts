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
    
    get(url: string): Promise<any> {
        const endpoint = this.baseUrl + url;
        return new Promise((resolve, reject) => {
            axios.get(endpoint, this.config)
                .then((response: any) => { resolve(response.data) })
                .catch((error) => { reject(error.response) });
        });
    }

    post(url: string, payload: Record<string,any> = {}): Promise<any> {
        const endpoint = this.baseUrl + url;
        return new Promise((resolve, reject) => {
            axios.post(endpoint, payload, this.config)
                .then((response) => { resolve(response.data) })
                .catch((error) => { reject(error.response) });
        });
    }
}

export default HttpService;