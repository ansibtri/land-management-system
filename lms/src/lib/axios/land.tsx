import { api } from './index'

// register new account
async function registerLand(values: any) {
    try {
        const formData = new FormData();

        formData.append("landId", values?.landId);
        formData.append("ownerId", values.ownerId);
        formData.append("areaSize", values?.areaSize);
        formData.append("citizenshipNo", values?.citizenshipNo);
        formData.append("description", values?.description);
        formData.append("price", values?.price);
        formData.append("municipality", values?.municipality);
        formData.append("state", values?.state);
        formData.append("documents", values?.documents[0]);
        formData.append("landType", values?.landType);
        formData.append("grandFatherName", values?.grandFatherName);
        formData.append("fatherName", values?.fatherName);
        formData.append("district", values?.district);
        formData.append("wardNo", values?.wardNo);

        const response = await api.post('/land/create', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return response?.data
    } catch (error) {
        throw error?.response?.data || error;
    }
}

// get lands by userId
async function getLandsByUserId(userId: string) {

    try {
        const response = await api.get(`/land/owner/${userId}`);
        return response?.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}

// get all lands
async function updateLandStatus(landId: string) {
    try {
        const response = await api.put(`/land/sellStatus/${landId}`);
        return response?.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}

// get land by Id
async function getLandById(landId: string) {
    try {
        const response = await api.get(`/land/${landId}`);
        console.log(response);
        return response?.data;
    } catch (error) {
        return error?.response?.data || error;
    }
}

// upload tax voucher
async function uploadTaxVoucher(values:any){
    try {
        const formData = new FormData();
        formData.append("landId", values?.landId);
        formData.append("userId", values?.userId);
        console.log("values", values.documents);
        formData.append("documents", values?.documents);

        const response = await api.post('/tax/create', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response?.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}

async function deleteLandById(landId: string) {
    try {
        const response = await api.delete(`/land/${landId}`);
        return response?.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}
export { registerLand, getLandsByUserId, updateLandStatus, getLandById, uploadTaxVoucher, deleteLandById };