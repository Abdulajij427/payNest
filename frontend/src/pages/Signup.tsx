import {BottomWarning} from "../components/BottomWarning.tsx"
import {Button} from "../components/Button.tsx"
import {Heading} from "../components/Heading"
import {InputBox} from "../components/InputBox"
import {SubHeading} from "../components/SubHeading"
import {useState} from "react"
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

export function Signup(){
    
    const [firstName , setFirstName] = useState("");
    const [lastName , setLastName] = useState("");
    const [username , setUsername] = useState("");
    const [password , setPassword] = useState("");
    const navigate = useNavigate();

    return (
        
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-88 text-center p-2 h-max px-4">
                    <Heading label={"Sign up"}/>
                    <SubHeading label={"Enter your inforamtion to create an account"} />
                    <input onChange={e => {
                        setFirstName(e.target.value);
                    }}/> 
                    <InputBox placeholder="John" label={"First Name"} onChange={(e)=>{
                        setFirstName(e.target.value);
                    }}/>
                    <InputBox onChange={(e)=>{
                        setLastName(e.target.value)
                    }} placeholder="Doe" label={"Last Name"}/>
                    <InputBox onChange={(e)=>{
                        setUsername(e.target.value)
                    }} placeholder="abdulajij@gmail.com" label={"Email"}/>
                    <InputBox onChange={(e)=>{

                        setPassword(e.target.value)
                    }} placeholder="123456" label={"Password"}/>
                    <div className="pt-4">
                        <Button onClick={async ()=>{
                          const res =  await axios.post("http://localhost:3000/api/v1/user/signup", {
                                username,
                                password,
                                firstName,
                                lastName
                            });

                            localStorage.setItem("token", res.data.token);
                            navigate("/dashboard");
                        }} label={"Sign up"}/>
                    </div>
                    <BottomWarning label={"Already have an account"} buttonText={"Sign in"} to={"/Signin"}/>
                </div>
            </div>
        </div>
    )
}