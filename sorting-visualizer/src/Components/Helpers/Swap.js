function Swap(a, b, array){
    var holder = array[a];
    array[a] = array[b];
    array[b] = array[a];
    return array
}

export default Swap();