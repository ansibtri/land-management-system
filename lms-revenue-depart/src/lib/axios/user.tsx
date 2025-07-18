import { api } from './index'

// get all unverified users
async function getUnverifiedUsers(){
    try{
        const response = await api.get('/user/unverified');
        return response?.data;
    }catch(error){
        throw error?.response?.data || error;
    }
}

// update user verification status
async function updateUserVerificationStatus(userId: string) {
    try {
        const response = await api.patch(`/user/verify/${userId}`);
        return response?.data;
    } catch (error) {   
        throw error?.response?.data || error;
    }   
};


async function getUserByEmailAndCitizenship(values:any) {
    try {
        const response = await api.post(`/user/fetchbuyer`,values);
        return response?.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}

export { getUnverifiedUsers, updateUserVerificationStatus, getUserByEmailAndCitizenship }