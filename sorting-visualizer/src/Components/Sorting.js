import React, {useState, useEffect, useReducer, useRef} from 'react'
import ReactSlider from 'react-slider'

function useInterval(callback, delay) {
    const savedCallback = useRef();
    useEffect(() => {
      savedCallback.current = callback;
    });
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }, [delay]);
  }

  const Slider = () => {
    return (
      <ReactSlider
        className="horizontal-slider"
        thumbClassName="example-thumb"
        trackClassName="example-track"
      />
    );
  };
// Timer component
function Sorting({pause}) {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [resetCount, setResetCount] = useState(false);
    const [algo, setAlgo] = useState(0);
    const [speed, setSpeed] = useState(25)
    
    let resetRef = useRef();
    // Trick to Intialize countRef.current on first render only.
    resetRef.current = resetRef.current || false; 
    
    useEffect(() => {
      if (resetRef.current === true) {
        setCount(0);
      }
    });
    useInterval(()=> {
      if (pause) {
        resetRef.current = true;
        return;
      }
      resetRef.current = false;
      switch(algo){
        case 0:
          break;
        case 1:
          BubbleSort(data);
          break;
        case 2:
          InsertionSort(data);
          break;
      }
      if (resetCount === true){
          setCount(0);
          setResetCount(false)
      }
      
      // the below value determines the delay between ticks in milliseconds
    }, pause ? null : speed);

    const [sorted, setSorted] = useState(false);
    function BubbleSort(array){
      // our loop
        if (count < array.length - 1) {
            // need to mark array[count]
            if (array[count].value > array[count+1].value){
                // if the next value is smaller, swap the two values
                array.forEach(element => {
                    element.color = 'rgb('+element.value*2+','+element.value*3+','+element.value*5+')';
                });
                array[count].color = 'red';
                array[count+1].color = 'red';
                var a = array[count].value;
                var b = array[count+1].value;
                array[count].value = b;
                array[count+1].value = a;
                setData(array)
                setSorted(false);
            } else {
              array.forEach(element => {
                element.color = 'rgb('+element.value*2+','+element.value*3+','+element.value*5+')';
              });
              if (sorted !== true)
                array[count].color = 'green';
              
            }
        } else {
            console.log('loop exceeded')
            setSorted(true)
            setResetCount(true)
            // check if array is sorted
            array.forEach(element => {
              element.color = 'rgb('+element.value*2+','+element.value*3+','+element.value*5+')';
          });
        }
        setCount(count+1)
    }

    const [idx, setIdx] = useState(0);
    function InsertionSort(array){
      if (idx > 0){
        array.forEach(element => {
          element.color = 'rgb('+element.value*2+','+element.value*3+','+element.value*5+')';
        });
        array[count].color = 'green';
        array[idx].color = 'red';
        array[idx+1].color = 'red';
        if (array[idx].value > array[idx+1].value){
          var a = array[idx].value;
          var b = array[idx+1].value;
          array[idx].value = b;
          array[idx+1].value = a;
          setIdx(idx-1);
        } else {
          setIdx(0)
        }
        setData(array)
      }
      else if (count < array.length - 1){
        setCount(count+1);
        array[count].color = 'green';
        setIdx(count);
      }
    }

    useEffect(() => {
      resetData();
    }, [])

    const resetData = (e) => {
      if (e)
        e.preventDefault();
      setCount(0);
      setIdx(0)
      var dataValues = Array.from({length: 80}, ()=> Math.floor(Math.random() * 51));
      var newData = [{}];
      dataValues.forEach(num => {
          newData.push({
              value: num,
              color: 'white'
          })
      });
      setData(newData);
    }

    const changeAlgo = (e, idx) => {
      e.preventDefault();
      setCount(0);
      setIdx(0);
      setAlgo(idx);
      setSorted(false);
    }

    console.log(speed)
    return (
      <div className="container-fluid">
        <div className="row">
          <button onClick={(e)=>changeAlgo(e, 1)} className="col">Bubble Sort</button>
          <button onClick={(e)=>changeAlgo(e, 2)} className="col">Insertion Sort</button>
        </div>
        <div className="row">
          <button onClick={(e)=>{resetData(e); changeAlgo(e, 0)}} className="col">Reset</button>
        </div>
        <div className="row">
          <h1>Speed:</h1>
          <ReactSlider
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          defaultValue={25}
          renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
          onChange={(props, state)=>{setSpeed(state.valueNow)}}
        />
        </div>
        <div id="Graph" className="row align-items-end justify-content-center">
            {
                data.map(item =>{
                    return (<div className="bar" style={{height: item.value*10, backgroundColor: item.color}}></div>);
                })
            }
        </div>
      </div>
    );
  }

export default Sorting;