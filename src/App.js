import { useRef, useEffect, useState } from 'react'
import * as tt from '@tomtom-international/web-sdk-maps'
import * as ttapi from '@tomtom-international/web-sdk-services'
import './App.css'
import '@tomtom-international/web-sdk-maps/dist/maps.css'
import './routes/template.js'
import cars from './routes/template.js'
import Axios from 'axios'



const App = () => {


  // Axios.get('/api/requests/all').then((res)=>{
  //   console.log(res)
  // }).catch(e=>console.log(e));

  // const path = Axios.get('/api/path/all').then((res)=>{
  //   console.log(res)
  // }).catch(e=>console.log(e));

  // const getPath =async ()=>{

  //   const path = await Axios.get('/api/path/all');
  //   const {data} = path;
  // console.log(data[0].car0[0].lat);
  
   

  // }
// getPath();
  //Axios.post('/api/path/add', {cars0:destinations[0].lat}).then(res=>{console.log(res)}).catch(e=>console.log(e));
  // getPath();


//   const cars= [
//     {
//         title:"car1",
//         lat:[85,59,36,59,54,85,85,65,66,75],
//         lon:[81.25,54.25],
//     },
//     {
//         title:"car2",
//         lat:[81.25,54.25],
//         lon:[81.25,54.25],
//     },
//     {
//         title:"car3",
//         lat:[81.25,54.25],
//         lon:[81.25,54.25],
//     }
 
// ]
  
  const mapElement = useRef()
  const [map, setMap] = useState({})
  const [longitude, setLongitude] = useState(85.8397607)
  const [latitude, setLatitude] = useState(20.2550553)
  const origin = {
    lng: longitude,
    lat: latitude,
  }

  

  const convertToPoints = (lngLat) => {
    return {
      point: {
        latitude: lngLat.lat,
        longitude: lngLat.lng
      }
    }
  }

  const drawRoute = (geoJson, map) => {
    if (map.getLayer('route')) {
      map.removeLayer('route')
      map.removeSource('route')
    }
    map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: geoJson
      },
      paint: {
        'line-color': '#4a90e2',
        'line-width': 6
  
      }
    })
  }


  const addDeliveryMarker = (lngLat, map) => {
    const element = document.createElement('div')
    element.className = 'addLocationMarker'
    new tt.Marker({
      element: element
    })
    .setLngLat(lngLat)
    .addTo(map)

  }

  const addRequestMarker = (lngLat, map) => {
    const element = document.createElement('div')
    element.className = 'addLocationMarker2'
    new tt.Marker({
      element: element
    })
    .setLngLat(lngLat)
    .addTo(map)
  }

  // {lng:lngLat.lng,lat:lngLat.lat}
  const sortDestinations = (locations) => {
    const pointsForDestinations = locations.map((destination) => {     
      return convertToPoints(destination)
    })
    
    

    const callParameters = {
      key: process.env.REACT_APP_SOH_MAP_KEY,
      destinations: pointsForDestinations,
      origins: [convertToPoints(origin)],
    }
    
  return new Promise((resolve, reject) => {
    ttapi.services
      .matrixRouting(callParameters)
      .then((matrixAPIResults) => {
        const results = matrixAPIResults.matrix[0]
        const resultsArray = results.map((result, index) => {
          return {
            location: locations[index],
            drivingtime: result.response.routeSummary.travelTimeInSeconds,
          }
        })
        resultsArray.sort((a, b) => {
          return a.drivingtime - b.drivingtime
        })
        const sortedLocations = resultsArray.map((result) => {
          return result.location
        })
        resolve(sortedLocations)
      })
    })
  }

  const recalculateRoutes = () => {
    sortDestinations(destinations).then((sorted) => {
      sorted.unshift(origin)

      ttapi.services
        .calculateRoute({
          key: process.env.REACT_APP_SOH_MAP_KEY,
          locations: sorted,
        })
        .then((routeData) => {
          const geoJson = routeData.toGeoJson()
          drawRoute(geoJson, map)
      })
      
       console.log(destinations);
    })
  }
  
  const clear =async ()=>{
    await window.location.reload()
  }

  // const changeState =(nums)=>{

  //   setFlag(nums,x=> console.log("f "+ x)) ;
  //   run(nums);
  // }

  // useEffect(async ()=>{
  //   await run(fl)
  // },[flag]);
 
  const routeRun = async() => {
    
    console.log(flag)
    if(flag==1){
      let i=0
      while(i<requests.length){
      destinations.push(requests.pop())
      i++
      }
      if(requests.length===1)
      destinations.push(requests.pop())

      setflag=0;
    }
    console.log("requests: "+requests)
    console.log('changed'+destinations)
    await destinations.map(async x=>{
    await addDeliveryMarker(x,map)
    await recalculateRoutes()
    console.log(x);

    return x;
  })
  }


  const requestRun = async() => {
    await requests.map(async x=>{
    await addRequestMarker(x,map)
    console.log(x);
    // console.log("flag1"+flag)
    return x;
  })
  }

   const save = () =>{

   }

