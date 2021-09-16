import React, {useState, useEffect, useRef} from 'react'
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
    const [arrayLength, setArrayLength] = useState(100);
    useInterval(()=> {
      if (pause) {
        resetRef.current = true;
        return;
      }
      resetRef.current = false;

      // the sorting algorithms are called every tick
      try{

        switch(algo){
          case 0:
            break;
          case 1:
            console.log('bubble')
            BubbleSort(data);
            break;
          case 2:
            console.log('insertion')
            InsertionSort(data);
            break;
          case 3:
            console.log('selection')
            SelectionSort(data);
            break;
        }
      } catch(error) {
        console.log(error)
      }
      console.log('tick')
      // This code dynamically updates the array, and is placed in useInterval so it only runs once per tick
      if (data.length < arrayLength){
        console.log('adding')
        var dataValues = Array.from({length: (arrayLength-data.length)}, ()=> Math.floor(Math.random() * 51));
        var newData = data;
        dataValues.forEach(num => {
            newData.push({
                value: num,
                color: SetColor(num),
            })
        });
        setData(newData);
      } 
      if (data.length > arrayLength){
        setData(data.slice(0, arrayLength));
      }
      // the below value determines the delay between ticks in milliseconds, as set by 'speed'
    }, pause ? null : speed);

    const [sorted, setSorted] = useState(false);

    function BubbleSort(array){
        setCount(count+1)
        if (count < array.length - 1) {
          //array[count].color = 'green';
            // if the next value is smaller, swap the two values
            array.forEach(element => {
              element.color = SetColor(element.value);
            });
            if (array[count].value > array[count+1].value){
                // Sets the color of the values being compared, and also resets the colors of irrelevant values
                array[count].color = 'red';
                array[count+1].color = 'red';
                array = Swap(count, count+1, array)
                setSorted(false);
            } else {
                array[count].color = 'green';
            }
            setData(array);
        } else {
            if (sorted !== true)
              setCount(0)
            setSorted(true)
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

    const [smallest, setSmallest] = useState(0);
    function SelectionSort(array){
      if (idx < array.length-1){
        array.forEach(element => {
          element.color = SetColor(element.value);
        });
        array[smallest].color = 'red';
        array[idx].color = 'red';
        array[count].color = 'green';
        if (count === idx) {
          setSmallest(idx)
        }
        if (count < array.length-1){
          if (array[smallest].value > array[count+1].value){
            console.log('new smallest')
            setSmallest(count+1);
          }
          setCount(count+1);
        } else {
          array = Swap(idx, smallest, array);
          setIdx(idx+1);
          setCount(idx);
        }
      } else {
        array = Swap(idx, idx-1, array);
      }
      setData(array);
    }

    useEffect(() => {
      resetData();
    }, [])

    const resetData = (e) => {
      if (e)
        e.preventDefault();
        setCount(0);
        setIdx(0);
        setSorted(false);
        setSmallest(0);

      // 
      var dataValues = Array.from({length: arrayLength}, ()=> Math.floor(Math.random() * 51));
      var newData = [{}];
      dataValues.forEach(num => {
          newData.push({
              value: num,
              color: SetColor(num),
          })
      });
      setData(newData);
    }

    const changeAlgo = (e, index) => {
      e.preventDefault();
      setAlgo(index);

      setCount(0);
      setIdx(0);
      setSorted(false);
      setSmallest(0);
    }

    return (
      <div className="container-fluid">
        <div className="row">
          <button onClick={(e)=>changeAlgo(e, 1)} className="col">Bubble Sort</button>
          <button onClick={(e)=>changeAlgo(e, 2)} className="col">Insertion Sort</button>
          <button onClick={(e)=>changeAlgo(e, 3)} className="col">Selection Sort</button>
        </div>
        <div className="row">
          <button onClick={(e)=>{resetData(e); changeAlgo(e, 0)}} className="col">Reset</button>
          <div className="col Slider">
            <div className="row align-items-center">
              <h1 className="col-sm-3">[Bars]</h1>
              <ReactSlider
              className="horizontal-slider col"
              thumbClassName="thumb"
              trackClassName="track"
              defaultValue={100}
              min = {5}
              max = {200}
              onChange={(e)=>setArrayLength(e)}
              />
            </div>
          </div>
          <div className="col align-items-center Slider">
            <div className="row align-items-center">
              <h1 className="col-sm-3">[Fast]</h1>
              <ReactSlider
              className="horizontal-slider col"
              thumbClassName="thumb"
              trackClassName="track"
              defaultValue={25}
              min = {1}
              max = {100}
              onChange={(e)=>setSpeed(e)}
              />
              <h1 className="col-sm-3">[Slow]</h1>
            </div>
          </div>
        </div>
        <div id="Graph" className="row align-items-end justify-content-center">
            {
                data.map(item =>{
                  try{
                    return (<div className="bar" style={{width: 80/arrayLength +'vw', height: item.value*10, backgroundColor: item.color}}></div>);
                  } catch(error){
                    console.log(error);
                  }
                })
            }
        </div>
      </div>
    );
  }

export default Sorting;