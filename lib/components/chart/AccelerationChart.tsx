import { memo, RefObject } from "react";
import Chart from "chart.js/auto"
import { Line } from "react-chartjs-2";
import StreamingPlugin from 'chartjs-plugin-streaming';
import Annotation from "chartjs-plugin-annotation";
import "chartjs-adapter-moment"
import { Box } from "@mui/system";
import { useAcceleration } from "../../hooks/useAcceleration";

Chart.register(StreamingPlugin, Annotation);

type PropsType = {
    chartRef?: RefObject<Chart<"line">>
    threshold: number
}

// eslint-disable-next-line react/display-name
export const AccelerationChart = memo(({ chartRef, threshold = 5}: PropsType) => {
    const { accs, renderRequestButton } = useAcceleration();

    const renderChart = () => {
        if (!accs) return
        const data = {
            datasets: [{
                label: "acceleration", 
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
                content: "この線を超える加速度でリズムを刻め！"
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
                        duration: 3000,
                        refresh: 20,
                        onRefresh: (chart : Chart<"line">) => {
                            const { x, y, z } = accs;
                            const max = Math.max(x!, y!, z!);
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
        {accs ?
         <Box>
           { renderChart() }
           { renderRequestButton() }
         </Box>
        : renderRequestButton()}
    </>
})