import { createContext, useReducer } from "react"

const INITIAL_STATE = {
    city: undefined,
    dates: [],
    options: {
        adult: undefined,
        children: undefined,
        room: undefined,
    }
}

export const SearchContext = createContext(INITIAL_STATE)

const SearchReducer = (state, action) => {
    switch (action.type) {
        case "NEW_SEARCH":
            return action.payload
        case "RESET_SEARCH":
            return INITIAL_STATE
        default:
            return state;
    }
}

export const SearchContextProvider = ({children}) => {
    const getInitialState = () => {
        const savedData = localStorage.getItem("searchData");
        return savedData ? JSON.parse(savedData) : INITIAL_STATE;
      };
      
      const [state, dispatch] = useReducer(SearchReducer, getInitialState());

    return (
        <SearchContext.Provider value={{
            city: state.city, 
            dates: state.dates,
            options: state.options, 
            dispatch
        }}>
            {children}
        </SearchContext.Provider>
    )
}

// Khôi phục dữ liệu từ localStorage khi ứng dụng khởi động
