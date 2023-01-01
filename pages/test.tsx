import { useState } from "react";
import Chart from "chart.js/auto"
import StreamingPlugin from 'chartjs-plugin-streaming';
import "chartjs-adapter-moment"
import { AudioAmplitudeChart } from "../lib/components/AudioAmplitudeChart";
import { useMeasurementBpm } from "../lib/hooks/useMeasurementBpm";
import { useEffect, useRef } from "react";


export default function test() {

    const chartRef = useRef<Chart<"line">>(null);
    const { bpms, measureBpm } = useMeasurementBpm(); 
    const [overTime, setOverTime] = useState<number>(0);
    const [isOver, setIsOver] = useState<boolean>(false);

    useEffect(() => {
        setInterval(() => {
            if (!chartRef.current) return

            const values = chartRef.current.data.datasets[0].data;
            if (!values.length) return

            if ((values[values.length - 1]! as {x: number, y: number}).y > 150 && !isOver) {
                setOverTime(Date.now());
                setIsOver(true);
                console.log("test");
            }

            if ((values[values.length - 1]! as {x: number, y: number}).y < 150 && Date.now() - overTime < 50 && isOver) {
                console.log("a");
                measureBpm();
                setOverTime(0);
                setIsOver(false);
            }

        }, 10);
    }, [isOver])

    return <>
        <AudioAmplitudeChart ChartRef={chartRef}/>
        <p>BPM: {bpms.join(", ")}</p>
    </>

}