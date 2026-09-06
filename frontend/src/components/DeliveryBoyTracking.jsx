import React from 'react'
import scooter from "../assets/scooter.png"
import home from "../assets/home.png"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect } from 'react'
import "leaflet-routing-machine";

import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
const deliveryBoyIcon = new L.Icon({
    iconUrl: scooter,
    iconSize: [20, 40],
    iconAnchor: [20, 40]
})
const customerIcon = new L.Icon({
    iconUrl: home,
    iconSize: [20, 40],
    iconAnchor: [20, 40]
})

 function Routing({ start, end }) {
        const map = useMap();

        useEffect(() => {
            const routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(start[0], start[1]),
                    L.latLng(end[0], end[1]),
                ],
                routeWhileDragging: false,
                addWaypoints: false,
                draggableWaypoints: false,
                fitSelectedRoutes: true,
                show: false,
                createMarker:()=>null
            }).addTo(map);

            return () => map.removeControl(routingControl);
        }, [map, start, end]);

        return null;
    }
function DeliveryBoyTracking({ data }) {


    const deliveryBoyLat = data.deliveryBoyLocation.lat
    const deliveryBoyLon = data.deliveryBoyLocation.lon

    
    const customerLat = data?.customerLocation?.lat || data?.currentLocation?.lat 
    const customerLon = data?.customerLocation?.lon || data?.currentLocation?.lon 

    const path =
        [
            [deliveryBoyLat, deliveryBoyLon], [customerLat, customerLon]
        ]


    const center = [deliveryBoyLat, deliveryBoyLon]


        
    return (
        <div className='w-full h-70  mt-3 rounded-xl overflow-hidden shadow-xl'>
            <MapContainer className='w-full h-full' center={center} zoom={13}>

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[deliveryBoyLat, deliveryBoyLon]} icon={deliveryBoyIcon}>
                    <Popup>DeliveryBoy</Popup>
                </Marker>
                <Marker position={[customerLat, customerLon]} icon={customerIcon}>
                    <Popup>Customer</Popup>
                </Marker>
                {/* <Polyline positions={path}/> */}
                <Routing
                    start={[deliveryBoyLat, deliveryBoyLon]}
                    end={[customerLat, customerLon]}
                />
            </MapContainer>
        </div>
    )
}

export default DeliveryBoyTracking
