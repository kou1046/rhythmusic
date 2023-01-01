import Chart from "chart.js/auto"
import { Line } from "react-chartjs-2";
import { memo, MutableRefObject, RefObject, useEffect, useState } from "react";
import StreamingPlugin from 'chartjs-plugin-streaming';
import "chartjs-adapter-moment"
import { useMicrophone } from "../hooks/useMicrophone";

Chart.register(StreamingPlugin);

type PropsType = {
    ChartRef?: RefObject<Chart<"line">>
}

export const AudioAmplitudeChart = memo(({ ChartRef }: PropsType) => {
    const { analyser, renderRequestButton } = useMicrophone();

    const renderChart = () => {
        if (!analyser) return
        const data = {
            datasets: [{
                data: [], 
                pointRadius: 0
            }]
        }

        const options: any = {
            scales: {
                x: {
                    type: "realtime", 
                    realtime: {
                        duration: 10000,
                        refresh: 20,
                        onRefresh: ({ data } : Chart<"line">) => {
                          data.datasets.forEach(dataset => {
                            const amps = new Uint8Array(analyser.fftSize);
                            analyser.getByteTimeDomainData(amps);
                            const max = amps.reduce((prev, cur) => Math.max(prev, cur));
                            dataset.data.push({x: Date.now(), y: max})
                          })
                        }
                    }
                }
            }
        }

        return <Line data={data} options={options} ref={ChartRef} />
    }

    return <>
        {analyser ? renderChart(): renderRequestButton()}
    </>
})