let[flag, setflag]= useState(0)

  var ll1 = new tt.LngLat(85.83166030777642,20.265039829269966);
  var ll2 = new tt.LngLat(85.83620933426567,20.24764700849964)
  var rl1 = new tt.LngLat(85.84582356499777,20.263580437145023);
  var rl2 = new tt.LngLat(85.84136036919665,20.25093850772366);
  var rl3 = new tt.LngLat(85.81981686638966,20.2531931947627);  
    var destinations = [
      // {
      //   lat:20.265039829269966,
      //   lng:85.83166030777642
      // },
      // {
      //   lat:20.24764700849964,
      //   lng:85.83620933426567
      // }
      ll1,
      ll2
    ]

    const [requests, setrequests] = useState ([
      rl1,
      rl2,
      rl3
    ])

    
        const changeToArray  = () => {
          const xyz=[]
          destinations.map(x=>{
            xyz.push(x.toArray())
            return x
          })
          
          const changeToOC =()=>{
            const zyx=[]
            xyz.map(m=>{
              zyx.push(tt.LngLat.convert(m))
              return m
            })
            console.log(zyx);
          }
          changeToOC()
          console.log(xyz);
          
        }

        useEffect(()=>{
          console.log('\nset :'+flag)
          
        },[setflag]) 

 
  
  useEffect(() => {
    
    
    
    // destinations.push(ll1);
    // destinations.push(ll2)
    // addDeliveryMarker(ll,map);
    // console.log(ll);
    

    let map = tt.map({
      key: process.env.REACT_APP_SOH_MAP_KEY,
      container: mapElement.current,
      stylesVisibility: {
        trafficIncidents: true,
        trafficFlow: true,
      },
      center: [longitude, latitude],
      zoom: 14,
    })
    setMap(map)

    const addMarker = () => {
      // const popupOffset = {
      //   bottom: [0, -25]
      // }
      // const popup = new tt.Popup({ offset: popupOffset }).setHTML('This is you!')
      const element = document.createElement('div')
      element.className = 'marker'

      const marker = new tt.Marker({
        draggable: false,
        element: element,
      })
        .setLngLat([longitude, latitude])
        .addTo(map)
      
      // marker.on('dragend', () => {
      //   const lngLat = marker.getLngLat()
      //   setLongitude(lngLat.lng)
      //   setLatitude(lngLat.lat)
      // })

      // marker.setPopup(popup).togglePopup()
      
    }
    addMarker()

    const sortDestinations = (locations) => {
      const pointsForDestinations = locations.map((destination) => {     
        return convertToPoints(destination)
      })
      
      

      const callParameters = {
        key: process.env.REACT_APP_SOH_MAP_KEY,
        destinations: pointsForDestinations,
        origins: [convertToPoints(origin)],
      }

    return new Promise((resolve, reject) => {
      ttapi.services
        .matrixRouting(callParameters)
        .then((matrixAPIResults) => {
          const results = matrixAPIResults.matrix[0]
          const resultsArray = results.map((result, index) => {
            return {
              location: locations[index],
              drivingtime: result.response.routeSummary.travelTimeInSeconds,
            }
          })
          resultsArray.sort((a, b) => {
            return a.drivingtime - b.drivingtime
          })
          const sortedLocations = resultsArray.map((result) => {
            return result.location
          })
          resolve(sortedLocations)
        })
      })
    }

    const recalculateRoutes = () => {
      sortDestinations(destinations).then((sorted) => {
        sorted.unshift(origin)
        console.log("this:"+sorted[0])

        ttapi.services
          .calculateRoute({
            key: process.env.REACT_APP_SOH_MAP_KEY,
            locations: sorted,
          })
          .then((routeData) => {
            const geoJson = routeData.toGeoJson()
            drawRoute(geoJson, map)
        })
        //  console.log(destinations);
      })
    }

    // const storeRoutes =  () => {
    //   try{

    //     cars[0].lat.length = 0 ;
    //     cars[0].lng.length = 0 ;
    //     destinations.map(x=>{
    //       cars[0].lat.push(x.lat);
    //       cars[0].lng.push(x.lng);
    //       // console.log(x.lat);
    //       // console.log(x.lon)
    //       console.log( "cars" +cars[0].lat+ " "+cars[0].lng)
    //       return x;
    //     })
        
    //   }
    //   catch(err){
    //     console.log(err);

    //   }
    // }
    // cars[0].lat.push(100000);
    // console.log(cars[0].lat);

    // function showRoutesMap(){
    //   console.log('hi')
    // }
    

    // const addCoordiantes =(e)=>{
    //   destinations[0].lng.push(e.lng);
    //   destinations[0].lat.push(e.lat);

    // }

    

    // const addOldRoutes =()=>{
    //   cars[0].lat.map(x =>{
    //     destinations.push(x)
    //   })
    //   cars[0].lng.map(x =>{
    //     destinations.push(x)
    //   })
    // }

    

    

    
    
      


    
    return () => map.remove()
  }, [longitude, latitude])

  return (
    <>
      {map && (
        <div className="app">
          <div ref={mapElement} className="map" />
          <div>
          <button onClick ={()=>{
            setflag(1)
            requestRun()
            }}>request</button>

          <button onClick ={()=>{ 
            console.log("why")
            routeRun()
            }}>route</button>
          <button onClick ={clear}>clear me 2</button>
          <button >Save changes</button>
          </div>
          
        </div>
      )}
    </>
  )
}

export default App
