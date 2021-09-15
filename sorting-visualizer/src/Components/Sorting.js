import React, {useState, useEffect, useReducer, useRef} from 'react'
import ReactSlider from 'react-slider'
import Swap from './Helpers/Swap';
import SetColor from './Helpers/SetColor';

// Used to rerender every x milliseconds (x being the speed state in this script)
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

function Sorting({pause}) {

    let resetRef = useRef();
    // Trick to Intialize countRef.current on first render only.
    resetRef.current = resetRef.current || false; 
    
    useEffect(() => {
      if (resetRef.current === true) {
        setCount(0);
      }
    });

    // State is used to hold data that needs to be stored between loops
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [algo, setAlgo] = useState(0);
    const [speed, setSpeed] = useState(25)
    useInterval(()=> {
      if (pause) {
        resetRef.current = true;
        return;
      }
      resetRef.current = false;

      // the sorting algorithms are called every tick
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
      // the below value determines the delay between ticks in milliseconds, as set by 'speed'
    }, pause ? null : speed);

    const [sorted, setSorted] = useState(false);

    function BubbleSort(array){

        setCount(count+1)
        if (count < array.length - 1) {
            // if the next value is smaller, swap the two values
            if (array[count].value > array[count+1].value){
                
                // Sets the color of the values being compared, and also resets the colors of irrelevant values
                array.forEach(element => {
                    element.color = SetColor(element.value);
                });
                array[count].color = 'red';
                array[count+1].color = 'red';
                
                array = Swap(count, count+1, array)
                setData(array)
                setSorted(false);
            } else {
              array.forEach(element => {
                element.color = SetColor(element.value);
              });
              if (sorted !== true)
                array[count].color = 'green';
              setData(array);
            }
        } else {
            setSorted(true)
            setCount(0)
        }
        
    }

    const [idx, setIdx] = useState(0);
    function InsertionSort(array){
      if (idx > 0){
        array.forEach(element => {
          element.color = SetColor(element.value);
        });
        array[idx].color = 'red';
        array[idx+1].color = 'red';
        array[count].color = 'green';
        if (array[idx].value > array[idx+1].value){
          array = Swap(idx, idx+1, array)
          setIdx(idx-1);
        } else {
          setIdx(0)
        }
        setData(array)
      }
      else if (count < array.length - 1){
        setCount(count+1);
        setIdx(count);
        array[count].color = 'green';
        setData(array)
      }
    }

    useEffect(() => {
      resetData();
    }, [])

    const resetData = (e) => {
      if (e)
        e.preventDefault();
      setCount(0);
      setIdx(0);

      // 
      var dataValues = Array.from({length: 80}, ()=> Math.floor(Math.random() * 51));
      var newData = [{}];
      dataValues.forEach(num => {
          newData.push({
              value: num,
              color: SetColor(num),
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

    const changeSpeed = (e) => {
      console.log(e)
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
          <div className="col" id="Slider">
            <div className="row">
              <h1 className="col-sm-3">Speed:</h1>
              <ReactSlider
              className="horizontal-slider col"
              thumbClassName="example-thumb"
              trackClassName="example-track"
              defaultValue={25}
              min = {1}
              max = {100}
              onChange={(e)=>setSpeed(e)}
              />
            </div>
          </div>
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