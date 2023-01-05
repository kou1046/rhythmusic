import { useCallback, useRef, RefObject, useState } from "react";
import Chart from "chart.js/auto";
import { useMeasurementBpm } from "./useMeasurementBpm";
import { useInterval } from "./useInterval";

const useMeasurementBpmWithChart = () => {

    const { bpms, setBpms, measureBpm } = useMeasurementBpm();
    const startOverTime = useRef<number>(0);
    const [ chart, setChart ] = useState<Chart<"line"> | null>(null);

    useInterval(() => {
        if (!chart) return ;

        const values = chart.data.datasets[0].data as Array<{x: number, y: number} | undefined>;
        const recentValue = values[values.length - 1];
        
        if (!recentValue) return;

        const threshold = chart.data.datasets[1].data;
        const recentThreshold = (threshold[threshold.length - 1]! as {x: number, y:number}).y;

        if ( recentValue.y > recentThreshold ) {
            startOverTime.current = Date.now();
        }

        if ((recentValue.y < recentThreshold) && (Date.now() - startOverTime.current < 100)) {
            measureBpm();
            startOverTime.current = 0;
        }
    }, 20)

    return { bpms, setBpms, setChart, measureBpm }
}

export default useMeasurementBpmWithChart