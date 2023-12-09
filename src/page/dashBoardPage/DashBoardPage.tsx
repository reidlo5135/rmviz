import { useEffect, useState } from "react";
import control_go_json from '../../assets/json/control_go.json';
import control_stop_json from '../../assets/json/control_stop.json';
import path_assembly_json from '../../assets/json/path_assembly.json';
import path_cnc_manufacture_json from '../../assets/json/path_cnc_manufacture.json';
import path_manufacture_json from '../../assets/json/path_manufacture.json';
import path_packing_json from '../../assets/json/path_packing.json';
import path_transfer_json from '../../assets/json/path_transfer.json';
import path_water_pressure_test_json from '../../assets/json/path_water_pressure_test.json';
import MqttClient from '../../mqtt/mqtt_client';
import './DashBoardPage.css';

export default function DashboardPage() {
    const [mqttClient, setMqttClient] = useState<MqttClient | undefined>();
    const [location, setLocation] = useState<any | undefined>();
    const [taskEvent, setTaskEvent] = useState<any | undefined>();
    const [controlEvent, setControlEvent] = useState<any | undefined>();
    const [controlTopic, setControlTopic] = useState<string | undefined>();
    const [pathTopic, setPathTopic] = useState<string | undefined>();

    useEffect(() => {
        const mqtt_client: MqttClient = new MqttClient();
        setMqttClient(mqtt_client);

        mqtt_client.subscribe('hubilon/atcplus/ros/rco0000043/rbt0000002/location');
        mqtt_client.subscribe('hubilon/atcplus/ros/rco0000043/rbt0000002/task_event');
        mqtt_client.subscribe('hubilon/atcplus/ros/rco0000043/rbt0000002/control_event');

        mqtt_client.client.on('message', (mqtt_topic: string, mqtt_message: any) => {
            try {
                const is_mqtt_topic_location: boolean = (mqtt_topic.endsWith('location'));
                const is_mqtt_topic_task_event: boolean = (mqtt_topic.endsWith('task_event'));
                const is_mqtt_topic_control_event: boolean = (mqtt_topic.endsWith('control_event'));

                if (is_mqtt_topic_location) {
                    const location_json: any = JSON.parse(mqtt_message.toString());
                    setLocation(location_json);
                } else if (is_mqtt_topic_task_event) {
                    const task_event_json: any = JSON.parse(mqtt_message.toString());
                    setTaskEvent(task_event_json);
                } else if (is_mqtt_topic_control_event) {
                    const control_event_json: any = JSON.parse(mqtt_message.toString());
                    setControlEvent(control_event_json);
                } else return;
            } catch (e: any) {
                console.error(`location callback error : ${JSON.stringify(e)}`);
            }
        });
    }, []);

    const publish_control = async (json: any) => {
        try {
            console.log(`publish control json : ${JSON.stringify(json)}`);
            mqttClient!.publish(controlTopic!, JSON.stringify(json));
        } catch (e: any) {
            console.error('Error fetching JSON or publishing to MQTT:', e);
        }
    };

    const publish_path = async (json: any) => {
        try {
            console.log(`publish path json : ${JSON.stringify(json)}`);
            mqttClient!.publish(pathTopic!, JSON.stringify(json));
        } catch (e: any) {
            console.error('Error fetching JSON or publishing to MQTT:', e);
        }
    };

    useEffect(() => {
        setControlTopic('hubilon/atcplus/rms/rco0000043/rbt0000002/control');
        setPathTopic('hubilon/atcplus/rms/rco0000043/rbt0000002/path');
    }, []);

    return (
        <div className="App">
            {/* <img src={slam_map_img} /> */}
            <div className="top_container">
                <div className="robot_info">
                    <div className="location_info">
                        <h1>location x : {location?.lastInfo?.location?.xpos}</h1>
                        <h1>location y : {location?.lastInfo?.location?.ypos}</h1>
                        <h1>sub_location x : {location?.lastInfo?.subLocation?.xpos}</h1>
                        <h1>sub_location y : {location?.lastInfo?.subLocation?.ypos}</h1>
                    </div>
                    <div className="task_event_info">
                        <h1>jobPlanId : {taskEvent?.taskEventInfo?.jobPlanId}</h1>
                        <h1>jobGroupId : {taskEvent?.taskEventInfo?.jobGroupId}</h1>
                        <h1>jobOrderId : {taskEvent?.taskEventInfo?.jobOrderId}</h1>
                    </div>
                    <div className="control_event_info">
                        <h1>controlId : {controlEvent?.controlResult?.controlId}</h1>
                        <h1>controlCmd : {controlEvent?.controlResult?.controlCmd}</h1>
                    </div>
                </div>
                <div className="btn_control_group">
                    <button className="btn_control_go" onClick={() => publish_control(control_go_json)}>GO</button>
                    <button className="btn_control_stop" onClick={() => publish_control(control_stop_json)}>STOP</button>
                </div>
            </div>
            <div className="btn_path_group">
                <button className="btn_path" onClick={() => publish_path(path_cnc_manufacture_json)}>CNC 가공</button>
                <button className="btn_path" onClick={() => publish_path(path_manufacture_json)}>가공</button>
                <button className="btn_path" onClick={() => publish_path(path_assembly_json)}>조립</button>
                <button className="btn_path" onClick={() => publish_path(path_water_pressure_test_json)}>수압 테스트</button>
                <button className="btn_path" onClick={() => publish_path(path_packing_json)}>패킹</button>
                <button className="btn_path" onClick={() => publish_path(path_transfer_json)}>이송</button>
            </div>
        </div>
    );
};