type ButtonProps ={
    label: string;
    onClick: ()=> void;
}

export function Button({label , onClick}: ButtonProps){
    return(
        <button onClick={onClick} type="button" className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none">
            {label}
        </button>
    )
}