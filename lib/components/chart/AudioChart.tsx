import { RefObject, memo } from "react"
import Chart from "chart.js/auto"
import StreamingPlugin from 'chartjs-plugin-streaming';
import Annotation from "chartjs-plugin-annotation";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-moment"

Chart.register(StreamingPlugin, Annotation);

type PropsType = {
    analyser: AnalyserNode | null,
    threshold?: number,
    chartRef?: RefObject<Chart<"line">>
}

const AudioChart = ({ analyser, threshold = 180, chartRef}: PropsType) => {

    if (!analyser) return <></>

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
            content: "Range to count"
        },
        font: {
            size: 10
        }
    }
    const options: any = {
        maintainAspectRatio: false,
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
                grid: {
                    display: false
                },
                type: "realtime", 
                realtime: {
                    duration: 2000,
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
                },
                grid: {
                    display: false
                }
            }
        }
    }

    return <Line data={data} options={options} ref={chartRef} />
}

export default memo(AudioChart)