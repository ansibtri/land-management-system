import { api } from "./index";

// verify tax by ward officer
async function verifyLandByWardOfficer(values: any) {
    try {
        const response = await api.post('/land/verifyByWardOfficer', values);
        return response?.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}

async function verifyTaxByWardOfficer(values: any) {
    try {
        console.log("values", values);
        const {taxId, ...rest}  = values;
        const value = rest;

        const response = await api.put(`/tax/update/${taxId}`, value);
        return response?.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}

export { verifyLandByWardOfficer, verifyTaxByWardOfficer };