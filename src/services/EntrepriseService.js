import axios from "axios";

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
});

export default {
  getAllEntreprisesApi() {
    return api.get("/api/v1/CompanyinfoMerged");
  },

  insertNewRecord(data) {
    return api.post("/api/v1/Post_info", data);
  },

  updateEntreprise(ide, data) {
    return api.patch(`/api/v1/PatchUpdate/${ide}`, data);
  },

  deleteEntreprise(ide) {
    return api.delete(`/api/v1/DeleteCompany/${ide}`);
  },

  getAllStatus() {
    return api.get("/api/v1/legalForm");
  },
};
