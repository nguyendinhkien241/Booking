import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { discountInputs, hotelInputs, roomInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";
import { discountColumns, hotelColumns, invoiceColumns, requestColumns, roomColumns, userColumns } from "./datatablesource";
import NewHotel from "./pages/newHotel/NewHotel";
import NewRoom from "./pages/newRoom/NewRoom";
import Update from "./pages/new/Update";
import UpdateHotel from "./pages/newHotel/UpdateHotel";
import UpdateRoom from "./pages/newRoom/UpdateRoom";
import RequestHotel from "./pages/request/RequestHotel";
import NewDiscount from "./pages/newDiscount/NewDiscount";
import UpdateDiscount from "./pages/newDiscount/UpdateDiscount";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const ProtectedRoute = ({children}) => {
    const { admin } = useContext(AuthContext);
    if (!admin) {
      return <Navigate to="/login" />;
    }
    return children;
  }

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />  
            <Route index element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute> 
            } />
            <Route path="users">
              <Route index element={<ProtectedRoute>
                <List columns={userColumns}/>
              </ProtectedRoute>} />
              <Route path=":userId" element={<ProtectedRoute>
                <Single />
              </ProtectedRoute>} />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <New inputs={userInputs} title="Add New User" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="update/:id"
                element={
                  <ProtectedRoute>
                    <Update inputs={userInputs} title="Update User" />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="hotels">
              <Route index element={<ProtectedRoute>
                <List columns={hotelColumns}/>
              </ProtectedRoute>} />
              <Route path=":hotelId" element={<ProtectedRoute>
                <Single />
              </ProtectedRoute>} />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewHotel inputs={hotelInputs} title="Add New Hotel" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="update/:id"
                element={
                  <ProtectedRoute>
                    <UpdateHotel inputs={hotelInputs} title="Update Hotel" />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="rooms">
              <Route index element={<ProtectedRoute>
                <List columns={roomColumns}/>
              </ProtectedRoute>} />
              <Route path=":roomId" element={<ProtectedRoute>
                <Single />
              </ProtectedRoute>} />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewRoom inputs={roomInputs} title="Add New Room" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="update/:id"
                element={
                  <ProtectedRoute>
                    <UpdateRoom inputs={roomInputs} title="Update Room" />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="hotelOwnerRequests">
              <Route index element={<ProtectedRoute>
                <List columns={requestColumns}/>
              </ProtectedRoute>} />
              <Route path=":requestId" element={<ProtectedRoute>
                <RequestHotel />
              </ProtectedRoute>} />
            </Route>

            <Route path="invoices">
              <Route index element={<ProtectedRoute>
                <List columns={invoiceColumns}/>
              </ProtectedRoute>} />
              <Route path=":invoiceId" element={<ProtectedRoute>
                <Single />
              </ProtectedRoute>} />
            </Route>

            <Route path="discounts">
              <Route index element={<ProtectedRoute>
                <List columns={discountColumns}/>
              </ProtectedRoute>} />
              <Route path=":invoiceId" element={<ProtectedRoute>
                <Single />
              </ProtectedRoute>} />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewDiscount inputs={discountInputs} title="Add New Discount" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="update/:id"
                element={
                  <ProtectedRoute>
                    <UpdateDiscount inputs={discountInputs} title="Update Discount" />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
