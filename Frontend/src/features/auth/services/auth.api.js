import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:3000/api/auth",
    withCredentials:true
})
export async function register({username,email,password}){
    
    try{
        const response = await api.post('/register',{
            username,email,password
        })
        return response.data
        
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
}


export async function login({email,password}){

    try{
        const response = await api.post('/login',{
            email,password
        })
        return response.data
    }
    catch(err){
        console.error("Error logging in user:", err);
        throw err;
    }
}

3

export async function logout(){
    try{
        const response = await api.get("/logout")
        return response.data
    }
    catch(err){
        console.error("Error logging out user:", err);
        throw err;
    }
}

export async function getMe(){
    try{
        const response = await api.get("get-me")
        return response.data
    }
    catch(err){
        console.error("Error fetching user details:", err);
        throw err;
    }
}