import { useEffect, useState } from "react";
import ROSLIB from "roslib";


export default function GpsToSLAMConversionPage() {
    const rclReactUrl: string = "ws://192.168.0.187:9090";
    const rosLibRos: ROSLIB.Ros = new ROSLIB.Ros({ url: rclReactUrl });
    const [gpsToSLAMConvertClient, setGpsToSLAMConvertClient] = useState<ROSLIB.Service | undefined>(undefined);
    const [longitudeValue, setLongitudeValue] = useState("");
    const [latitudeValue, setLatitudeValue] = useState("");
    const [slamX, setSLAMX] = useState("");
    const [slamY, setSLAMY] = useState("");

    const onROSLIBConnect = (): void => {
        if (!rosLibRos.isConnected) {
            console.log(`RCLReact try to reconnect... ${rclReactUrl}`);
            rosLibRos.connect(rclReactUrl);
        };
        rosLibRos.on('connection', function () {
            console.log(`RCLReact connected with ${rclReactUrl}`);
        });
        rosLibRos.on('error', function (error) {
            console.error(`RCLReact error : ${JSON.stringify(error)}`);
        });
        rosLibRos.on('close', function () {
            console.log('RCLReact Connection closed');
        });
    }

    const requestConvert = async (serviceRequest: ROSLIB.ServiceRequest, conversionTarget: string) => {
        gpsToSLAMConvertClient!.callService(serviceRequest, function (response) {
            console.info(`gpsToSLAMConvertResponse : ${JSON.stringify(response)}`);
            if (conversionTarget == "SLAM")
            {
                const position = response.slam_pose_response_list[0].position;

                const slam_x = document.getElementById("slam_x");
                slam_x!.innerHTML = position.x;
    
                const slam_y = document.getElementById("slam_y");
                slam_y!.innerHTML = position.y;
    
                const pixel_x = document.getElementById("pixel_x");
                pixel_x!.innerHTML = (position.x * 20.0).toString();
    
                const pixel_y = document.getElementById("pixel_y");
                pixel_y!.innerHTML = (position.y * 20.0).toString();
            }
            else
            {
                const gps = response.gps_response_list[0];

                const longitude = document.getElementById("longitude");
                longitude!.innerHTML = gps.longitude;

                const latitude = document.getElementById("latitude");
                latitude!.innerHTML = gps.latitude;
            }
        }, (err: string) => {
            console.error(`err : ${err}`);
        });
    }

    const handleSetLongitudeValueChange = (event: any) => {
        if (event.target.value.includes("°")) {
            setLongitudeValue(event.target.value.split("°")[0]);
        }
        else {
            setLongitudeValue(event.target.value);
        }
    }

    const handleSetLatitudeValueChange = (event: any) => {
        if (event.target.value.includes("°")) {
            setLatitudeValue(event.target.value.split("°")[0]);
        }
        else {
            setLatitudeValue(event.target.value);
        }
    }

    const handleSetSLAMXValueChange = (event: any) => {
        setSLAMX(event.target.value);
    }

    const handleSetSLAMYValueChange = (event: any) => {
        setSLAMY(event.target.value);
    }

    useEffect(() => {
        onROSLIBConnect();

        const client = new ROSLIB.Service({
            ros: rosLibRos,
            name: "/gps_slam_converter/conversion",
            serviceType: "gps_slam_conversion_msgs/Conversion"
        });
        setGpsToSLAMConvertClient(client);
    }, []);

    return (
        <div>
            <div style={{display: 'flex', justifyContent:'space-between', width: '600px', height:'300px', margin: '0 auto'}}>
                <div>
                    <p>Longitude</p>
                    <input type="text" value={longitudeValue} onChange={handleSetLongitudeValueChange} />
                    <p>Latitude</p>
                    <input type="text" value={latitudeValue} onChange={handleSetLatitudeValueChange} />
                    <br></br>
                    <br></br>
                    <button onClick={() => {
                        requestConvert({
                            conversion_target: "SLAM",
                            gps_request_list: [{
                                longitude: parseFloat(longitudeValue!),
                                latitude: parseFloat(latitudeValue!)
                            }]
                        }, "SLAM")
                    }}>변환</button>
                </div>
                <div>
                    <p>SLAM X</p>
                    <input type="text" value={slamX} onChange={handleSetSLAMXValueChange} />
                    <p>SLAM Y</p>
                    <input type="text" value={slamY} onChange={handleSetSLAMYValueChange} />
                    <br></br>
                    <br></br>
                    <button onClick={() => {
                        requestConvert({
                            conversion_target: "GPS",
                            slam_pose_request_list: [{
                                x: parseFloat(slamX!),
                                y: parseFloat(slamY!)
                            }]
                        }, "GPS")
                    }}>변환</button>
                </div>
            </div>
            <div>
                <h3><strong>Result</strong></h3>
                <p>SLAM</p>
                <div id="slam_x"></div>
                <div id="slam_y"></div>

                <br></br>
                <br></br>

                <p>PIXEL</p>
                <div id="pixel_x"></div>
                <div id="pixel_y"></div>

                <p>GPS</p>
                <div id="longitude"></div>
                <div id="latitude"></div>
            </div>
        </div>
    );
}