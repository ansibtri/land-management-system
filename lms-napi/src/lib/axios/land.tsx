import { api } from './index'

// register new account
async function registerLand(values: any) {
    try {

        const response = await api.post('/land/create', values)
        return response?.data
    } catch (error) {
        throw error?.response?.data || error;
    }
}

// get all my lands
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

// get all lands of area
async function getAllLandsOfArea() {
    try {
        const response = await api.get('/land');
        console.log(response);
        return response?.data;
    } catch (error) {
        console.log(error)
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

// get lands
async function getLandsWhichIsAvailableForSell() {
    try {
        const response = await api.get('/land/availableforsell');
        console.log(response);
        return response?.data;
    } catch (error) {
        console.log(error)
    }
}

// update land by ward
async function verifyLandByWardOfficer(data: any) {
    try {
        console.log("verifylnad", data)
        const response = await api.post("/land/verifyLandByWard", data);
        console.log(response);
        return response?.data;
    } catch (error) {
        console.log(error)
    }
}

// 

async function verifyOTPandSellProcess(values: any) {
    try {
        const response = await api.post("/otp/verifyOTPandSellProcess", values);
        console.log(response);
        return response?.data;
    } catch (error) {
        console.log(error)
    }

}




async function verifyLandByNapi(data){
    try{
        const response = await api.post("/land/verifyLandByNapi",data);
        console.log(response);
        return response?.data;
    }catch(error){
        console.log(error)  
        return error?.response?.data || error;
    }
}
export { registerLand, getLandsByUserId,verifyLandByNapi, verifyOTPandSellProcess, getLandById, verifyLandByWardOfficer, updateLandStatus, getAllLandsOfArea, getLandsWhichIsAvailableForSell }