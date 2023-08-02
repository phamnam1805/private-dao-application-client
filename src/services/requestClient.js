import axios from "axios";
import { BACKEND_ROOT_URL, IPFS_GATEWAY, IPFS_INFURA, IPFS_AUTH } from "src/configs/constance";

const responseBody = (res) => res.data;

export const createClient = (apiRoot, apiConfig = {}) => {
  return {
    get: (url, config) => axios.get(`${apiRoot}${url}`, { ...config, ...apiConfig }).then(responseBody),
    post: (url, body, config) => axios.post(`${apiRoot}${url}`, body, { ...config, ...apiConfig }).then(responseBody),
    del: (url, config) => axios.delete(`${apiRoot}${url}`, { ...config, ...apiConfig }).then(responseBody),
    put: (url, body, config) => axios.put(`${apiRoot}${url}`, body, { ...config, ...apiConfig }).then(responseBody),
  };
};

export const defaultClient = createClient(BACKEND_ROOT_URL);
export const ipfsQueryClient = createClient(IPFS_GATEWAY);
export const ipfsUpdateClient = createClient(IPFS_INFURA, {
  headers: { Authorization: IPFS_AUTH },
});
