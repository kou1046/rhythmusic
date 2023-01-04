import { memo, RefObject, useCallback } from "react";
import Chart from "chart.js/auto"
import { Line } from "react-chartjs-2";
import StreamingPlugin from 'chartjs-plugin-streaming';
import Annotation from "chartjs-plugin-annotation";
import "chartjs-adapter-moment"
import { Box } from "@mui/system";
import { useMicrophone } from "../../hooks/useMicrophone";

Chart.register(StreamingPlugin, Annotation);

type PropsType = {
    chartRef?: RefObject<Chart<"line">>
    threshold: number
}

// eslint-disable-next-line react/display-name
export const AudioAmplitudeChart = memo(({ chartRef, threshold = 200}: PropsType) => {
    const { analyser, renderRequestButton, isGranted } = useMicrophone();

    const renderChart = () => {
        if (!analyser) return
        const data = {
            datasets: [{
                label: "amplitude", 
                data: [], 
                borderColor: "black", 
                pointRadius: 0,
                borderWidth: 1
            },
            {
                label: "threshold", 
                data: [],
                borderColor: "red",
                pointRadius: 0,
                borderWidth: 1
            }]
        }

        const annot = {
            type: "line", 
            drawTime: 'afterDatasetsDraw',
            value: threshold,
            scaleID: "y",
            label: {
                display: true,
                content: "この線を超える音量でリズムを刻め！"
            }
        }

        const options: any = {
            plugins: {
                legend: {
                    display: false
                },
                annotation: {
                    annotations: {
                        annot
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        display: false
                    },
                    type: "realtime", 
                    realtime: {
                        delay: 10,
                        duration: 3000,
                        refresh: 20,
                        onRefresh: (chart : Chart<"line">) => {
                            const fftData = new Uint8Array(analyser.fftSize);
                            analyser.getByteTimeDomainData(fftData);
                            const max = fftData.reduce((prev, cur) => Math.max(prev, cur));
                            chart.data.datasets[0].data.push({x: Date.now(), y: max});
                            chart.data.datasets[1].data.push({x: Date.now(), y: threshold});
                        }
                    }
                },
                y: {
                    max: 1.5 * threshold,
                    ticks: {
                        display: false
                    }
                }
            }
        }

        return <Line data={data} options={options} ref={chartRef} />
    }

    return <>
        {analyser ?
         <Box>
           { renderChart() }
           { renderRequestButton() }
         </Box>
        : renderRequestButton()}
    </>
})