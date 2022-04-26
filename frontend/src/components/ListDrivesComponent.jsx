import {useState} from 'react';
import axios from '../Api/axios';

const ListDrivesComponent = (props) => {
    
    const deleteDrive = async () => {
        let result = await axios.post("/delete-drive", {
            "companyName": props.name,
            "companyStream": props.stream
        }).then((response)=>{
            if(response.data.ack==true)
                console.log("drive deleted");
            else console.log("server side error in deleting - already deleted in the server dB");
        }).catch(err=>{console.log(err);});
    };

    return (
    <div>
        <p>{props.name}</p>
        <p>{props.stream}</p>
        <p>Deadline to apply: {props.deadlineDate}</p>
        <button>more details</button>
        <button onClick={deleteDrive}>delete drive</button>
    </div>
    );
};

export default ListDrivesComponent;