import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import axios from "axios";
import './newDIscount.scss'
import { useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "../../components/loading/Loading";


const UpdateDiscount = ({inputs, title}) => {
    const [info, setInfo] = useState({});
    const location = useLocation();
    const id = location.pathname.split("/")[3];
    const { data, loading, error } = useFetch(`/discounts/find/${id}`)
    const [ load, setLoad ] = useState(false)

    useEffect(() => {
        if (data) {
          setInfo({
            code: data.code || "",
            value: data.value || "",
            startDate: data.startDate ? new Date(data.startDate).toISOString().split("T")[0] : "",
            endDate: data.endDate ? new Date(data.endDate).toISOString().split("T")[0] : ""
          });
        }
      }, [data]);

    console.log(info)
    console.log(data)
    const handleChange = (e) => {
        setInfo((prev) => ({...prev, [e.target.id]: e.target.value}));
    }
    
    const handleClick = async (e) => {
        e.preventDefault();
        setLoad(true);
        try {
            // Gửi request PUT để update user
            await axios.put(`/discounts/${id}`, info);
            toast.success("Update successfully!");
            
            setInfo({});
        } catch (err) {
            toast.error("Something not right")
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
                    <input 
                      onChange={handleChange} 
                      type={input.type} 
                      placeholder={input.placeholder} 
                      id={input.id}
                      value={info[input.id] || ""}

                  />
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

export default UpdateDiscount;