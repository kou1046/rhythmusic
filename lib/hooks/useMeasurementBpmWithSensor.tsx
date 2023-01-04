import { useCallback, useRef } from "react";
import Chart from "chart.js/auto";
import { useMeasurementBpm } from "./useMeasurementBpm";
import { useInterval } from "./useInterval";
import { RefObject } from "react";

export const useMeasurementBpmWithSensor = ( chartRef: RefObject<Chart<"line">> ) => {

    const { bpms, setBpms, measureBpm } = useMeasurementBpm();
    const startOverTime = useRef<number>(0);

    useInterval(() => {
        if (!chartRef.current) return ;

        const values = chartRef.current.data.datasets[0].data as Array<{x: number, y: number} | undefined>;
        const recentValue = values[values.length - 1];
        
        if (!recentValue) return;

        const threshold = chartRef.current.data.datasets[1].data;
        const recentThreshold = (threshold[threshold.length - 1]! as {x: number, y:number}).y;

        if ( recentValue.y > recentThreshold ) {
            startOverTime.current = Date.now();
        }

        if ((recentValue.y < recentThreshold) && (Date.now() - startOverTime.current < 100)) {
            measureBpm();
            startOverTime.current = 0;
        }
    }, 20)

    return { bpms, setBpms, measureBpm }
}