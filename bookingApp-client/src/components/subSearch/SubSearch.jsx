import { faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState, useEffect } from "react"
import './subSearch.css'

const SubSearch = ({ location, onSelect }) => {
    const [cities, setCities] = useState([]);

    useEffect(() => {
        if (!location) {
            setCities([
                { id: 1, name: "Hà Nội" },
                { id: 2, name: "Đà Lạt" },
                { id: 3, name: "Vũng Tàu" },
                { id: 4, name: "Hồ Chí Minh" },
                { id: 5, name: "Đà Nẵng" },
            ]);
        } else {
            fetch(`https://open.oapi.vn/location/provinces?page=0&size=63&query=${location}`)
                .then((response) => response.json())
                .then((data) => {
                    setCities(data.data || []);
                })
                .catch((error) => console.error('Error fetching countries:', error));
        }
    }, [location]);

    const handleItemClick = (cityName) => {
        onSelect(cityName);
    };

    return (
        <div className="ss-body">
            <h2>Địa điểm gợi ý</h2>
            {cities.map(city => (
                <div 
                    className="ss-item" 
                    key={city.id}
                    onClick={() => handleItemClick(city.name)}
                >
                    <FontAwesomeIcon className="ss-icon" icon={faLocationDot} />
                    <div className="ss-item-info">
                        <p>{city.name}</p>
                        <span>Việt Nam</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SubSearch;