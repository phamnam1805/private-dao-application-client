import { defaultClient, ipfsUpdateClient } from "src/services/requestClient";
import { IPFS_GATEWAY, IPFS_HASHES } from "src/configs/constance";

export async function uploadDAOInfo(dao) {
  let logoIpfsHash;
  if (dao.logo !== null) {
    const logoFormData = new FormData();
    logoFormData.append("file", dao.logo);
    logoIpfsHash = (await ipfsUpdateClient.post("/add", logoFormData)).Hash;
  } else logoIpfsHash = IPFS_HASHES.DEFAULT_LOGO;
  Object.assign(dao, { logoUrl: IPFS_GATEWAY + "/" + logoIpfsHash });
  delete dao.logo;
  return await defaultClient.post("/ipfs/upload", dao);
}
