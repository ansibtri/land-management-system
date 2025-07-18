import { api } from './index'

// register new account
async function registerAccount(values: any) {
      try {
            const formData = new FormData();
            Object.keys(values).forEach(key => {
                  formData.append(key, values[key]);
            });

            const response = await api.post('/auth/register', formData, {
                  headers: {
                        'Content-Type': 'multipart/form-data',
                  },
            })

            return response?.data
      } catch (error) {
            throw error?.response?.data || error;
      }
}

// login account
async function loginAccount(values: any) {
      try {
            const response = await api.post('/auth/login', values)
            console.log(response)
            return response?.data;
      } catch (error) {
            throw error?.response?.data || error;
      }
}

// validate Auth token   
async function validateAuth() {
      try {
            const response = await api.post('/auth/cookie');
            console.log(response)
            return response?.data;
      } catch (error) {
            throw error;
      }
}

// logout account
async function logout() {
      try {
            const response = await api.post('/auth/logout');
            return response?.data;
      } catch (error) {
            throw error;
      }
}
export { registerAccount, loginAccount, validateAuth, logout }