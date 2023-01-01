import { GetStaticProps } from 'next'
import { Box } from '@mui/system';
import { Grid } from '@mui/material';
import Chart from "chart.js/auto"
import { Line } from "react-chartjs-2"
import StreamingPlugin from 'chartjs-plugin-streaming';
import "chartjs-adapter-moment"
import { ja } from 'date-fns/locale';
import { LoginButton } from '../lib/components/LoginButton';
import { LogoutButton } from '../lib/components/LogoutButton';
import { useLogin } from '../lib/hooks/useLogin';
import { useAcceleration } from '../lib/hooks/useAcceleration';
import axios from 'axios';
import { spotifyAPI } from '../lib/utils';

Chart.register(StreamingPlugin) ;

export const getStaticProps: GetStaticProps<pageProps> = async () => {
  return { props : {
    clientID: process.env.CLIENT_ID as string, 
    clientSecret: process.env.CLIENT_SECRET as string,
    redirectUri: process.env.REDIRECT_URI as string
  }}
}

type pageProps = {
  clientID: string,
  clientSecret: string, 
  redirectUri: string
}

export default function Home(pageprops: pageProps) {

  const { data: loginData, error: loginError, isValidating, mutate: loginMutate } = useLogin();
  const { accs, status, renderRequestButton } = useAcceleration();

  const renderChart = () => {

    const data = {
      datasets: [{
        label: "acceleration", 
        data: [],
        pointRadius: 0,
        borderColor: "black",
        borderWidth: 1.5
      }]
    }

    const options: any = {
      maintainAspectRation: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          type: "realtime",
          adapters: {
            date: {
              locale: ja
            }
          },
          realtime: {
            duration: 10000,
            refresh: 20,
            onRefresh: ({ data } : Chart<"line">) => {
              data.datasets.forEach(dataset => {
                dataset.data.push({x: Date.now(), y: accs?.z!})
              })
            }
          }, 
          ticks: {
            display: false,
          }
        },
        y: {
          min: -5,
          max: 5,
          title: {
            display: true,
            text: "Acceleration [m/s^2]",
            color: "black",
          }, 
          ticks: {
            color: "black"
          }
        },
        
      }
    }
    console.log(loginData);
        return <>
        <Box sx={{maxWidth: 780}} >
          <Line data={data} options={options}/>
        </Box>
        </>
  }



  return (
    <>
      <Grid container justifyContent="center" alignContent="center">
        <Grid item>
          {loginData?.accessToken ? <LogoutButton loginMutate={ loginMutate }/>: <LoginButton { ...pageprops }></LoginButton>}
        </Grid>
        <Grid item xs={12}>
          {status === "default" ? renderRequestButton() : renderChart()}
        </Grid>
      </Grid>
      <button onClick={ async () => {
        const res = await axios.get("/api/topartisttracks");
        console.log(res.data);
      }}>test</button>
    </>
  )
}
