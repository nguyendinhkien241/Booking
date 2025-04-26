import { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import axios from "axios";
import './newDIscount.scss'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "../../components/loading/Loading";

const NewDiscount = ({inputs, title}) => {
    const [info, setInfo] = useState({});
    const [ load, setLoad ] = useState(false);
    
    const handleChange = (e) => {
      setInfo((prev) => ({...prev, [e.target.id]: e.target.value}));
    }
    
    const handleClick = async (e) => {
        e.preventDefault();
        setLoad(true);
        try {
            await axios.post("/discounts/", info);
            toast.success("User created successfully!");
            
            setInfo({});
        } catch (err) {
            console.log(err)
        }
        setLoad(false);
    }

    return load ? <Loading/> : (
      <div className="newDiscount">
        <Sidebar />
        <div className="newContainer">
          <Navbar />
          <div className="top">
            <h1>{title}</h1>
          </div>
          <div className="bottom">
            <div className="right">
              <form>
                {inputs.map((input) => (
                  <div className="formInput" key={input.id}>
                    <label>{input.label}</label>
                    <input onChange={handleChange} type={input.type} placeholder={input.placeholder} id = {input.id}/>
                  </div>
                ))}
                <div className="formInput">
                  <button style={{flex: 2}} onClick={handleClick}>Send</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
}

export default NewDiscount;