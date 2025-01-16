import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import List from "./pages/list/List";
import New from "./pages/new/New";
import { facilityInputs, tripInputs, truckInputs } from "./formSource";
import { truckDetails, tripDetails, facilityDetails } from "./detailSource";
import Login from "./pages/login/Login";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import NewTrip from "./pages/newTrip/NewTrip";
import TruckDetails from "./pages/truckDetails/TruckDetails";
import FacilityDetails from "./pages/facilityDetails/FacilityDetails";
import TripDetails from "./pages/tripDetails/TripDetails";
import PageNotFound from "./pages/pageNotFound/PageNotFound";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import Edit from "./pages/edit/Edit";
import EditTrip from "./pages/editTrip/EditTrip";

export const AppContext = createContext();

function App() {
    const { currentUser } = useContext(AuthContext);
    const [truckData, setTruckData] = useState([]);
    const [facilityData, setFacilityData] = useState([]);
    const [tripData, setTripData] = useState([]);

    useEffect(() => {
        const fetchData = async (resource, setter) => {
            let list = [];

            try {
                const querySnapshot = await getDocs(collection(db, resource));
                querySnapshot.forEach((doc) => {
                    let docData = doc.data();

                    if (resource === "trips") {
                        docData.startDate = docData.startDate.toDate();
                        docData.endDate = docData.endDate.toDate();
                    }

                    list.push({ id: doc.id, ...docData });
                });

                setter(list);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData("trucks", setTruckData);
        fetchData("facilities", setFacilityData);
        fetchData("trips", setTripData);
    }, []);

    const RequireAuth = ({ children }) => {
        return currentUser ? children : <Navigate to="/login" />;
    };

    return (
        <div>
            <AppContext.Provider
                value={{
                    truckData,
                    facilityData,
                    tripData,
                    setTruckData,
                    setFacilityData,
                    setTripData,
                }}
            >
                <BrowserRouter>
                    <Routes>
                        <Route path="/">
                            <Route index element={<Home />} />
                            <Route path="login" element={<Login />} />
                            <Route path="trucks">
                                <Route
                                    index
                                    element={
                                        <List
                                            resource={"trucks"}
                                            title="Add New Truck"
                                        />
                                    }
                                />
                                <Route
                                    path=":id"
                                    element={
                                        <TruckDetails
                                            resource={"trucks"}
                                            details={truckDetails}
                                        />
                                    }
                                />
                                <Route
                                    path="new"
                                    element={
                                        <New
                                            resource={"trucks"}
                                            title="Add New Truck"
                                            inputs={truckInputs}
                                        />
                                    }
                                />
                                <Route
                                    path="edit/:id"
                                    element={
                                        <Edit
                                            resource={"trucks"}
                                            title="Edit Truck"
                                            inputs={truckInputs}
                                        />
                                    }
                                />
                            </Route>
                            <Route path="trips">
                                <Route
                                    index
                                    element={
                                        <List
                                            resource={"trips"}
                                            title="Add New Trip"
                                        />
                                    }
                                />
                                <Route
                                    path=":id"
                                    element={
                                        <TripDetails
                                            resource={"trips"}
                                            details={tripDetails}
                                        />
                                    }
                                />
                                <Route
                                    path="new"
                                    element={
                                        <NewTrip
                                            resource="trips"
                                            title="Add New Trip"
                                            inputs={tripInputs}
                                        />
                                    }
                                />
                                <Route
                                    path="edit/:id"
                                    element={
                                        <EditTrip
                                            resource="trips"
                                            title="Edit Trip"
                                            inputs={tripInputs}
                                        />
                                    }
                                />
                            </Route>
                            <Route path="facilities">
                                <Route
                                    index
                                    element={
                                        <List
                                            resource="facilities"
                                            title="Add New Facility"
                                        />
                                    }
                                />
                                <Route
                                    path=":id"
                                    element={
                                        <FacilityDetails
                                            resource={"facilities"}
                                            details={facilityDetails}
                                        />
                                    }
                                />
                                <Route
                                    path="new"
                                    element={
                                        <New
                                            resource={"facilities"}
                                            title="Add New Facility"
                                            inputs={facilityInputs}
                                        />
                                    }
                                />
                                <Route
                                    path="edit/:id"
                                    element={
                                        <Edit
                                            resource={"facilities"}
                                            title="Edit Facility"
                                            inputs={facilityInputs}
                                        />
                                    }
                                />
                            </Route>
                        </Route>
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </BrowserRouter>
            </AppContext.Provider>
        </div>
    );
}

export default App;
