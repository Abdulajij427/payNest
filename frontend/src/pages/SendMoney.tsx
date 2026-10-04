import {Heading} from '../components/Heading'
import {SubHeading} from '../components/SubHeading'
import axios from 'axios';
import {useState} from 'react'

export function SendMoney(){
    const [transfer , setTransfer] = useState("");
    
    return(
        <div className="bg-slate-300 h-screen flex justify-center ">
            <div className="flex flex-col justify-center bg-white h-70 w-70 m-20 p-4 rounded-md">
                <Heading label="Send Money"/>
                <div className="flex flex-col justify-start  ">
                    <SubHeading label="abdul"/>
                    {/* <InputBox placeholder="Enter amount" label="" onChange={()=>{

                    }} />
                    <Button label="initiate Transfer"  onClick={()=>{

                    }}/> */}
                    <input className="m-2  px-2 py-1 border border-gray-400 rounded-sm h-10 p-2" placeholder="Enter amount" onChange={(e)=>{
                        setTransfer(e.target.value);
                    }}/>
                    <button className="bg-green-400 p-2  font-bold text-white px-2 py-1 border border-gray-400 rounded-sm" onChange={async ()=>{
                        await axios.post("http://localhost:3000/api/v1/account/transfer",{

                        })
                    }}>intiate Transfer</button>
                </div>
            </div>
        </div>
    )
}