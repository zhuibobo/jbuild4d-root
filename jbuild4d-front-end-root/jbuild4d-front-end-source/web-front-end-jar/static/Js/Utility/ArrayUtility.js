var ArrayUtility = {
    Delete:function (ary, index) {
        ary.splice(index, 1);
    },
    SwapItems:function (ary,index1, index2) {
        //debugger;
        ary[index1] = ary.splice(index2, 1, ary[index1])[0];
        return ary;
    },
    MoveUp:function(arr, $index) {
        if($index == 0) {
            return;
        }
        this.SwapItems(arr, $index, $index - 1);
    },
    MoveDown:function(arr, $index) {
        if($index == arr.length -1) {
            return;
        }
        this.SwapItems(arr, $index, $index + 1);
    }
}