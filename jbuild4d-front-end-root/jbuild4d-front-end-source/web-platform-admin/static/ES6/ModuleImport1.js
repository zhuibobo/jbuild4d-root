
import {firstName, lastName, year} from 'ModuleExport1.js';

function setName(element) {
    console.log(firstName + ' ' + lastName+"  "+year);
}

export let setNameMethod=setName
//setName();