// Copyright [2023] [wavem-reidlo]
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import mqtt, { IClientOptions } from 'mqtt';

/**
 * Class for MQTT Connections
 * @author wavem-reidlo
 * @version 1.0.0
 * @since 2023.03.27
 * @see MqttClient
 */
export default class MqttClient {


    broker_url: string;

    connect_opts: IClientOptions;
    /**
     * field for this class instance
     */
    client: mqtt.MqttClient;

    /**
     * constructor for initialize url, client & invoke this#onConnect()
     * @see onConnect
     */
    constructor() {
        this.connect_opts = {
            host: '121.134.167.202',
            port: 32808,
            protocol: 'ws',
            username: "wavem",
            password: "wavem1234",
            path: '/ws'
        };

        this.broker_url = `${this.connect_opts.protocol}://${this.connect_opts.host}:${this.connect_opts.port}${this.connect_opts.path}`
        this.client = mqtt.connect(this.broker_url, this.connect_opts);
        this.onConnect();
    };

    /**
     * private void function for connect MQTT & handle MQTT Connections' Error
     */
    private onConnect(): void {
        this.client!.on("connect", () => {
            if (this.client!.connected) {
                console.log(`[MQTT] connected with [${this.broker_url}]`);
            }
            else {
                console.error('[MQTT] connection disconnected');
            }
        });
        this.client!.on("error", (err) => {
            console.error(`[MQTT] connection on ${err}`);
        });
    };

    /**
     * public void function for MQTT publishing
     * @param topic
     * @param message
     * @see MqttClient
     * @see client
     */
    public publish(topic: string, message: string): void {
        try {
            this.client!.publish(topic, message);
        } catch (error: any) {
            console.error(`[MQTT] publishing errror : ${error}`);
            throw new Error(error);
        };
    };

    /**
     * public void function for MQTT subscriptions
     * @param topic
     * @see MqttClient
     * @see client
     */
    public subscribe(topic: string, callback?: mqtt.ClientSubscribeCallback | undefined): void {
        try {
            this.client!.subscribe(topic, function (err: Error | null, granted: mqtt.ISubscriptionGrant[] | undefined) {
                if (err) {
                    console.error(`[MQTT] ${topic} subscription on ${err}`);
                    return;
                };
                console.log(`[MQTT] subscription has granted by topic {${granted![0].topic}}`);
            });
        } catch (error: any) {
            console.error(`[MQTT] {${topic}} subscription : ${error}`);
            throw new Error(error);
        };
    };

    public unsubscribe_after_connection_check(topic: string): void {
        try {
            const is_mqtt_connected: boolean = this.client!.connected;
            if (is_mqtt_connected) {
                this.client!.unsubscribe(topic);
                console.log(`[MQTT] unsubcribed on [${topic}]`);
            } else return;
        } catch (error: any) {
            console.error(`[MQTT] {${topic}} unsubscription : ${error}`);
            throw new Error(error);
        };
    };
};