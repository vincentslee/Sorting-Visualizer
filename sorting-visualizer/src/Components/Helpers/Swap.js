export default function Swap(a, b, array){
    var holder = array[a];
    array[a] = array[b];
    array[b] = holder;
    return array;
}