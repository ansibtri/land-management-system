import { api } from "./index";


// register new recommendation
async function registerRecommendation(values: any) {
    try {

        const formData = new FormData();

        formData.append("landid", "sfas");
        formData.append("landId", values?.landId);
        formData.append("sellerId", values?.sellerId);
        formData.append("buyerId", values?.buyerId);
        formData.append("documents", values?.documents);
        formData.append("verifiedByWardOfficer", values?.verifiedByWardOfficer);
        

        const response = await api.post('/recommendation/create', values, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response?.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}

export { registerRecommendation };