import { useContext, useState } from "react";
import "./login.scss"
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [ credentials, setCredentials] = useState({
        username: undefined,
        password: undefined,
    });

    const navigate = useNavigate()

    const { loading, error, dispatch} = useContext(AuthContext);
    const handleChange = (e) => {
        setCredentials((prev) => ({...prev, [e.target.id]: e.target.value})); 
    }

    const handleClick = async (e) => {
        e.preventDefault();
        dispatch({type: "LOGIN_START"});
        try {
            const res = await axios.post("/auth/login", credentials);
            if(res.data.isAdmin) {
              dispatch({type: "LOGIN_SUCCESS", payload: res.data.details});
              navigate("/");
            } else {
              dispatch({type: "LOGIN_FAILURE", payload: {message: "You are not allowed"}});  
            }
        } catch (err) {
            dispatch({type: "LOGIN_FAILURE", payload: err.response.data});
            console.log(err.response.data);
        }
    }   

    return (
        <div className="login">
            <div class="login-box">
                <div class="login-header">
                    <header>Login</header>
                </div>
                <div class="input-box">
                    <input type="text" class="input-field" placeholder="Username" id="username" autocomplete="off" required onChange={handleChange} />
                </div>
                <div class="input-box">
                    <input type="password" class="input-field" placeholder="Password" id="password" autocomplete="off" required onChange={handleChange} />
                </div>
                <div class="forgot">
                    <section>
                        <input type="checkbox" id="check" />
                        <label for="check">Remember me</label>
                    </section>
                    <section>
                        <Link to="/">Forgot password</Link>
                    </section>
                </div>
                <div class="input-submit">
                    <button disabled={loading} onClick={handleClick} class="submit-btn" id="submit"></button>
                    <label for="submit">Sign In</label>
                </div>
            </div>
        </div>
    )
}

export default Login;